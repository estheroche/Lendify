import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number, decimals = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function calculateHealthFactor(collateralValue: number, debtValue: number): number {
  if (debtValue === 0) return Infinity
  return (collateralValue / debtValue) * 100
}

export function getHealthFactorColor(healthFactor: number): string {
  if (healthFactor >= 150) return "text-green-500"
  if (healthFactor >= 120) return "text-yellow-500"
  return "text-red-500"
}

export function getHealthFactorBgColor(healthFactor: number): string {
  if (healthFactor >= 150) return "bg-green-500/20"
  if (healthFactor >= 120) return "bg-yellow-500/20"
  return "bg-red-500/20"
}

export const ASSET_TYPES = {
  0: { name: 'Real Estate', emoji: '🏠', color: 'bg-blue-500' },
  1: { name: 'Corporate Bond', emoji: '💼', color: 'bg-green-500' },
  2: { name: 'Invoice', emoji: '📄', color: 'bg-purple-500' },
  3: { name: 'Commodity', emoji: '🥇', color: 'bg-yellow-500' }
} as const

export const LOAN_STATUS = {
  0: 'Requested',
  1: 'Funded', 
  2: 'Active',
  3: 'Repaid',
  4: 'Liquidated',
  5: 'Defaulted'
} as const