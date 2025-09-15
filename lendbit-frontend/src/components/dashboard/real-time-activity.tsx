'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, TrendingUp, Users, DollarSign, Clock, ExternalLink } from 'lucide-react'
import { useRecentActivity, useProtocolStats } from '@/providers/ContractDataProvider'
import { formatEther } from 'viem'
// Using simple date formatting instead of date-fns

const activityIcons = {
  asset_tokenized: '🏠',
  loan_requested: '📝',
  loan_funded: '💰',
  loan_repaid: '✅',
  asset_liquidated: '⚠️',
}

const activityColors = {
  asset_tokenized: 'text-blue-400',
  loan_requested: 'text-yellow-400',
  loan_funded: 'text-green-400',
  loan_repaid: 'text-emerald-400',
  asset_liquidated: 'text-red-400',
}

export function RealTimeActivity() {
  const recentActivity = useRecentActivity()
  const protocolStats = useProtocolStats()

  const formatActivity = (activity: any) => {
    switch (activity.type) {
      case 'asset_tokenized':
        return {
          title: 'Asset Tokenized',
          description: `Token ID #${activity.data.tokenId} by ${activity.data.owner.slice(0, 6)}...${activity.data.owner.slice(-4)}`,
          value: activity.data.value ? formatEther(activity.data.value) + ' STT' : 'N/A'
        }
      case 'loan_requested':
        return {
          title: 'Loan Requested',
          description: `Loan ID #${activity.data.loanId} by ${activity.data.borrower.slice(0, 6)}...${activity.data.borrower.slice(-4)}`,
          value: activity.data.amount ? formatEther(activity.data.amount) + ' STT' : 'N/A'
        }
      case 'loan_funded':
        return {
          title: 'Loan Funded',
          description: `Loan ID #${activity.data.loanId} by ${activity.data.lender.slice(0, 6)}...${activity.data.lender.slice(-4)}`,
          value: 'Funded'
        }
      case 'loan_repaid':
        return {
          title: 'Loan Repaid',
          description: `Loan ID #${activity.data.loanId}`,
          value: activity.data.amount ? formatEther(activity.data.amount) + ' STT' : 'N/A'
        }
      case 'asset_liquidated':
        return {
          title: 'Asset Liquidated',
          description: `Token ID #${activity.data.tokenId} → ${activity.data.newOwner.slice(0, 6)}...${activity.data.newOwner.slice(-4)}`,
          value: 'Liquidated'
        }
      default:
        return {
          title: 'Unknown Activity',
          description: 'Unknown activity type',
          value: 'N/A'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Protocol Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span>Protocol Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-600">Total Value Locked</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatEther(protocolStats.totalValueLocked)} STT
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-600">Total Loans</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {protocolStats.totalLoansOriginated.toString()}
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">Active Loans</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {protocolStats.totalActiveLoans.toString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span>Live Activity Feed</span>
              {recentActivity.length > 0 && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-sm text-gray-600">{recentActivity.length} events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            <AnimatePresence>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Contract events will appear here in real-time</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => {
                  const formatted = formatActivity(activity)
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">
                            {activityIcons[activity.type]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`text-sm font-medium ${activityColors[activity.type]}`}>
                                {formatted.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-600">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(activity.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatted.description}
                            </p>
                            {formatted.value !== 'N/A' && (
                              <p className="text-sm font-medium text-white mt-1">
                                {formatted.value}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="text-gray-600 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <span>Somnia Network Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-400">Live</p>
              <p className="text-xs text-gray-600">Network Status</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">~0.001 STT</p>
              <p className="text-xs text-gray-600">Avg Gas Cost</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">1.2M+</p>
              <p className="text-xs text-gray-600">TPS Current</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">0.3s</p>
              <p className="text-xs text-gray-600">Avg Block Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}