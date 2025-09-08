'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PerformanceMetrics, NetworkComparison } from '@/lib/contract-config'
import { Zap, Clock, Activity, Gauge, Shield, TrendingUp, Award, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface SomniaPerformanceProps {
  metrics: PerformanceMetrics
  networkStats: {
    currentTPS: number
    avgBlockTime: number
    instantLoans: number
    communityVerifications: number
  }
}

export function SomniaPerformance({ metrics, networkStats }: SomniaPerformanceProps) {
  const networkComparisons: NetworkComparison[] = [
    {
      name: 'Somnia',
      chainId: 50312,
      tps: 1200000,
      blockTime: 0.4,
      finality: 'Sub-second',
      gasEfficiency: '99.8%',
      features: ['Real-time RWA', 'Instant Loans', 'Community Verification', 'Zero-downtime']
    },
    {
      name: 'Arbitrum',
      chainId: 42161,
      tps: 4000,
      blockTime: 13.2,
      finality: '~15 minutes',
      gasEfficiency: '95.2%',
      features: ['Optimistic Rollup', 'EVM Compatible', 'Lower Gas Fees']
    },
    {
      name: 'Ethereum',
      chainId: 1,
      tps: 15,
      blockTime: 12.0,
      finality: '~6 minutes',
      gasEfficiency: '78.5%',
      features: ['Decentralized', 'Battle-tested', 'Large Ecosystem']
    },
    {
      name: 'Polygon',
      chainId: 137,
      tps: 7000,
      blockTime: 2.1,
      finality: '~5 minutes',
      gasEfficiency: '88.7%',
      features: ['Sidechain', 'Fast & Cheap', 'Growing DeFi']
    }
  ]

  const liveMetrics = [
    {
      label: 'Current TPS',
      value: networkStats.currentTPS.toLocaleString(),
      change: '+2.3%',
      icon: Zap,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      label: 'Block Time',
      value: `${networkStats.avgBlockTime}s`,
      change: 'Consistent',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Instant Loans',
      value: networkStats.instantLoans.toString(),
      change: '+3 today',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Community Verifications',
      value: networkStats.communityVerifications.toString(),
      change: '+5 today',
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Performance Hero */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <Zap className="w-7 h-7 mr-3 text-yellow-400" />
              Somnia Ultra-High Performance
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              LIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {liveMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg ${metric.bgColor} border border-white/10`}
              >
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  <span className="text-xs text-green-400 font-medium">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-400" />
            Network Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {networkComparisons.map((network, index) => (
              <motion.div
                key={network.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-lg border transition-all ${
                  network.name === 'Somnia'
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'
                    : 'bg-white/5 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-white">{network.name}</h3>
                    {network.name === 'Somnia' && (
                      <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30">
                        ULTRA-FAST
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">Chain ID: {network.chainId}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">TPS</div>
                    <div className={`text-lg font-bold ${
                      network.name === 'Somnia' ? 'text-green-400' : 'text-white'
                    }`}>
                      {network.tps.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Block Time</div>
                    <div className={`text-lg font-bold ${
                      network.name === 'Somnia' ? 'text-green-400' : 'text-white'
                    }`}>
                      {network.blockTime}s
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Finality</div>
                    <div className={`text-sm font-medium ${
                      network.name === 'Somnia' ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {network.finality}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Gas Efficiency</div>
                    <div className={`text-lg font-bold ${
                      network.name === 'Somnia' ? 'text-green-400' : 'text-white'
                    }`}>
                      {network.gasEfficiency}
                    </div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Performance Score</span>
                    <span className="text-gray-300">
                      {network.name === 'Somnia' ? '98/100' : 
                       network.name === 'Arbitrum' ? '78/100' :
                       network.name === 'Polygon' ? '72/100' : '65/100'}
                    </span>
                  </div>
                  <Progress 
                    value={network.name === 'Somnia' ? 98 : 
                           network.name === 'Arbitrum' ? 78 :
                           network.name === 'Polygon' ? 72 : 65} 
                    className="h-2"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {network.features.map((feature, featureIndex) => (
                    <Badge
                      key={featureIndex}
                      variant="outline"
                      className={`text-xs ${
                        network.name === 'Somnia'
                          ? 'border-blue-500/30 text-blue-300'
                          : 'border-gray-600 text-gray-400'
                      }`}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-400" />
            Real-time RWA Benefits on Somnia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Zap className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Instant Asset Tokenization</h3>
              <p className="text-sm text-gray-400">
                Tokenize real estate, bonds, and commodities in under 0.4 seconds with sub-second finality.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <Clock className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Real-time Health Monitoring</h3>
              <p className="text-sm text-gray-400">
                Monitor loan health factors and liquidation risks with millisecond precision updates.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Community-driven Verification</h3>
              <p className="text-sm text-gray-400">
                Leverage community verification with instant consensus and reputation scoring.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}