// Lendify Core contract configuration for Somnia Network
export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const // Will be updated after deployment

export const LENDIFY_CORE_ABI = [
  // Enhanced asset tokenization functions
  'function tokenizeAsset(uint8 _assetType, uint256 _value, string _metadataURI, bool _requestInstantVerification) returns (uint256)',
  'function submitCommunityVerification(uint256 _assetId, bool _approved, string _notes)',
  
  // Enhanced loan functions
  'function createLoan(uint256 _assetId, uint256 _amount, uint256 _interestRate, uint256 _duration) returns (uint256)',
  'function fundLoan(uint256 _loanId) payable',
  'function repayLoan(uint256 _loanId) payable',
  'function liquidateLoan(uint256 _loanId)',
  
  // Real-time calculation functions
  'function calculateHealthFactor(uint256 _loanId) view returns (uint256)',
  'function calculateTotalOwed(uint256 _loanId) view returns (uint256)',
  'function getCurrentAssetValue(uint256 _assetId) view returns (uint256)',
  'function batchUpdateHealthFactors(uint256[] _loanIds)',
  
  // View functions for enhanced data
  'function getAssetDetails(uint256 _assetId) view returns (uint8, uint256, string, address, bool, uint256, bool)',
  'function getLoanDetails(uint256 _loanId) view returns (uint256, address, address, uint256, uint256, uint8, uint256, bool)',
  'function getProtocolStats() view returns (tuple(uint256 totalValueLocked, uint256 totalLoansOriginated, uint256 protocolFeeCollected, uint256 totalAssets, uint256 totalActiveLoans, uint256 instantLoansProcessed, uint256 communityVerifications, uint256 averageHealthFactor))',
  'function getAssetsByUser(address _user) view returns (uint256[])',
  'function getLoansByUser(address _user) view returns (uint256[])',
  
  // Admin functions
  'function setAuthorizedVerifier(address _verifier, bool _authorized)',
  'function updateAssetPriceMultiplier(uint8 _assetType, uint256 _multiplier)',
  'function setProtocolFeeRate(uint256 _feeRate)',
  
  // Standard ERC721 functions
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  
  // Enhanced events for real-time tracking
  'event AssetTokenized(uint256 indexed tokenId, address indexed owner, uint8 assetType, uint256 value, uint256 timestamp)',
  'event LoanCreated(uint256 indexed loanId, uint256 indexed assetId, address indexed borrower, uint256 amount, uint256 timestamp)',
  'event LoanFunded(uint256 indexed loanId, address indexed lender, uint256 amount, uint256 timestamp)',
  'event LoanRepaid(uint256 indexed loanId, uint256 amount, uint256 timestamp)',
  'event LoanLiquidated(uint256 indexed loanId, address indexed liquidator, uint256 timestamp)',
  'event CommunityVerificationSubmitted(uint256 indexed assetId, address indexed verifier, bool approved, uint256 timestamp)',
  'event RealtimeHealthUpdate(uint256 indexed loanId, uint256 healthFactor, uint256 timestamp)',
  'event InstantLoanExecuted(uint256 indexed assetId, uint256 amount, uint256 timestamp)'
] as const

// Somnia Dream Testnet configuration
export const SOMNIA_CHAIN_CONFIG = {
  id: 50312,
  name: 'Somnia Dream Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' },
  },
  testnet: true,
} as const

export const CHAIN_ID = 50312 // Somnia Dream Testnet

// Enhanced asset types for comprehensive RWA coverage
export enum AssetType {
  RealEstate = 0,
  CorporateBond = 1,
  Invoice = 2,
  Commodity = 3,
  IntellectualProperty = 4,
  Equipment = 5,
  Inventory = 6,
  Receivables = 7
}

export enum LoanStatus {
  Created = 0,
  Funded = 1,
  Active = 2,
  Repaid = 3,
  Liquidated = 4,
  InstantApproved = 5
}

export const ASSET_TYPE_LABELS = {
  [AssetType.RealEstate]: 'Real Estate',
  [AssetType.CorporateBond]: 'Corporate Bond', 
  [AssetType.Invoice]: 'Invoice',
  [AssetType.Commodity]: 'Commodity',
  [AssetType.IntellectualProperty]: 'Intellectual Property',
  [AssetType.Equipment]: 'Equipment',
  [AssetType.Inventory]: 'Inventory',
  [AssetType.Receivables]: 'Receivables'
} as const

export const LOAN_STATUS_LABELS = {
  [LoanStatus.Created]: 'Created',
  [LoanStatus.Funded]: 'Funded',
  [LoanStatus.Active]: 'Active',
  [LoanStatus.Repaid]: 'Repaid',
  [LoanStatus.Liquidated]: 'Liquidated',
  [LoanStatus.InstantApproved]: 'Instant Approved'
} as const

// Enhanced interfaces for Lendify Core
export interface EnhancedAsset {
  tokenId: number
  assetType: AssetType
  value: bigint
  metadataURI: string
  owner: string
  isVerified: boolean
  verificationScore: number
  instantLoanEligible: boolean
  createdAt: number
  currentValue?: bigint
}

export interface EnhancedLoan {
  loanId: number
  assetId: number
  borrower: string
  lender: string
  amount: bigint
  interestRate: number
  duration: number
  status: LoanStatus
  healthFactor: bigint
  isInstantLoan: boolean
  startTime: number
  collateralRatio?: bigint
}

export interface EnhancedProtocolStats {
  totalValueLocked: bigint
  totalLoansOriginated: bigint
  protocolFeeCollected: bigint
  totalAssets: bigint
  totalActiveLoans: bigint
  instantLoansProcessed: bigint
  communityVerifications: bigint
  averageHealthFactor: bigint
}

// Performance metrics for Somnia comparison
export interface PerformanceMetrics {
  transactionsPerSecond: number
  averageBlockTime: number
  networkLatency: number
  gasEfficiency: number
  uptimePercentage: number
}

export interface CommunityVerification {
  assetId: number
  verifier: string
  approved: boolean
  notes: string
  timestamp: number
}

// Network comparison data
export interface NetworkComparison {
  name: string
  chainId: number
  tps: number
  blockTime: number
  finality: string
  gasEfficiency: string
  features: string[]
}