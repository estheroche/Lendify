'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Clock, Activity, TrendingUp, Target, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    currentTPS: 1247893,
    peakTPS: 1456721,
    avgBlockTime: 0.42,
    activeNodes: 847,
    instantTransactions: 12847,
    queuedTransactions: 3,
    networkUtilization: 73.2,
    totalTransactions: 45892341
  })

  const [recentTransactions, setRecentTransactions] = useState([
    { type: 'Asset Tokenized', value: 2.5, timestamp: Date.now() - 100 },
    { type: 'Loan Funded', value: 5.2, timestamp: Date.now() - 300 },
    { type: 'Community Verified', value: 0.001, timestamp: Date.now() - 400 },
    { type: 'Health Updated', value: 0.0005, timestamp: Date.now() - 650 },
    { type: 'Instant Loan', value: 8.7, timestamp: Date.now() - 800 }
  ])

  // Simulate real-time updates leveraging Somnia's speed
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        currentTPS: prev.currentTPS + Math.floor(Math.random() * 2000 - 1000),
        avgBlockTime: 0.35 + Math.random() * 0.2,
        instantTransactions: prev.instantTransactions + Math.floor(Math.random() * 5),
        queuedTransactions: Math.max(0, Math.floor(Math.random() * 10)),
        networkUtilization: Math.min(95, Math.max(60, prev.networkUtilization + (Math.random() - 0.5) * 5)),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 20)
      }))

      // Add new transaction
      if (Math.random() > 0.7) {
        const transactionTypes = [
          'Asset Tokenized', 'Loan Funded', 'Community Verified', 
          'Health Updated', 'Instant Loan', 'Batch Update', 'Price Update'
        ]
        
        setRecentTransactions(prev => [
          {
            type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
            value: Math.random() * 10,
            timestamp: Date.now()
          },
          ...prev.slice(0, 4)
        ])
      }
    }, 400) // Update every 400ms to showcase real-time capability

    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: number) => {
    const seconds = (Date.now() - timestamp) / 1000
    if (seconds < 1) return 'now'
    if (seconds < 60) return `${Math.floor(seconds)}s ago`
    return `${Math.floor(seconds / 60)}m ago`
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Asset Tokenized': return '🏠'
      case 'Loan Funded': return '💰'
      case 'Community Verified': return '✅'
      case 'Health Updated': return '📊'
      case 'Instant Loan': return '⚡'
      case 'Batch Update': return '🔄'
      case 'Price Update': return '💹'
      default: return '📝'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Performance Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-400" />
            Real-time Network Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              key={metrics.currentTPS}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <Badge className="bg-green-500/20 text-green-700 text-xs">LIVE</Badge>
              </div>
              <div className="text-xl font-bold text-white">{metrics.currentTPS.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Current TPS</div>
            </motion.div>

            <motion.div
              key={metrics.avgBlockTime}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-700 text-xs">SUB-SEC</Badge>
              </div>
              <div className="text-xl font-bold text-white">{metrics.avgBlockTime.toFixed(2)}s</div>
              <div className="text-sm text-gray-600">Block Time</div>
            </motion.div>

            <motion.div
              key={metrics.queuedTransactions}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-4 rounded-lg ${
                metrics.queuedTransactions === 0
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <Badge className={
                  metrics.queuedTransactions === 0
                    ? "bg-green-500/20 text-green-700 text-xs"
                    : "bg-yellow-500/20 text-yellow-700 text-xs"
                }>
                  {metrics.queuedTransactions === 0 ? 'INSTANT' : 'QUEUE'}
                </Badge>
              </div>
              <div className="text-xl font-bold text-white">{metrics.queuedTransactions}</div>
              <div className="text-sm text-gray-600">Queue Depth</div>
            </motion.div>

            <motion.div
              key={metrics.networkUtilization}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-700 text-xs">UTIL</Badge>
              </div>
              <div className="text-xl font-bold text-white">{metrics.networkUtilization.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Network Load</div>
            </motion.div>
          </div>

          {/* Additional metrics row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-white">{metrics.peakTPS.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Peak TPS (24h)</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-white">{metrics.activeNodes}</div>
              <div className="text-xs text-gray-600">Active Nodes</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-white">{metrics.totalTransactions.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Total Tx</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Transaction Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
            Live Transaction Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {recentTransactions.map((tx, index) => (
                <motion.div
                  key={`${tx.timestamp}-${index}`}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{tx.type}</div>
                      <div className="text-xs text-gray-600">{formatTime(tx.timestamp)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">
                      {tx.value.toFixed(3)} STT
                    </div>
                    <Badge className="bg-green-500/20 text-green-700 text-xs mt-1">
                      CONFIRMED
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}