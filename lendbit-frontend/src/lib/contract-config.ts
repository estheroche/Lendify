// Lendify Core contract configuration for Somnia Network
export const CONTRACT_ADDRESS = '0x2c85A2efb30eE0dd4895BA9E599fcCc89B1ec704' as const // Deployed on Somnia Dream Testnet

// Import the deployed ABI from the contracts folder
import DEPLOYED_ABI from '../../../contracts/lendify_abi.json'

export const LENDIFY_CORE_ABI = DEPLOYED_ABI

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