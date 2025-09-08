'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Building, CreditCard, FileText, Coins, Lock, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import { formatCurrency, formatPercentage, ASSET_TYPES } from '@/lib/utils'

interface Asset {
  tokenId: number
  assetType: number
  name: string
  description: string
  location: string
  currentValue: number
  isVerified: boolean
  isLocked: boolean
  createdAt: number
  lastValuation: number
  loanAmount?: number // If used as collateral
  healthFactor?: number // If used as collateral
}

interface AssetPortfolioProps {
  assets: Asset[]
  isLoading: boolean
  onRefresh: () => void
}

const assetTypeIcons = {
  0: Building,
  1: CreditCard,
  2: FileText,
  3: Coins,
}

export function AssetPortfolio({ assets, isLoading, onRefresh }: AssetPortfolioProps) {
  // Mock assets for demo
  const mockAssets: Asset[] = [
    {
      tokenId: 1,
      assetType: 0,
      name: 'Manhattan Commercial Property',
      description: 'Prime downtown commercial real estate with high foot traffic',
      location: 'New York, NY',
      currentValue: 2500000,
      isVerified: true,
      isLocked: true,
      createdAt: Date.now() - 86400000 * 30, // 30 days ago
      lastValuation: Date.now() - 86400000 * 7, // 7 days ago
      loanAmount: 2000000,
      healthFactor: 125
    },
    {
      tokenId: 2,
      assetType: 1,
      name: 'Apple Inc. Corporate Bond',
      description: 'AAA-rated corporate bond with 5-year maturity',
      location: 'United States',
      currentValue: 500000,
      isVerified: true,
      isLocked: false,
      createdAt: Date.now() - 86400000 * 15, // 15 days ago
      lastValuation: Date.now() - 86400000 * 3, // 3 days ago
    },
    {
      tokenId: 3,
      assetType: 2,
      name: 'Trade Invoice Portfolio',
      description: 'Collection of verified trade receivables from Fortune 500 companies',
      location: 'Global',
      currentValue: 150000,
      isVerified: false,
      isLocked: false,
      createdAt: Date.now() - 86400000 * 5, // 5 days ago
      lastValuation: Date.now() - 86400000 * 1, // 1 day ago
    },
    {
      tokenId: 4,
      assetType: 3,
      name: 'Gold Bullion Vault',
      description: '100 oz gold bars stored in certified vault facility',
      location: 'Switzerland',
      currentValue: 200000,
      isVerified: true,
      isLocked: false,
      createdAt: Date.now() - 86400000 * 60, // 60 days ago
      lastValuation: Date.now() - 86400000 * 1, // 1 day ago
    }
  ]

  const displayAssets = assets.length > 0 ? assets : mockAssets
  const totalPortfolioValue = displayAssets.reduce((sum, asset) => sum + asset.currentValue, 0)
  const lockedValue = displayAssets.filter(a => a.isLocked).reduce((sum, asset) => sum + asset.currentValue, 0)
  const availableValue = totalPortfolioValue - lockedValue

  const getHealthFactorColor = (healthFactor?: number) => {
    if (!healthFactor) return 'text-gray-400'
    if (healthFactor >= 150) return 'text-green-400'
    if (healthFactor >= 120) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getHealthFactorBg = (healthFactor?: number) => {
    if (!healthFactor) return 'bg-gray-500/20'
    if (healthFactor >= 150) return 'bg-green-500/20'
    if (healthFactor >= 120) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  const getDaysAgo = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
    return days === 0 ? 'Today' : `${days}d ago`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-lg p-4 h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Asset Portfolio</span>
          </CardTitle>
          <Button onClick={onRefresh} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{formatCurrency(totalPortfolioValue)}</p>
            <p className="text-sm text-gray-400">Total Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{formatCurrency(availableValue)}</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(lockedValue)}</p>
            <p className="text-sm text-gray-400">Locked</p>
          </div>
        </div>

        {/* Assets Grid */}
        {displayAssets.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">No Assets Found</h3>
            <p className="text-gray-400 mb-6">Start by tokenizing your first real-world asset</p>
            <Button>Tokenize Asset</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayAssets.map((asset, index) => {
              const AssetIcon = assetTypeIcons[asset.assetType as keyof typeof assetTypeIcons]
              const assetTypeData = ASSET_TYPES[asset.assetType as keyof typeof ASSET_TYPES]
              
              return (
                <motion.div
                  key={asset.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${assetTypeData.color}`}>
                            <AssetIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{asset.name}</h3>
                            <p className="text-xs text-gray-400">#{asset.tokenId}</p>
                          </div>
                        </div>
                        
                        {/* Status Badges */}
                        <div className="flex flex-col items-end space-y-1">
                          {asset.isVerified ? (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-full">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                              <Clock className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs text-yellow-400">Pending</span>
                            </div>
                          )}
                          
                          {asset.isLocked && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 rounded-full">
                              <Lock className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-red-400">Locked</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Value */}
                      <div className="mb-3">
                        <div className="flex items-baseline space-x-2">
                          <p className="text-xl font-bold text-white">{formatCurrency(asset.currentValue)}</p>
                          <span className="text-xs text-green-400 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +2.5%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">Last updated {getDaysAgo(asset.lastValuation)}</p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{asset.description}</p>
                      
                      {/* Location */}
                      <p className="text-xs text-gray-400 mb-3">{asset.location}</p>

                      {/* Loan Info (if collateral) */}
                      {asset.isLocked && asset.loanAmount && (
                        <div className={`p-3 rounded-lg border mb-3 ${getHealthFactorBg(asset.healthFactor)}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-300">Active Loan</span>
                            {asset.healthFactor && (
                              <span className={`text-xs font-bold ${getHealthFactorColor(asset.healthFactor)}`}>
                                Health: {formatPercentage(asset.healthFactor)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white">{formatCurrency(asset.loanAmount)}</p>
                          <p className="text-xs text-gray-400">
                            LTV: {formatPercentage((asset.loanAmount / asset.currentValue) * 100)}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {!asset.isLocked && (
                          <Button size="sm" className="flex-1">
                            Use as Collateral
                          </Button>
                        )}
                      </div>

                      {/* Warning for unhealthy loans */}
                      {asset.healthFactor && asset.healthFactor < 120 && (
                        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <p className="text-xs text-red-300">
                            Liquidation risk! Add collateral or repay loan.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}