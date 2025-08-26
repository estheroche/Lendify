// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LendBitZero - Simplified RWA-backed Lending MVP
 * @dev Combines RWA tokenization with lending in one contract for maximum simplicity
 */
contract LendBitZero is ERC721, Ownable, ReentrancyGuard {
    
    // ============================================================================
    // STRUCTS & ENUMS
    // ============================================================================
    
    enum AssetType { RealEstate, Bond, Invoice, Commodity }
    enum LoanStatus { Requested, Active, Repaid, Liquidated }
    
    struct RWAAsset {
        uint256 tokenId;
        AssetType assetType;
        address owner;
        uint256 currentValue;
        string metadataURI;
        bool isLocked;
        bool isVerified;
    }
    
    struct Loan {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 collateralTokenId;
        uint256 principalAmount;
        uint256 interestRate; // basis points (500 = 5%)
        uint256 duration; // in days
        uint256 startTime;
        LoanStatus status;
        uint256 totalRepaid;
    }
    
    // ============================================================================
    // STATE VARIABLES
    // ============================================================================
    
    uint256 public nextTokenId = 1;
    uint256 public nextLoanId = 1;
    uint256 public constant LTV_RATIO = 80; // 80% loan-to-value
    uint256 public constant LIQUIDATION_THRESHOLD = 110; // 110% health factor
    
    mapping(uint256 => RWAAsset) public rwaAssets;
    mapping(uint256 => Loan) public loans;
    mapping(address => bool) public authorizedVerifiers;
    mapping(uint256 => uint256) public assetPrices; // tokenId => price in wei
    
    // ============================================================================
    // EVENTS
    // ============================================================================
    
    event AssetTokenized(uint256 indexed tokenId, address indexed owner, AssetType assetType, uint256 value);
    event AssetVerified(uint256 indexed tokenId, address indexed verifier);
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 collateralId, uint256 amount);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, uint256 amount);
    event AssetLiquidated(uint256 indexed loanId, uint256 indexed tokenId, address indexed newOwner);
    
    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================
    
    constructor() ERC721("LendBitZero RWA", "LBZ") Ownable(msg.sender) {
        authorizedVerifiers[msg.sender] = true; // Owner is default verifier
    }
    
    // ============================================================================
    // RWA TOKENIZATION FUNCTIONS
    // ============================================================================
    
    /**
     * @dev Tokenize a real-world asset as an NFT
     */
    function tokenizeAsset(
        AssetType _assetType,
        uint256 _initialValue,
        string memory _metadataURI
    ) external returns (uint256) {
        require(_initialValue > 0, "Value must be greater than zero");
        
        uint256 tokenId = nextTokenId++;
        
        // Mint NFT to sender
        _mint(msg.sender, tokenId);
        
        // Store asset data
        rwaAssets[tokenId] = RWAAsset({
            tokenId: tokenId,
            assetType: _assetType,
            owner: msg.sender,
            currentValue: _initialValue,
            metadataURI: _metadataURI,
            isLocked: false,
            isVerified: false
        });
        
        // Set initial price
        assetPrices[tokenId] = _initialValue;
        
        emit AssetTokenized(tokenId, msg.sender, _assetType, _initialValue);
        return tokenId;
    }
    
    /**
     * @dev Verify an asset (only authorized verifiers)
     */
    function verifyAsset(uint256 _tokenId) external {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        require(_exists(_tokenId), "Asset does not exist");
        
        rwaAssets[_tokenId].isVerified = true;
        emit AssetVerified(_tokenId, msg.sender);
    }
    
    /**
     * @dev Update asset price (admin/oracle function)
     */
    function updateAssetPrice(uint256 _tokenId, uint256 _newPrice) external onlyOwner {
        require(_exists(_tokenId), "Asset does not exist");
        
        assetPrices[_tokenId] = _newPrice;
        rwaAssets[_tokenId].currentValue = _newPrice;
    }
    
    // ============================================================================
    // LENDING FUNCTIONS
    // ============================================================================
    
    /**
     * @dev Create a loan request using RWA as collateral
     */
    function createLoanRequest(
        uint256 _collateralTokenId,
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _durationDays
    ) external returns (uint256) {
        require(ownerOf(_collateralTokenId) == msg.sender, "Not token owner");
        require(rwaAssets[_collateralTokenId].isVerified, "Asset not verified");
        require(!rwaAssets[_collateralTokenId].isLocked, "Asset already locked");
        
        // Check LTV ratio
        uint256 assetValue = assetPrices[_collateralTokenId];
        uint256 maxLoan = (assetValue * LTV_RATIO) / 100;
        require(_loanAmount <= maxLoan, "Loan amount exceeds LTV");
        
        uint256 loanId = nextLoanId++;
        
        // Lock the asset
        rwaAssets[_collateralTokenId].isLocked = true;
        
        // Create loan
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: msg.sender,
            lender: address(0),
            collateralTokenId: _collateralTokenId,
            principalAmount: _loanAmount,
            interestRate: _interestRate,
            duration: _durationDays,
            startTime: 0,
            status: LoanStatus.Requested,
            totalRepaid: 0
        });
        
        emit LoanRequested(loanId, msg.sender, _collateralTokenId, _loanAmount);
        return loanId;
    }
    
    /**
     * @dev Fund a loan request (lender function)
     */
    function fundLoan(uint256 _loanId) external payable nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Requested, "Loan not available");
        require(msg.value >= loan.principalAmount, "Insufficient funding");
        require(msg.sender != loan.borrower, "Cannot fund own loan");
        
        // Update loan
        loan.lender = msg.sender;
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        
        // Transfer funds to borrower
        payable(loan.borrower).transfer(loan.principalAmount);
        
        // Refund excess
        if (msg.value > loan.principalAmount) {
            payable(msg.sender).transfer(msg.value - loan.principalAmount);
        }
        
        emit LoanFunded(_loanId, msg.sender);
    }
    
    /**
     * @dev Repay a loan
     */
    function repayLoan(uint256 _loanId) external payable nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.borrower == msg.sender, "Not borrower");
        require(loan.status == LoanStatus.Active, "Loan not active");
        
        uint256 totalOwed = calculateTotalOwed(_loanId);
        require(msg.value >= totalOwed, "Insufficient repayment");
        
        // Update loan
        loan.status = LoanStatus.Repaid;
        loan.totalRepaid = totalOwed;
        
        // Unlock collateral
        rwaAssets[loan.collateralTokenId].isLocked = false;
        
        // Pay lender
        payable(loan.lender).transfer(totalOwed);
        
        // Refund excess
        if (msg.value > totalOwed) {
            payable(msg.sender).transfer(msg.value - totalOwed);
        }
        
        emit LoanRepaid(_loanId, totalOwed);
    }
    
    /**
     * @dev Calculate total amount owed (principal + interest)
     */
    function calculateTotalOwed(uint256 _loanId) public view returns (uint256) {
        Loan storage loan = loans[_loanId];
        if (loan.status != LoanStatus.Active) return 0;
        
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 daysElapsed = timeElapsed / 1 days;
        
        // Simple interest calculation
        uint256 interest = (loan.principalAmount * loan.interestRate * daysElapsed) / (365 * 10000);
        return loan.principalAmount + interest;
    }
    
    /**
     * @dev Calculate health factor for liquidation
     */
    function calculateHealthFactor(uint256 _loanId) public view returns (uint256) {
        Loan storage loan = loans[_loanId];
        if (loan.status != LoanStatus.Active) return type(uint256).max;
        
        uint256 collateralValue = assetPrices[loan.collateralTokenId];
        uint256 totalDebt = calculateTotalOwed(_loanId);
        
        if (totalDebt == 0) return type(uint256).max;
        
        return (collateralValue * 100) / totalDebt;
    }
    
    /**
     * @dev Liquidate an unhealthy loan
     */
    function liquidateLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(loan.lender == msg.sender, "Not lender");
        
        uint256 healthFactor = calculateHealthFactor(_loanId);
        require(healthFactor < LIQUIDATION_THRESHOLD, "Loan is healthy");
        
        // Transfer asset ownership to lender
        uint256 tokenId = loan.collateralTokenId;
        _transfer(loan.borrower, loan.lender, tokenId);
        
        // Update asset and loan
        rwaAssets[tokenId].owner = loan.lender;
        rwaAssets[tokenId].isLocked = false;
        loan.status = LoanStatus.Liquidated;
        
        emit AssetLiquidated(_loanId, tokenId, loan.lender);
    }
    
    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================
    
    function getAsset(uint256 _tokenId) external view returns (RWAAsset memory) {
        return rwaAssets[_tokenId];
    }
    
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }
    
    function isLiquidatable(uint256 _loanId) external view returns (bool) {
        return calculateHealthFactor(_loanId) < LIQUIDATION_THRESHOLD;
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
    
    // Override tokenURI to use stored metadata
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return rwaAssets[tokenId].metadataURI;
    }
    
    // Helper function to check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return rwaAssets[tokenId].owner != address(0);
    }
}