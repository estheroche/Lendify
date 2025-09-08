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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-white/10 rounded" />
                  <div className="w-16 h-8 bg-white/10 rounded" />
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-400">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Connect wallet to view protocol stats</p>
            </div>
          </CardContent>
        </Card>
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
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      change: '+12.5%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Total Assets',
      value: stats.totalAssets.toString(),
      icon: Building,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      change: '+3',
      changeColor: 'text-blue-400'
    },
    {
      title: 'Active Loans',
      value: stats.totalActiveLoans.toString(),
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      change: '+5',
      changeColor: 'text-yellow-400'
    },
    {
      title: 'Protocol Fees',
      value: formatValue(stats.protocolFeeCollected),
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      change: '+8.3%',
      changeColor: 'text-purple-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className={`${stat.bgColor} ${stat.borderColor} border hover:scale-105 transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <span className={`text-sm ${stat.changeColor} flex items-center`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    stat.color.includes('green') ? 'from-green-400 to-green-600' :
                    stat.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                    stat.color.includes('yellow') ? 'from-yellow-400 to-yellow-600' :
                    'from-purple-400 to-purple-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(75 + index * 5, 95)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Additional Protocol Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="col-span-full"
      >
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Protocol Health</h3>
                  <p className="text-sm text-gray-300">Ultra-fast performance on Somnia</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-400">Online</span>
                  </div>
                  <p className="text-xs text-gray-400">Network Status</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-white">~0.0001 STT</p>
                  <p className="text-xs text-gray-400">Avg Gas Cost</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-white">1.2M+ TPS</p>
                  <p className="text-xs text-gray-400">Current Speed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}