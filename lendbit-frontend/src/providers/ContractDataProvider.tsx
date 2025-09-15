'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { 
  useGetUserAssets, 
  useWatchAssetTokenized, 
  useWatchLoanRequested, 
  useWatchLoanFunded, 
  useWatchLoanRepaid,
  useWatchAssetLiquidated,
  useGetConstants,
  formatContractAsset,
  formatContractLoan
} from '@/hooks/useLendifyContract'

interface Asset {
  tokenId: number
  assetType: number
  owner: string
  currentValue: bigint
  metadataURI: string
  isLocked: boolean
  isVerified: boolean
}

interface Loan {
  loanId: number
  borrower: string
  lender: string
  collateralTokenId: number
  principalAmount: bigint
  interestRate: number
  duration: number
  startTime: number
  status: number
  totalRepaid: bigint
}

interface ContractDataContextType {
  // Assets
  userAssets: Asset[]
  totalAssets: number
  isLoadingAssets: boolean
  
  // Loans
  userLoans: Loan[]
  availableLoans: Loan[]
  totalLoans: number
  isLoadingLoans: boolean
  
  // Constants
  liquidationThreshold: bigint | undefined
  ltvRatio: bigint | undefined
  
  // Protocol stats
  protocolStats: {
    totalValueLocked: bigint
    totalLoansOriginated: bigint
    totalActiveLoans: bigint
  }
  
  // Real-time events
  recentActivity: Array<{
    id: string
    type: 'asset_tokenized' | 'loan_requested' | 'loan_funded' | 'loan_repaid' | 'asset_liquidated'
    timestamp: number
    data: any
  }>
  
  // Loading states
  isConnected: boolean
  address: string | undefined
  
  // Functions
  refreshData: () => void
}

const ContractDataContext = createContext<ContractDataContextType | undefined>(undefined)

export function ContractDataProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const { data: userBalance, isLoading: isLoadingAssets, refetch: refetchAssets } = useGetUserAssets(address)
  const { liquidationThreshold, ltvRatio } = useGetConstants()
  
  // State
  const [userAssets, setUserAssets] = useState<Asset[]>([])
  const [userLoans, setUserLoans] = useState<Loan[]>([])
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([])
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string
    type: 'asset_tokenized' | 'loan_requested' | 'loan_funded' | 'loan_repaid' | 'asset_liquidated'
    timestamp: number
    data: any
  }>>([])
  
  const [protocolStats, setProtocolStats] = useState({
    totalValueLocked: BigInt(0),
    totalLoansOriginated: BigInt(0),
    totalActiveLoans: BigInt(0),
  })

  // Watch for real-time events
  useWatchAssetTokenized((log) => {
    const newActivity = {
      id: `asset_${log.args.tokenId}_${Date.now()}`,
      type: 'asset_tokenized' as const,
      timestamp: Date.now(),
      data: {
        tokenId: log.args.tokenId,
        owner: log.args.owner,
        assetType: log.args.assetType,
        value: log.args.value,
      }
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)]) // Keep last 20 activities
    
    // Refresh user assets if it's the current user
    if (log.args.owner.toLowerCase() === address?.toLowerCase()) {
      refetchAssets()
    }
  })

  useWatchLoanRequested((log) => {
    const newActivity = {
      id: `loan_req_${log.args.loanId}_${Date.now()}`,
      type: 'loan_requested' as const,
      timestamp: Date.now(),
      data: {
        loanId: log.args.loanId,
        borrower: log.args.borrower,
        collateralId: log.args.collateralId,
        amount: log.args.amount,
      }
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)])
  })

  useWatchLoanFunded((log) => {
    const newActivity = {
      id: `loan_funded_${log.args.loanId}_${Date.now()}`,
      type: 'loan_funded' as const,
      timestamp: Date.now(),
      data: {
        loanId: log.args.loanId,
        lender: log.args.lender,
      }
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)])
  })

  useWatchLoanRepaid((log) => {
    const newActivity = {
      id: `loan_repaid_${log.args.loanId}_${Date.now()}`,
      type: 'loan_repaid' as const,
      timestamp: Date.now(),
      data: {
        loanId: log.args.loanId,
        amount: log.args.amount,
      }
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)])
  })

  useWatchAssetLiquidated((log) => {
    const newActivity = {
      id: `asset_liquidated_${log.args.tokenId}_${Date.now()}`,
      type: 'asset_liquidated' as const,
      timestamp: Date.now(),
      data: {
        loanId: log.args.loanId,
        tokenId: log.args.tokenId,
        newOwner: log.args.newOwner,
      }
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 19)])
  })

  // Refresh all data
  const refreshData = () => {
    refetchAssets()
    // Add other refresh calls as needed
  }

  // Update protocol stats periodically
  useEffect(() => {
    const updateProtocolStats = () => {
      // This would typically fetch from a protocol stats contract call
      // For now, we'll use mock data that updates with activity
      setProtocolStats(prev => ({
        totalValueLocked: prev.totalValueLocked + BigInt(Math.floor(Math.random() * 1000000)),
        totalLoansOriginated: prev.totalLoansOriginated + BigInt(recentActivity.filter(a => a.type === 'loan_requested').length),
        totalActiveLoans: prev.totalActiveLoans + BigInt(recentActivity.filter(a => a.type === 'loan_funded').length),
      }))
    }

    const interval = setInterval(updateProtocolStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [recentActivity])

  // Mock data for demonstration (replace with real contract calls)
  useEffect(() => {
    if (isConnected && address) {
      // Initialize with mock data - replace with real contract calls
      setUserAssets([])
      setUserLoans([])
      setAvailableLoans([])
    } else {
      // Clear data when disconnected
      setUserAssets([])
      setUserLoans([])
      setAvailableLoans([])
    }
  }, [isConnected, address])

  const contextValue: ContractDataContextType = {
    // Assets
    userAssets,
    totalAssets: userAssets.length,
    isLoadingAssets,
    
    // Loans
    userLoans,
    availableLoans,
    totalLoans: userLoans.length,
    isLoadingLoans: false,
    
    // Constants
    liquidationThreshold,
    ltvRatio,
    
    // Protocol stats
    protocolStats,
    
    // Real-time events
    recentActivity,
    
    // Loading states
    isConnected,
    address,
    
    // Functions
    refreshData,
  }

  return (
    <ContractDataContext.Provider value={contextValue}>
      {children}
    </ContractDataContext.Provider>
  )
}

export function useContractData() {
  const context = useContext(ContractDataContext)
  if (context === undefined) {
    throw new Error('useContractData must be used within a ContractDataProvider')
  }
  return context
}

// Hook for real-time activity feed
export function useRecentActivity() {
  const { recentActivity } = useContractData()
  return recentActivity
}

// Hook for protocol statistics
export function useProtocolStats() {
  const { protocolStats } = useContractData()
  return protocolStats
}

// Hook for user's assets and loans
export function useUserData() {
  const { userAssets, userLoans, isLoadingAssets, isLoadingLoans, refreshData } = useContractData()
  return {
    assets: userAssets,
    loans: userLoans,
    isLoadingAssets,
    isLoadingLoans,
    refreshData
  }
}