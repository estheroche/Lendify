import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESS, LENDIFY_CORE_ABI, AssetType } from '@/lib/contract-config'
import { parseEther } from 'viem'
import { useCallback } from 'react'

// Type definitions for contract events
interface ContractEventLog {
  args: Record<string, unknown>
  [key: string]: unknown
}

// Asset tokenization hook
export function useTokenizeAsset() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const tokenizeAsset = useCallback(async (
    assetType: AssetType,
    initialValue: string,
    metadataURI: string
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: LENDIFY_CORE_ABI,
      functionName: 'tokenizeAsset',
      args: [assetType, parseEther(initialValue), metadataURI],
    })
  }, [writeContract])

  return {
    tokenizeAsset,
    isPending,
    isSuccess,
    error,
  }
}

// Get asset details hook
export function useGetAsset(tokenId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'getAsset',
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  })
}

// Loan creation hook
export function useCreateLoanRequest() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const createLoanRequest = useCallback(async (
    collateralTokenId: number,
    loanAmount: string,
    interestRate: number,
    durationDays: number
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: LENDIFY_CORE_ABI,
      functionName: 'createLoanRequest',
      args: [
        BigInt(collateralTokenId),
        parseEther(loanAmount),
        BigInt(interestRate * 100), // Convert percentage to basis points
        BigInt(durationDays),
      ],
    })
  }, [writeContract])

  return {
    createLoanRequest,
    isPending,
    isSuccess,
    error,
  }
}

// Fund loan hook
export function useFundLoan() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const fundLoan = useCallback(async (loanId: number, amount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: LENDIFY_CORE_ABI,
      functionName: 'fundLoan',
      args: [BigInt(loanId)],
      value: parseEther(amount),
    })
  }, [writeContract])

  return {
    fundLoan,
    isPending,
    isSuccess,
    error,
  }
}

// Repay loan hook
export function useRepayLoan() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const repayLoan = useCallback(async (loanId: number, amount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: LENDIFY_CORE_ABI,
      functionName: 'repayLoan',
      args: [BigInt(loanId)],
      value: parseEther(amount),
    })
  }, [writeContract])

  return {
    repayLoan,
    isPending,
    isSuccess,
    error,
  }
}

// Get loan details hook
export function useGetLoan(loanId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'getLoan',
    args: loanId !== undefined ? [BigInt(loanId)] : undefined,
    query: {
      enabled: loanId !== undefined,
    },
  })
}

// Calculate health factor hook
export function useCalculateHealthFactor(loanId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'calculateHealthFactor',
    args: loanId !== undefined ? [BigInt(loanId)] : undefined,
    query: {
      enabled: loanId !== undefined,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  })
}

// Calculate total owed hook
export function useCalculateTotalOwed(loanId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'calculateTotalOwed',
    args: loanId !== undefined ? [BigInt(loanId)] : undefined,
    query: {
      enabled: loanId !== undefined,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  })
}

// Check if loan is liquidatable
export function useIsLiquidatable(loanId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'isLiquidatable',
    args: loanId !== undefined ? [BigInt(loanId)] : undefined,
    query: {
      enabled: loanId !== undefined,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  })
}

// Liquidate loan hook
export function useLiquidateLoan() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const liquidateLoan = useCallback(async (loanId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: LENDIFY_CORE_ABI,
      functionName: 'liquidateLoan',
      args: [BigInt(loanId)],
    })
  }, [writeContract])

  return {
    liquidateLoan,
    isPending,
    isSuccess,
    error,
  }
}

// Get user's assets
export function useGetUserAssets(userAddress: string | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })
}

// Asset verification hook
export function useVerifyAsset() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const verifyAsset = useCallback(async (tokenId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: LENDIFY_CORE_ABI,
      functionName: 'verifyAsset',
      args: [BigInt(tokenId)],
    })
  }, [writeContract])

  return {
    verifyAsset,
    isPending,
    isSuccess,
    error,
  }
}

// Get constants
export function useGetConstants() {
  const { data: liquidationThreshold } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'LIQUIDATION_THRESHOLD',
  })

  const { data: ltvRatio } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    functionName: 'LTV_RATIO',
  })

  return {
    liquidationThreshold,
    ltvRatio,
  }
}

// Watch for contract events
export function useWatchAssetTokenized(onAssetTokenized?: (log: ContractEventLog) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    eventName: 'AssetTokenized',
    onLogs: onAssetTokenized ? (logs) => logs.forEach((log) => onAssetTokenized(log as unknown as ContractEventLog)) : undefined,
  })
}

export function useWatchLoanRequested(onLoanRequested?: (log: ContractEventLog) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    eventName: 'LoanRequested',
    onLogs: onLoanRequested ? (logs) => logs.forEach((log) => onLoanRequested(log as unknown as ContractEventLog)) : undefined,
  })
}

export function useWatchLoanFunded(onLoanFunded?: (log: ContractEventLog) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    eventName: 'LoanFunded',
    onLogs: onLoanFunded ? (logs) => logs.forEach((log) => onLoanFunded(log as unknown as ContractEventLog)) : undefined,
  })
}

export function useWatchLoanRepaid(onLoanRepaid?: (log: ContractEventLog) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    eventName: 'LoanRepaid',
    onLogs: onLoanRepaid ? (logs) => logs.forEach((log) => onLoanRepaid(log as unknown as ContractEventLog)) : undefined,
  })
}

export function useWatchAssetLiquidated(onAssetLiquidated?: (log: ContractEventLog) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: LENDIFY_CORE_ABI,
    eventName: 'AssetLiquidated',
    onLogs: onAssetLiquidated ? (logs) => logs.forEach((log) => onAssetLiquidated(log as unknown as ContractEventLog)) : undefined,
  })
}

// Utility functions for formatting contract data
export function formatContractAsset(contractAsset: Record<string, unknown>) {
  if (!contractAsset) return null
  
  return {
    tokenId: Number(contractAsset.tokenId),
    assetType: Number(contractAsset.assetType),
    owner: contractAsset.owner as string,
    currentValue: contractAsset.currentValue as bigint,
    metadataURI: contractAsset.metadataURI as string,
    isLocked: contractAsset.isLocked as boolean,
    isVerified: contractAsset.isVerified as boolean,
  }
}

export function formatContractLoan(contractLoan: Record<string, unknown>) {
  if (!contractLoan) return null
  
  return {
    loanId: Number(contractLoan.loanId),
    borrower: contractLoan.borrower as string,
    lender: contractLoan.lender as string,
    collateralTokenId: Number(contractLoan.collateralTokenId),
    principalAmount: contractLoan.principalAmount as bigint,
    interestRate: Number(contractLoan.interestRate),
    duration: Number(contractLoan.duration),
    startTime: Number(contractLoan.startTime),
    status: Number(contractLoan.status),
    totalRepaid: contractLoan.totalRepaid as bigint,
  }
}