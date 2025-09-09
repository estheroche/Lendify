'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { ProtocolStats } from '@/components/dashboard/protocol-stats'
import { AssetTokenization, AssetFormData } from '@/components/dashboard/asset-tokenization'
import { LoanRequest, LoanFormData } from '@/components/dashboard/loan-request'
import { LenderDashboard } from '@/components/dashboard/lender-dashboard'
import { AssetPortfolio } from '@/components/dashboard/asset-portfolio'
import { HealthMonitor } from '@/components/dashboard/health-monitor'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'
import { SomniaPerformance } from '@/components/dashboard/somnia-performance'
import { RealTimeMetrics } from '@/components/dashboard/real-time-metrics'
import { DemoSimulator } from '@/components/demo/demo-simulator'
import { HeroSection } from '@/components/landing/hero-section'
import { ThirdwebStyleModal } from '@/components/wallet/thirdweb-style-modal'
import { formatEther } from 'viem'
import { formatCurrency } from '@/lib/utils'
import { EnhancedProtocolStats } from '@/lib/contract-config'
import { Card, CardContent } from '@/components/ui/card'

// Enhanced mock protocol stats with Somnia-specific metrics
const mockEnhancedStats: EnhancedProtocolStats = {
  totalValueLocked: BigInt('12500000000000000000000000'), // 12.5M STT
  totalLoansOriginated: BigInt('8'),
  protocolFeeCollected: BigInt('250000000000000000000'), // 250 STT
  totalAssets: BigInt('15'),
  totalActiveLoans: BigInt('5'),
  instantLoansProcessed: BigInt('12'), // Somnia's instant loans
  communityVerifications: BigInt('47'), // Community-driven verifications
  averageHealthFactor: BigInt('1450000000000000000') // 1.45 health factor
}

// Somnia performance metrics for real-time display
const somniaMetrics = {
  transactionsPerSecond: 1200000, // 1.2M TPS current throughput
  averageBlockTime: 0.4, // Sub-second finality
  networkLatency: 85, // 85ms average latency
  gasEfficiency: 99.8, // 99.8% gas efficiency
  uptimePercentage: 99.97 // Network uptime
}

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [protocolStats, setProtocolStats] = useState<EnhancedProtocolStats | null>(null)
  const [activeSection, setActiveSection] = useState<'dashboard' | 'analytics' | 'demo' | 'performance'>('dashboard')
  const [realtimeMetrics, setRealtimeMetrics] = useState(somniaMetrics)
  
  // Enhanced Somnia network stats
  const [networkStats, setNetworkStats] = useState({
    currentTPS: 1200000,
    avgBlockTime: 0.4,
    instantLoans: 12,
    communityVerifications: 47
  })

  useEffect(() => {
    // Initialize enhanced protocol stats for Somnia
    setProtocolStats(mockEnhancedStats)

    // Simulate real-time metrics updates (leveraging Somnia's speed)
    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        ...prev,
        transactionsPerSecond: prev.transactionsPerSecond + Math.floor(Math.random() * 1000),
        networkLatency: 80 + Math.floor(Math.random() * 10)
      }))
      
      setNetworkStats(prev => ({
        ...prev,
        currentTPS: prev.currentTPS + Math.floor(Math.random() * 1000),
        instantLoans: prev.instantLoans + (Math.random() > 0.8 ? 1 : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleWatchDemo = () => {
    setActiveSection('demo')
  }

  const handleTokenizeAsset = async (assetData: AssetFormData) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      
      // TODO: Replace with real contract interaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setIsLoading(false)
      alert(`Asset tokenized successfully! Type: ${assetData.type}, Value: ${assetData.value} STT`)
    } catch (error) {
      console.error('Tokenization failed:', error)
      setIsLoading(false)
    }
  }

  const handleLoanRequest = async (loanData: LoanFormData) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      
      // TODO: Replace with real contract interaction
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      setIsLoading(false)
      alert(`Loan request created! Amount: ${loanData.amount} STT at ${loanData.interestRate}% APR`)
    } catch (error) {
      console.error('Loan request failed:', error)
      setIsLoading(false)
    }
  }

  const handleFundLoan = async (requestId: string) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      
      // TODO: Replace with real contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsLoading(false)
      alert(`Loan #${requestId} funded successfully!`)
    } catch (error) {
      console.error('Loan funding failed:', error)
      setIsLoading(false)
    }
  }

  const handleRefreshPortfolio = () => {
    // Mock refresh
    console.log('Portfolio refreshed')
  }

  // Mock user assets for loan requests
  const mockUserAssets = [
    { tokenId: 1, name: '🏠 Manhattan Property', value: 2500000, type: 'Real Estate' },
    { tokenId: 2, name: '💼 Apple Inc. Bond', value: 500000, type: 'Corporate Bond' },
    { tokenId: 4, name: '🥇 Gold Bullion Vault', value: 200000, type: 'Commodity' }
  ]

  const protocolTVL = protocolStats ? 
    formatCurrency(parseFloat(formatEther(protocolStats.totalValueLocked))) : 
    undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      </div>

      <div className="relative">
        <Header
          protocolTVL={protocolTVL}
        />

        <main>
          {/* Hero Section for Non-Connected Users */}
          {!isConnected && (
            <div className="space-y-16">
              <HeroSection onWatchDemo={handleWatchDemo} />
              
              {/* Wallet Connection Section */}
              <div className="container mx-auto px-6 py-16">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
                    <p className="text-gray-300">Connect your wallet to access Somnia&apos;s ultra-fast RWA lending</p>
                  </div>
                  <div className="flex justify-center">
                    <ThirdwebStyleModal size="xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connected User Dashboard */}
          {isConnected && (
            <div className="container mx-auto px-6 py-8">
              {/* Protocol Stats */}
              <ProtocolStats stats={protocolStats} isLoading={false} />

              {/* Section Navigation */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                    { id: 'analytics', label: 'Analytics', icon: '📊' },
                    { id: 'performance', label: 'Somnia Performance', icon: '⚡' },
                    { id: 'demo', label: 'Demo', icon: '🎯' }
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as 'dashboard' | 'analytics' | 'demo' | 'performance')}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeSection === section.id
                          ? 'bg-white/10 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Status */}
              {isLoading && (
                <Card className="bg-blue-500/10 border-blue-500/20 mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
                      <div>
                        <p className="font-medium text-white">Processing Transaction...</p>
                        <p className="text-sm text-gray-400">
                          Please wait while we process your transaction on Arbitrum
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content Based on Active Section */}
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'dashboard' && (
                  <div className="space-y-8">
                    {/* Real-time Metrics - Showcase Somnia's Speed */}
                    <RealTimeMetrics />

                    {/* Asset Portfolio */}
                    <AssetPortfolio
                      assets={[]}
                      isLoading={false}
                      onRefresh={handleRefreshPortfolio}
                    />

                    {/* Health Monitor */}
                    <HealthMonitor
                      loans={[]}
                      isLoading={false}
                      onRefresh={handleRefreshPortfolio}
                    />

                    {/* Main Actions Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      <AssetTokenization
                        onTokenize={handleTokenizeAsset}
                        isLoading={isLoading}
                        isConnected={isConnected}
                      />

                      <LoanRequest
                        onRequestLoan={handleLoanRequest}
                        isLoading={isLoading}
                        isConnected={isConnected}
                        userAssets={mockUserAssets}
                      />

                      <LenderDashboard
                        onFundLoan={handleFundLoan}
                        isLoading={isLoading}
                        isConnected={isConnected}
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'analytics' && (
                  <AnalyticsDashboard />
                )}

                {activeSection === 'performance' && (
                  <SomniaPerformance 
                    metrics={realtimeMetrics} 
                    networkStats={networkStats} 
                  />
                )}

                {activeSection === 'demo' && (
                  <DemoSimulator />
                )}
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
