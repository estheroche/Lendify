'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Activity, Bell, Eye, RefreshCw } from 'lucide-react'
import { formatCurrency, formatPercentage, getHealthFactorColor, getHealthFactorBgColor } from '@/lib/utils'

interface LoanHealth {
  loanId: number
  borrower: string
  collateralAsset: string
  collateralValue: number
  loanAmount: number
  healthFactor: number
  liquidationThreshold: number
  timeToLiquidation?: string
  riskLevel: 'safe' | 'warning' | 'danger'
  lastUpdate: number
}

interface HealthMonitorProps {
  loans: LoanHealth[]
  isLoading: boolean
  onRefresh: () => void
  onLiquidate?: (loanId: number) => void
}

export function HealthMonitor({ loans, isLoading, onRefresh, onLiquidate }: HealthMonitorProps) {
  // Mock loan health data for demo
  const mockLoans: LoanHealth[] = [
    {
      loanId: 1,
      borrower: '0x742d35Cc...8c123',
      collateralAsset: '🏠 Manhattan Property',
      collateralValue: 2500000,
      loanAmount: 2000000,
      healthFactor: 125,
      liquidationThreshold: 110,
      timeToLiquidation: undefined,
      riskLevel: 'safe',
      lastUpdate: Date.now() - 300000 // 5 minutes ago
    },
    {
      loanId: 2,
      borrower: '0x8ba1f109...d4e12',
      collateralAsset: '💼 Microsoft Bond',
      collateralValue: 450000, // Value dropped
      loanAmount: 400000,
      healthFactor: 112.5,
      liquidationThreshold: 110,
      timeToLiquidation: '2 days',
      riskLevel: 'warning',
      lastUpdate: Date.now() - 600000 // 10 minutes ago
    },
    {
      loanId: 3,
      borrower: '0x1a2b3c4d...f5e67',
      collateralAsset: '📄 Invoice Portfolio',
      collateralValue: 135000, // Value dropped significantly
      loanAmount: 120000,
      healthFactor: 108,
      liquidationThreshold: 110,
      timeToLiquidation: 'Eligible now',
      riskLevel: 'danger',
      lastUpdate: Date.now() - 180000 // 3 minutes ago
    }
  ]

  const displayLoans = loans.length > 0 ? loans : mockLoans

  const safeLoans = displayLoans.filter(loan => loan.riskLevel === 'safe')
  const warningLoans = displayLoans.filter(loan => loan.riskLevel === 'warning')
  const dangerLoans = displayLoans.filter(loan => loan.riskLevel === 'danger')

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'danger': return 'text-red-400'
      default: return 'text-gray-600'
    }
  }

  const getRiskBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'bg-green-500/20 border-green-500/30'
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30'
      case 'danger': return 'bg-red-500/20 border-red-500/30'
      default: return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return Shield
      case 'warning': return TrendingDown
      case 'danger': return AlertTriangle
      default: return Activity
    }
  }

  const getTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Factor Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-lg p-4 h-24" />
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
            <Activity className="w-5 h-5" />
            <span>Health Factor Monitor</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-2xl font-bold text-white">{displayLoans.length}</p>
            <p className="text-xs text-gray-600">Total Loans</p>
          </div>
          <div className="text-center p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-2xl font-bold text-green-400">{safeLoans.length}</p>
            <p className="text-xs text-gray-600">Safe</p>
          </div>
          <div className="text-center p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-2xl font-bold text-yellow-400">{warningLoans.length}</p>
            <p className="text-xs text-gray-600">At Risk</p>
          </div>
          <div className="text-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-2xl font-bold text-red-400">{dangerLoans.length}</p>
            <p className="text-xs text-gray-600">Liquidatable</p>
          </div>
        </div>

        {/* Alert Banner for Dangerous Loans */}
        {dangerLoans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              <div className="flex-1">
                <p className="font-semibold text-red-300">
                  {dangerLoans.length} loan{dangerLoans.length > 1 ? 's' : ''} eligible for liquidation
                </p>
                <p className="text-sm text-red-600">
                  Immediate action required to prevent losses
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Bell className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
          </motion.div>
        )}

        {/* Loan List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Loan Health Details
          </h3>

          {displayLoans.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-gray-600">No active loans to monitor</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {displayLoans
                .sort((a, b) => a.healthFactor - b.healthFactor) // Sort by risk level
                .map((loan, index) => {
                  const RiskIcon = getRiskIcon(loan.riskLevel)
                  
                  return (
                    <motion.div
                      key={loan.loanId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getRiskBg(loan.riskLevel)} hover:border-white/20 transition-all`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">Loan #{loan.loanId}</span>
                            <div className={`px-2 py-1 rounded-full border ${getRiskBg(loan.riskLevel)}`}>
                              <div className="flex items-center space-x-1">
                                <RiskIcon className={`w-3 h-3 ${getRiskColor(loan.riskLevel)}`} />
                                <span className={`text-xs font-medium capitalize ${getRiskColor(loan.riskLevel)}`}>
                                  {loan.riskLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{loan.borrower}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Last Update</p>
                          <p className="text-xs text-white">{getTimeAgo(loan.lastUpdate)}</p>
                        </div>
                      </div>

                      {/* Health Factor Display */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Health Factor</span>
                          <span className={`text-xl font-bold ${getHealthFactorColor(loan.healthFactor)}`}>
                            {formatPercentage(loan.healthFactor)}
                          </span>
                        </div>
                        
                        {/* Health Factor Bar */}
                        <div className="relative">
                          <div className="w-full bg-white/10 rounded-full h-3">
                            <motion.div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                loan.healthFactor >= 150 ? 'bg-green-400' :
                                loan.healthFactor >= 120 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((loan.healthFactor / 200) * 100, 100)}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                          </div>
                          {/* Liquidation Threshold Line */}
                          <div 
                            className="absolute top-0 w-0.5 h-3 bg-red-600"
                            style={{ left: `${(loan.liquidationThreshold / 200) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>0%</span>
                          <span className="text-red-400">Liquidation: {formatPercentage(loan.liquidationThreshold)}</span>
                          <span>200%</span>
                        </div>
                      </div>

                      {/* Loan Details */}
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-600">Collateral Asset</p>
                          <p className="text-white font-medium">{loan.collateralAsset}</p>
                          <p className="text-green-400 text-xs">{formatCurrency(loan.collateralValue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Loan Amount</p>
                          <p className="text-white font-medium">{formatCurrency(loan.loanAmount)}</p>
                          <p className="text-gray-600 text-xs">
                            LTV: {formatPercentage((loan.loanAmount / loan.collateralValue) * 100)}
                          </p>
                        </div>
                      </div>

                      {/* Time to Liquidation */}
                      {loan.timeToLiquidation && (
                        <div className="mb-3 p-2 bg-white/5 rounded border border-white/10">
                          <p className="text-xs text-gray-600">Time to Liquidation</p>
                          <p className={`text-sm font-medium ${
                            loan.riskLevel === 'danger' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {loan.timeToLiquidation}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        {loan.riskLevel === 'danger' && onLiquidate && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onLiquidate(loan.loanId)}
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Liquidate
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Health Factor Guide:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• <span className="text-green-400">150%+</span>: Safe - Low liquidation risk</li>
                <li>• <span className="text-yellow-400">120-149%</span>: Caution - Monitor closely</li>
                <li>• <span className="text-red-400">Below 110%</span>: Danger - Eligible for liquidation</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}