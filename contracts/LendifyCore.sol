// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title LendifyCore
 * @dev Enhanced RWA lending protocol optimized for Somnia's ultra-high performance (1M+ TPS)
 * Features real-time asset tokenization, instant loans, and community verification
 */
contract LendifyCore is ERC721, Ownable, ReentrancyGuard {
    using Math for uint256;

    // Enhanced events for real-time tracking on Somnia
    event AssetTokenized(uint256 indexed tokenId, address indexed owner, AssetType assetType, uint256 value, uint256 timestamp);
    event LoanCreated(uint256 indexed loanId, uint256 indexed assetId, address indexed borrower, uint256 amount, uint256 timestamp);
    event LoanFunded(uint256 indexed loanId, address indexed lender, uint256 amount, uint256 timestamp);
    event LoanRepaid(uint256 indexed loanId, uint256 amount, uint256 timestamp);
    event LoanLiquidated(uint256 indexed loanId, address indexed liquidator, uint256 timestamp);
    event CommunityVerificationSubmitted(uint256 indexed assetId, address indexed verifier, bool approved, uint256 timestamp);
    event RealtimeHealthUpdate(uint256 indexed loanId, uint256 healthFactor, uint256 timestamp);
    event InstantLoanExecuted(uint256 indexed assetId, uint256 amount, uint256 timestamp);

    // Enhanced asset types for comprehensive RWA coverage
    enum AssetType { 
        RealEstate, 
        CorporateBond, 
        Invoice, 
        Commodity, 
        IntellectualProperty,
        Equipment,
        Inventory,
        Receivables
    }

    // Enhanced loan status for real-time tracking
    enum LoanStatus { 
        Created, 
        Funded, 
        Active, 
        Repaid, 
        Liquidated, 
        InstantApproved 
    }

    // Enhanced asset structure optimized for Somnia's speed
    struct Asset {
        AssetType assetType;
        uint256 value;
        string metadataURI;
        address owner;
        bool isVerified;
        uint256 verificationScore; // Community verification score (0-100)
        uint256 createdAt;
        uint256 lastValuation;
        mapping(address => bool) verifiers; // Community verifiers
        uint8 verificationCount;
        bool instantLoanEligible; // For sub-second loan approval
    }

    // Enhanced loan structure with real-time capabilities
    struct Loan {
        uint256 assetId;
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        uint256 startTime;
        uint256 lastPayment;
        LoanStatus status;
        uint256 healthFactor; // Real-time health factor (scaled by 1e18)
        bool isInstantLoan; // For sub-second processing
        uint256 collateralRatio; // Dynamic collateral ratio
    }

    // Enhanced protocol statistics for real-time dashboards
    struct ProtocolStats {
        uint256 totalValueLocked;
        uint256 totalLoansOriginated;
        uint256 protocolFeeCollected;
        uint256 totalAssets;
        uint256 totalActiveLoans;
        uint256 instantLoansProcessed;
        uint256 communityVerifications;
        uint256 averageHealthFactor;
    }

    // State variables optimized for high-frequency access
    mapping(uint256 => Asset) public assets;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userAssets;
    mapping(address => uint256[]) public userLoans;
    mapping(AssetType => uint256) public assetTypeMinValues; // Minimum values per asset type
    mapping(address => bool) public authorizedVerifiers; // Authorized community verifiers
    mapping(uint256 => uint256[]) public assetPriceHistory; // Price history for assets

    uint256 public nextAssetId = 1;
    uint256 public nextLoanId = 1;
    uint256 public protocolFeeRate = 50; // 0.5%
    uint256 public constant MAX_LTV = 8000; // 80%
    uint256 public constant LIQUIDATION_THRESHOLD = 8500; // 85%
    uint256 public constant INSTANT_LOAN_THRESHOLD = 9000; // 90% for instant approval
    uint256 public constant HEALTH_FACTOR_PRECISION = 1e18;

    // Enhanced protocol statistics
    ProtocolStats public protocolStats;

    // Real-time price feeds (mock for demo)
    mapping(AssetType => uint256) public assetTypePriceMultipliers;

    constructor() ERC721("Lendify RWA Tokens", "LRWA") Ownable(msg.sender) {
        // Initialize asset type minimum values
        assetTypeMinValues[AssetType.RealEstate] = 100000 * 1e18; // 100k minimum
        assetTypeMinValues[AssetType.CorporateBond] = 50000 * 1e18; // 50k minimum
        assetTypeMinValues[AssetType.Invoice] = 10000 * 1e18; // 10k minimum
        assetTypeMinValues[AssetType.Commodity] = 25000 * 1e18; // 25k minimum
        assetTypeMinValues[AssetType.IntellectualProperty] = 75000 * 1e18; // 75k minimum
        assetTypeMinValues[AssetType.Equipment] = 20000 * 1e18; // 20k minimum
        assetTypeMinValues[AssetType.Inventory] = 15000 * 1e18; // 15k minimum
        assetTypeMinValues[AssetType.Receivables] = 5000 * 1e18; // 5k minimum

        // Initialize price multipliers for real-time valuation
        assetTypePriceMultipliers[AssetType.RealEstate] = 1e18;
        assetTypePriceMultipliers[AssetType.CorporateBond] = 1e18;
        assetTypePriceMultipliers[AssetType.Invoice] = 1e18;
        assetTypePriceMultipliers[AssetType.Commodity] = 1e18;
        assetTypePriceMultipliers[AssetType.IntellectualProperty] = 1e18;
        assetTypePriceMultipliers[AssetType.Equipment] = 1e18;
        assetTypePriceMultipliers[AssetType.Inventory] = 1e18;
        assetTypePriceMultipliers[AssetType.Receivables] = 1e18;
    }

    /**
     * @dev Enhanced asset tokenization with instant verification for high-value assets
     */
    function tokenizeAsset(
        AssetType _assetType,
        uint256 _value,
        string memory _metadataURI,
        bool _requestInstantVerification
    ) external returns (uint256) {
        require(_value >= assetTypeMinValues[_assetType], "Asset value below minimum");
        
        uint256 tokenId = nextAssetId++;
        
        Asset storage newAsset = assets[tokenId];
        newAsset.assetType = _assetType;
        newAsset.value = _value;
        newAsset.metadataURI = _metadataURI;
        newAsset.owner = msg.sender;
        newAsset.createdAt = block.timestamp;
        newAsset.lastValuation = block.timestamp;
        
        // Instant verification for high-value assets
        if (_requestInstantVerification && _value >= assetTypeMinValues[_assetType] * 10) {
            newAsset.isVerified = true;
            newAsset.verificationScore = 85; // High initial score
            newAsset.instantLoanEligible = true;
        }
        
        _safeMint(msg.sender, tokenId);
        userAssets[msg.sender].push(tokenId);
        
        // Update protocol stats
        protocolStats.totalAssets++;
        protocolStats.totalValueLocked += _value;
        
        emit AssetTokenized(tokenId, msg.sender, _assetType, _value, block.timestamp);
        
        return tokenId;
    }

    /**
     * @dev Community verification system for decentralized asset validation
     */
    function submitCommunityVerification(
        uint256 _assetId,
        bool _approved,
        string memory _notes
    ) external {
        require(_exists(_assetId), "Asset does not exist");
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        
        Asset storage asset = assets[_assetId];
        require(!asset.verifiers[msg.sender], "Already verified by this address");
        
        asset.verifiers[msg.sender] = true;
        asset.verificationCount++;
        
        if (_approved) {
            asset.verificationScore += 10; // Increase score for positive verification
        }
        
        // Auto-verify if enough positive verifications
        if (asset.verificationScore >= 70 && asset.verificationCount >= 3) {
            asset.isVerified = true;
            asset.instantLoanEligible = true;
        }
        
        protocolStats.communityVerifications++;
        
        emit CommunityVerificationSubmitted(_assetId, msg.sender, _approved, block.timestamp);
    }

    /**
     * @dev Enhanced loan creation with instant approval for verified assets
     */
    function createLoan(
        uint256 _assetId,
        uint256 _amount,
        uint256 _interestRate,
        uint256 _duration
    ) external returns (uint256) {
        require(ownerOf(_assetId) == msg.sender, "Not asset owner");
        require(_exists(_assetId), "Asset does not exist");
        
        Asset storage asset = assets[_assetId];
        uint256 maxLoanAmount = (asset.value * MAX_LTV) / 10000;
        require(_amount <= maxLoanAmount, "Loan amount exceeds maximum LTV");
        
        uint256 loanId = nextLoanId++;
        
        Loan storage newLoan = loans[loanId];
        newLoan.assetId = _assetId;
        newLoan.borrower = msg.sender;
        newLoan.amount = _amount;
        newLoan.interestRate = _interestRate;
        newLoan.duration = _duration;
        newLoan.status = LoanStatus.Created;
        newLoan.collateralRatio = (asset.value * 1e18) / _amount;
        newLoan.healthFactor = calculateHealthFactor(loanId);
        
        // Instant loan processing for verified high-value assets
        if (asset.instantLoanEligible && asset.isVerified && _amount <= (asset.value * INSTANT_LOAN_THRESHOLD) / 10000) {
            newLoan.status = LoanStatus.InstantApproved;
            newLoan.isInstantLoan = true;
            protocolStats.instantLoansProcessed++;
            
            emit InstantLoanExecuted(_assetId, _amount, block.timestamp);
        }
        
        userLoans[msg.sender].push(loanId);
        protocolStats.totalLoansOriginated++;
        
        emit LoanCreated(loanId, _assetId, msg.sender, _amount, block.timestamp);
        
        return loanId;
    }

    /**
     * @dev Enhanced loan funding with real-time processing
     */
    function fundLoan(uint256 _loanId) external payable nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Created || loan.status == LoanStatus.InstantApproved, "Loan not available");
        require(msg.value == loan.amount, "Incorrect funding amount");
        require(msg.sender != loan.borrower, "Cannot fund own loan");
        
        loan.lender = msg.sender;
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        loan.lastPayment = block.timestamp;
        
        // Transfer funds to borrower
        payable(loan.borrower).transfer(msg.value);
        
        protocolStats.totalActiveLoans++;
        
        emit LoanFunded(_loanId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Real-time health factor calculation optimized for Somnia's speed
     */
    function calculateHealthFactor(uint256 _loanId) public view returns (uint256) {
        Loan storage loan = loans[_loanId];
        if (loan.amount == 0) return type(uint256).max;
        
        Asset storage asset = assets[loan.assetId];
        uint256 currentAssetValue = getCurrentAssetValue(loan.assetId);
        
        // Health factor = (Collateral Value * Liquidation Threshold) / Loan Amount
        uint256 healthFactor = (currentAssetValue * LIQUIDATION_THRESHOLD * HEALTH_FACTOR_PRECISION) / 
                              (loan.amount * 10000);
        
        return healthFactor;
    }

    /**
     * @dev Real-time asset valuation with price feed integration
     */
    function getCurrentAssetValue(uint256 _assetId) public view returns (uint256) {
        Asset storage asset = assets[_assetId];
        uint256 baseValue = asset.value;
        uint256 multiplier = assetTypePriceMultipliers[asset.assetType];
        
        // Apply time-based appreciation/depreciation
        uint256 timeElapsed = block.timestamp - asset.createdAt;
        uint256 adjustmentFactor = 1e18; // Base factor
        
        // Simple time-based adjustment (can be enhanced with real price feeds)
        if (asset.assetType == AssetType.RealEstate) {
            // Real estate typically appreciates ~3% annually
            adjustmentFactor += (timeElapsed * 3e15) / (365 days);
        } else if (asset.assetType == AssetType.Commodity) {
            // Commodities can be volatile, use multiplier
            adjustmentFactor = multiplier;
        }
        
        return (baseValue * adjustmentFactor) / 1e18;
    }

    /**
     * @dev Enhanced repayment with automatic health factor updates
     */
    function repayLoan(uint256 _loanId) external payable nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.sender == loan.borrower, "Not borrower");
        
        uint256 totalOwed = calculateTotalOwed(_loanId);
        require(msg.value >= totalOwed, "Insufficient payment amount");
        
        loan.status = LoanStatus.Repaid;
        loan.lastPayment = block.timestamp;
        
        // Calculate protocol fee
        uint256 protocolFee = (msg.value * protocolFeeRate) / 10000;
        uint256 lenderPayment = msg.value - protocolFee;
        
        // Transfer payments
        payable(loan.lender).transfer(lenderPayment);
        payable(owner()).transfer(protocolFee);
        
        // Update protocol stats
        protocolStats.totalActiveLoans--;
        protocolStats.protocolFeeCollected += protocolFee;
        
        emit LoanRepaid(_loanId, msg.value, block.timestamp);
    }

    /**
     * @dev Real-time liquidation system with automatic triggers
     */
    function liquidateLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        
        uint256 currentHealthFactor = calculateHealthFactor(_loanId);
        require(currentHealthFactor < HEALTH_FACTOR_PRECISION, "Loan is healthy");
        
        loan.status = LoanStatus.Liquidated;
        
        // Transfer asset to liquidator (simplified for demo)
        _transfer(loan.borrower, msg.sender, loan.assetId);
        
        // Update protocol stats
        protocolStats.totalActiveLoans--;
        
        emit LoanLiquidated(_loanId, msg.sender, block.timestamp);
    }

    /**
     * @dev Calculate total amount owed including interest
     */
    function calculateTotalOwed(uint256 _loanId) public view returns (uint256) {
        Loan storage loan = loans[_loanId];
        if (loan.status != LoanStatus.Active) return 0;
        
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 annualInterest = (loan.amount * loan.interestRate) / 10000;
        uint256 interest = (annualInterest * timeElapsed) / (365 days);
        
        return loan.amount + interest;
    }

    /**
     * @dev Batch update health factors for real-time monitoring
     */
    function batchUpdateHealthFactors(uint256[] calldata _loanIds) external {
        for (uint256 i = 0; i < _loanIds.length; i++) {
            uint256 loanId = _loanIds[i];
            if (loans[loanId].status == LoanStatus.Active) {
                uint256 newHealthFactor = calculateHealthFactor(loanId);
                loans[loanId].healthFactor = newHealthFactor;
                
                emit RealtimeHealthUpdate(loanId, newHealthFactor, block.timestamp);
            }
        }
        
        // Update average health factor
        _updateAverageHealthFactor();
    }

    /**
     * @dev Internal function to update average health factor
     */
    function _updateAverageHealthFactor() internal {
        uint256 totalHealthFactor = 0;
        uint256 activeLoanCount = 0;
        
        for (uint256 i = 1; i < nextLoanId; i++) {
            if (loans[i].status == LoanStatus.Active) {
                totalHealthFactor += loans[i].healthFactor;
                activeLoanCount++;
            }
        }
        
        if (activeLoanCount > 0) {
            protocolStats.averageHealthFactor = totalHealthFactor / activeLoanCount;
        }
    }

    // Admin functions for protocol management
    function setAuthorizedVerifier(address _verifier, bool _authorized) external onlyOwner {
        authorizedVerifiers[_verifier] = _authorized;
    }

    function updateAssetPriceMultiplier(AssetType _assetType, uint256 _multiplier) external onlyOwner {
        assetTypePriceMultipliers[_assetType] = _multiplier;
    }

    function setProtocolFeeRate(uint256 _feeRate) external onlyOwner {
        require(_feeRate <= 500, "Fee rate too high"); // Max 5%
        protocolFeeRate = _feeRate;
    }

    // View functions for frontend integration
    function getAssetsByUser(address _user) external view returns (uint256[] memory) {
        return userAssets[_user];
    }

    function getLoansByUser(address _user) external view returns (uint256[] memory) {
        return userLoans[_user];
    }

    function getProtocolStats() external view returns (ProtocolStats memory) {
        return protocolStats;
    }

    function getAssetDetails(uint256 _assetId) external view returns (
        AssetType assetType,
        uint256 value,
        string memory metadataURI,
        address owner,
        bool isVerified,
        uint256 verificationScore,
        bool instantLoanEligible
    ) {
        Asset storage asset = assets[_assetId];
        return (
            asset.assetType,
            asset.value,
            asset.metadataURI,
            asset.owner,
            asset.isVerified,
            asset.verificationScore,
            asset.instantLoanEligible
        );
    }

    function getLoanDetails(uint256 _loanId) external view returns (
        uint256 assetId,
        address borrower,
        address lender,
        uint256 amount,
        uint256 interestRate,
        LoanStatus status,
        uint256 healthFactor,
        bool isInstantLoan
    ) {
        Loan storage loan = loans[_loanId];
        return (
            loan.assetId,
            loan.borrower,
            loan.lender,
            loan.amount,
            loan.interestRate,
            loan.status,
            loan.healthFactor,
            loan.isInstantLoan
        );
    }
}