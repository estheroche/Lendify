// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LendifyFixed is ERC721, Ownable, ReentrancyGuard {
    
    // ============================================================================
    // STRUCTS & ENUMS (Based on real implementations)
    // ============================================================================
    
    enum AssetType { RealEstate, Bond, Invoice, Commodity }
    enum LoanStatus { Requested, Funded, Active, Repaid, Liquidated, Defaulted }
    enum ListingStatus { Pending, Approved, Rejected }
    
    struct RWAAsset {
        uint256 tokenId;
        AssetType assetType;
        address owner;
        uint256 currentValue;
        string metadataURI;
        string description;
        string location;
        bool isVerified;
        bool isLocked;
        ListingStatus approvalStatus;
        uint256 createdAt;
    }
    
    struct Loan {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 collateralTokenId;
        uint256 requestedAmount;
        uint256 fundedAmount;
        uint256 interestRate; // basis points (500 = 5%)
        uint256 durationDays;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 dueDate;
        LoanStatus status;
        uint256 totalRepaid;
        uint256 lastPaymentDate;
    }
    
    struct LoanRequest {
        uint256 requestId;
        address borrower;
        uint256 collateralTokenId;
        uint256 requestedAmount;
        uint256 interestRate;
        uint256 durationDays;
        string purpose;
        LoanStatus status;
        uint256 createdAt;
    }
    
    // ============================================================================
    // STATE VARIABLES (Based on both protocols)
    // ============================================================================
    
    // Core counters
    uint256 public nextTokenId = 1;
    uint256 public nextLoanId = 1;
    uint256 public nextRequestId = 1;
    
    // Protocol parameters (from xLendBit)
    uint256 public constant LTV_RATIO = 80; // 80% max loan-to-value
    uint256 public constant LIQUIDATION_THRESHOLD = 110; // 110% = liquidation trigger
    uint256 public constant PROTOCOL_FEE = 100; // 1% protocol fee (in basis points)
    
    // Storage mappings
    mapping(uint256 => RWAAsset) public assets;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(uint256 => uint256) public assetPrices; // tokenId => current price
    
    // Access control (from COiTON approval system)
    mapping(address => bool) public authorizedVerifiers;
    mapping(address => bool) public authorizedOracles;
    
    // User mappings
    mapping(address => uint256[]) public userAssets;
    mapping(address => uint256[]) public userLoans;
    mapping(address => uint256[]) public userRequests;
    
    // Protocol stats
    uint256 public totalValueLocked;
    uint256 public totalLoansOriginated;
    uint256 public protocolFeeCollected;
    
    // ============================================================================
    // EVENTS (Comprehensive event system)
    // ============================================================================
    
    event AssetTokenized(
        uint256 indexed tokenId,
        address indexed owner,
        AssetType assetType,
        uint256 value,
        string location
    );
    
    event AssetApproved(uint256 indexed tokenId, address indexed verifier);
    event AssetRejected(uint256 indexed tokenId, address indexed verifier, string reason);
    
    event LoanRequested(
        uint256 indexed requestId,
        address indexed borrower,
        uint256 indexed collateralTokenId,
        uint256 amount,
        uint256 interestRate
    );
    
    event LoanFunded(
        uint256 indexed loanId,
        uint256 indexed requestId,
        address indexed lender,
        uint256 amount
    );
    
    event LoanRepayment(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remaining
    );
    
    event LoanLiquidated(
        uint256 indexed loanId,
        address indexed liquidator,
        uint256 collateralValue
    );
    
    event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
    
    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================
    
    constructor() ERC721("LendBit RWA Assets", "LBRWA") Ownable(msg.sender) {
        // Set up initial access control
        authorizedVerifiers[msg.sender] = true;
        authorizedOracles[msg.sender] = true;
    }
    
    // ============================================================================
    // MODIFIERS
    // ============================================================================
    
    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        _;
    }
    
    modifier onlyOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }
    
    modifier validAsset(uint256 tokenId) {
        require(_exists(tokenId), "Asset does not exist");
        require(assets[tokenId].isVerified, "Asset not verified");
        _;
    }
    
    // ============================================================================
    // ASSET TOKENIZATION (Based on COiTON listing system)
    // ============================================================================
    
    /**
     * @dev Tokenize a real-world asset (similar to COiTON createListing)
     */
    function tokenizeAsset(
        AssetType _assetType,
        uint256 _estimatedValue,
        string memory _description,
        string memory _location,
        string memory _metadataURI
    ) external returns (uint256) {
        require(_estimatedValue > 0, "Value must be greater than zero");
        require(bytes(_description).length > 0, "Description required");
        require(bytes(_location).length > 0, "Location required");
        
        uint256 tokenId = nextTokenId++;
        
        // Mint NFT to creator
        _mint(msg.sender, tokenId);
        
        // Create asset record
        assets[tokenId] = RWAAsset({
            tokenId: tokenId,
            assetType: _assetType,
            owner: msg.sender,
            currentValue: _estimatedValue,
            metadataURI: _metadataURI,
            description: _description,
            location: _location,
            isVerified: false,
            isLocked: false,
            approvalStatus: ListingStatus.Pending,
            createdAt: block.timestamp
        });
        
        // Set initial price
        assetPrices[tokenId] = _estimatedValue;
        
        // Update user mapping
        userAssets[msg.sender].push(tokenId);
        
        emit AssetTokenized(tokenId, msg.sender, _assetType, _estimatedValue, _location);
        return tokenId;
    }
    
    /**
     * @dev Verify asset for lending eligibility (COiTON-style approval)
     */
    function verifyAsset(uint256 _tokenId, bool _approved, string memory _reason) 
        external 
        onlyVerifier 
    {
        require(_exists(_tokenId), "Asset does not exist");
        require(assets[_tokenId].approvalStatus == ListingStatus.Pending, "Already processed");
        
        if (_approved) {
            assets[_tokenId].isVerified = true;
            assets[_tokenId].approvalStatus = ListingStatus.Approved;
            emit AssetApproved(_tokenId, msg.sender);
        } else {
            assets[_tokenId].approvalStatus = ListingStatus.Rejected;
            emit AssetRejected(_tokenId, msg.sender, _reason);
        }
    }
    
    /**
     * @dev Update asset price (Oracle function)
     */
    function updateAssetPrice(uint256 _tokenId, uint256 _newPrice) 
        external 
        onlyOracle 
        validAsset(_tokenId) 
    {
        uint256 oldPrice = assetPrices[_tokenId];
        assetPrices[_tokenId] = _newPrice;
        assets[_tokenId].currentValue = _newPrice;
        
        emit PriceUpdated(_tokenId, oldPrice, _newPrice);
    }
    
    // ============================================================================
    // LENDING SYSTEM (Based on xLendBit Operations.sol)
    // ============================================================================
    
    /**
     * @dev Create loan request using RWA as collateral
     */
    function createLoanRequest(
        uint256 _collateralTokenId,
        uint256 _requestedAmount,
        uint256 _interestRate,
        uint256 _durationDays,
        string memory _purpose
    ) external validAsset(_collateralTokenId) returns (uint256) {
        require(ownerOf(_collateralTokenId) == msg.sender, "Not asset owner");
        require(!assets[_collateralTokenId].isLocked, "Asset already locked");
        require(_requestedAmount > 0, "Invalid loan amount");
        require(_durationDays >= 7 && _durationDays <= 1095, "Invalid duration"); // 7 days to 3 years
        
        // Check LTV ratio
        uint256 assetValue = assetPrices[_collateralTokenId];
        uint256 maxLoanAmount = (assetValue * LTV_RATIO) / 100;
        require(_requestedAmount <= maxLoanAmount, "Exceeds LTV ratio");
        
        uint256 requestId = nextRequestId++;
        
        // Create loan request
        loanRequests[requestId] = LoanRequest({
            requestId: requestId,
            borrower: msg.sender,
            collateralTokenId: _collateralTokenId,
            requestedAmount: _requestedAmount,
            interestRate: _interestRate,
            durationDays: _durationDays,
            purpose: _purpose,
            status: LoanStatus.Requested,
            createdAt: block.timestamp
        });
        
        // Lock the collateral asset
        assets[_collateralTokenId].isLocked = true;
        
        // Update user mapping
        userRequests[msg.sender].push(requestId);
        
        emit LoanRequested(requestId, msg.sender, _collateralTokenId, _requestedAmount, _interestRate);
        return requestId;
    }
    
    /**
     * @dev Fund a loan request (lender function)
     */
    function fundLoan(uint256 _requestId) external payable nonReentrant {
        LoanRequest storage request = loanRequests[_requestId];
        require(request.status == LoanStatus.Requested, "Request not available");
        require(msg.sender != request.borrower, "Cannot fund own request");
        require(msg.value >= request.requestedAmount, "Insufficient funding");
        
        uint256 loanId = nextLoanId++;
        
        // Calculate protocol fee
        uint256 protocolFee = (request.requestedAmount * PROTOCOL_FEE) / 10000;
        uint256 borrowerAmount = request.requestedAmount - protocolFee;
        
        // Create loan record
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: request.borrower,
            lender: msg.sender,
            collateralTokenId: request.collateralTokenId,
            requestedAmount: request.requestedAmount,
            fundedAmount: request.requestedAmount,
            interestRate: request.interestRate,
            durationDays: request.durationDays,
            createdAt: request.createdAt,
            fundedAt: block.timestamp,
            dueDate: block.timestamp + (request.durationDays * 1 days),
            status: LoanStatus.Active,
            totalRepaid: 0,
            lastPaymentDate: 0
        });
        
        // Update request status
        request.status = LoanStatus.Funded;
        
        // Update mappings and stats
        userLoans[request.borrower].push(loanId);
        userLoans[msg.sender].push(loanId);
        totalLoansOriginated += request.requestedAmount;
        totalValueLocked += assetPrices[request.collateralTokenId];
        protocolFeeCollected += protocolFee;
        
        // Transfer funds
        payable(request.borrower).transfer(borrowerAmount);
        
        // Refund excess payment
        if (msg.value > request.requestedAmount) {
            payable(msg.sender).transfer(msg.value - request.requestedAmount);
        }
        
        emit LoanFunded(loanId, _requestId, msg.sender, request.requestedAmount);
    }
    
    /**
     * @dev Repay loan (partial or full)
     */
    function repayLoan(uint256 _loanId) external payable nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.borrower == msg.sender, "Not loan borrower");
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.value > 0, "Payment amount required");
        
        uint256 totalOwed = calculateTotalOwed(_loanId);
        uint256 paymentAmount = msg.value;
        
        if (paymentAmount >= totalOwed) {
            // Full repayment
            loan.totalRepaid = totalOwed;
            loan.status = LoanStatus.Repaid;
            loan.lastPaymentDate = block.timestamp;
            
            // Unlock collateral
            assets[loan.collateralTokenId].isLocked = false;
            
            // Transfer payment to lender
            payable(loan.lender).transfer(totalOwed);
            
            // Refund excess
            if (paymentAmount > totalOwed) {
                payable(msg.sender).transfer(paymentAmount - totalOwed);
            }
            
            emit LoanRepayment(_loanId, msg.sender, totalOwed, 0);
        } else {
            // Partial repayment
            loan.totalRepaid += paymentAmount;
            loan.lastPaymentDate = block.timestamp;
            
            // Transfer payment to lender
            payable(loan.lender).transfer(paymentAmount);
            
            emit LoanRepayment(_loanId, msg.sender, paymentAmount, totalOwed - loan.totalRepaid);
        }
    }
    
    /**
     * @dev Calculate total amount owed (principal + accrued interest)
     */
    function calculateTotalOwed(uint256 _loanId) public view returns (uint256) {
        Loan storage loan = loans[_loanId];
        if (loan.status != LoanStatus.Active) return 0;
        
        uint256 timeElapsed = block.timestamp - loan.fundedAt;
        uint256 daysElapsed = timeElapsed / 1 days;
        
        // Simple interest calculation: Principal * Rate * Time / 10000 / 365
        uint256 interest = (loan.fundedAmount * loan.interestRate * daysElapsed) / (365 * 10000);
        uint256 totalOwed = loan.fundedAmount + interest;
        
        // Return remaining amount after previous payments
        return totalOwed > loan.totalRepaid ? totalOwed - loan.totalRepaid : 0;
    }
    
    // ============================================================================
    // LIQUIDATION SYSTEM (xLendBit-inspired)
    // ============================================================================
    
    /**
     * @dev Calculate health factor for liquidation (collateral value / debt ratio)
     */
    function calculateHealthFactor(uint256 _loanId) public view returns (uint256) {
        Loan storage loan = loans[_loanId];
        if (loan.status != LoanStatus.Active) return type(uint256).max;
        
        uint256 collateralValue = assetPrices[loan.collateralTokenId];
        uint256 totalDebt = calculateTotalOwed(_loanId);
        
        if (totalDebt == 0) return type(uint256).max;
        
        // Health factor = (Collateral Value * 100) / Total Debt
        return (collateralValue * 100) / totalDebt;
    }
    
    /**
     * @dev Check if loan is eligible for liquidation
     */
    function isLiquidatable(uint256 _loanId) public view returns (bool) {
        Loan storage loan = loans[_loanId];
        if (loan.status != LoanStatus.Active) return false;
        
        // Check if loan is overdue OR undercollateralized
        bool isOverdue = block.timestamp > loan.dueDate;
        bool isUndercollateralized = calculateHealthFactor(_loanId) < LIQUIDATION_THRESHOLD;
        
        return isOverdue || isUndercollateralized;
    }
    
    /**
     * @dev Liquidate an eligible loan
     */
    function liquidateLoan(uint256 _loanId) external nonReentrant {
        require(isLiquidatable(_loanId), "Loan not liquidatable");
        
        Loan storage loan = loans[_loanId];
        uint256 tokenId = loan.collateralTokenId;
        
        // Calculate liquidation penalty (5% to liquidator)
        uint256 assetValue = assetPrices[tokenId];
        uint256 liquidatorReward = (assetValue * 500) / 10000; // 5%
        
        // Transfer asset to lender (or liquidator if different)
        address newOwner = loan.lender;
        if (msg.sender != loan.lender) {
            // External liquidator gets reward, asset goes to lender
            payable(msg.sender).transfer(liquidatorReward);
            newOwner = loan.lender;
        }
        
        // Transfer NFT ownership
        _transfer(loan.borrower, newOwner, tokenId);
        
        // Update asset and loan status
        assets[tokenId].owner = newOwner;
        assets[tokenId].isLocked = false;
        loan.status = LoanStatus.Liquidated;
        
        emit LoanLiquidated(_loanId, msg.sender, assetValue);
    }
    
    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================
    
    function getAsset(uint256 _tokenId) external view returns (RWAAsset memory) {
        return assets[_tokenId];
    }
    
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }
    
    function getLoanRequest(uint256 _requestId) external view returns (LoanRequest memory) {
        return loanRequests[_requestId];
    }
    
    function getUserAssets(address _user) external view returns (uint256[] memory) {
        return userAssets[_user];
    }
    
    function getUserLoans(address _user) external view returns (uint256[] memory) {
        return userLoans[_user];
    }
    
    function getProtocolStats() external view returns (
        uint256 _totalValueLocked,
        uint256 _totalLoansOriginated,
        uint256 _protocolFeeCollected,
        uint256 _totalAssets,
        uint256 _totalLoans
    ) {
        return (
            totalValueLocked,
            totalLoansOriginated,
            protocolFeeCollected,
            nextTokenId - 1,
            nextLoanId - 1
        );
    }
    
    // ============================================================================
    // ADMIN FUNCTIONS
    // ============================================================================
    
    function addVerifier(address _verifier) external onlyOwner {
        authorizedVerifiers[_verifier] = true;
    }
    
    function removeVerifier(address _verifier) external onlyOwner {
        authorizedVerifiers[_verifier] = false;
    }
    
    function addOracle(address _oracle) external onlyOwner {
        authorizedOracles[_oracle] = true;
    }
    
    function removeOracle(address _oracle) external onlyOwner {
        authorizedOracles[_oracle] = false;
    }
    
    function withdrawProtocolFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
    
    function emergencyPause(uint256 _loanId) external onlyOwner {
        // Emergency function to pause problematic loans
        loans[_loanId].status = LoanStatus.Defaulted;
    }
    
    // ============================================================================
    // OVERRIDES
    // ============================================================================
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return assets[tokenId].metadataURI;
    }
    
    // Internal function to check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return assets[tokenId].owner != address(0);
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}
