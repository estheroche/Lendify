'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Shield, Building, BarChart3, Zap, Activity } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { EnhancedProtocolStats } from '@/lib/contract-config'
import { formatEther } from 'viem'

interface ProtocolStatsProps {
  stats: EnhancedProtocolStats | null
  isLoading: boolean
}

export function ProtocolStats({ stats, isLoading }: ProtocolStatsProps) {
  if (isLoading) {
    return (
      <div className="professional-grid professional-grid-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="professional-card p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-8 bg-gray-200 rounded" />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="professional-grid professional-grid-4">
        <div className="professional-card p-6">
          <div className="text-center text-gray-600">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Connect wallet to view protocol stats</p>
          </div>
        </div>
      </div>
    )
  }

  const formatValue = (value: bigint) => {
    const ethValue = formatEther(value)
    return formatCurrency(parseFloat(ethValue))
  }

  const statsData = [
    {
      title: 'Total Value Locked',
      value: formatValue(stats.totalValueLocked),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: '+12.5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Assets',
      value: stats.totalAssets.toString(),
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '+3',
      changeColor: 'text-blue-600'
    },
    {
      title: 'Active Loans',
      value: stats.totalActiveLoans.toString(),
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      change: '+5',
      changeColor: 'text-amber-600'
    },
    {
      title: 'Protocol Fees',
      value: formatValue(stats.protocolFeeCollected),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: '+8.3%',
      changeColor: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="professional-grid professional-grid-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`professional-card ${stat.bgColor} ${stat.borderColor} border-2`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{stat.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className={`text-sm ${stat.changeColor} flex items-center font-medium`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center border-2 ${stat.borderColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      stat.color.includes('green') ? 'bg-green-500' :
                      stat.color.includes('blue') ? 'bg-blue-500' :
                      stat.color.includes('amber') ? 'bg-amber-500' :
                      'bg-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(75 + index * 5, 95)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Protocol Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="professional-card bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Somnia Network Status</h3>
                <p className="text-sm text-white">Ultra-high performance blockchain</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-white">Live</span>
                </div>
                <p className="text-xs text-white opacity-90">Network Status</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-1">~0.001 STT</p>
                <p className="text-xs text-white opacity-90">Avg Gas Cost</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-1">1.2M+ TPS</p>
                <p className="text-xs text-white opacity-90">Current Speed</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
