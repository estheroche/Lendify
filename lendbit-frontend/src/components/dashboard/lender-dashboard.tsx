'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Users, DollarSign, TrendingUp, Clock, Shield, AlertCircle, CheckCircle, Eye } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { useFundLoan, useGetLoan, useWatchLoanFunded, useGetConstants } from '@/hooks/useLendifyContract'
import { formatEther } from 'viem'

interface LenderDashboardProps {
  isConnected: boolean
}

interface LoanRequest {
  requestId: number
  borrower: string
  collateralAsset: string
  collateralValue: number
  requestedAmount: number
  interestRate: number
  duration: number
  purpose: string
  ltvRatio: number
  healthScore: number
}

export function LenderDashboard({ isConnected }: LenderDashboardProps) {
  const { fundLoan, isPending, isSuccess, error } = useFundLoan()
  const { liquidationThreshold, ltvRatio } = useGetConstants()
  
  const [fundRequestId, setFundRequestId] = useState('')
  const [fundAmount, setFundAmount] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null)
  const [showDetails, setShowDetails] = useState<Record<number, boolean>>({})

  // Watch for successful loan funding
  useWatchLoanFunded((log) => {
    alert(`Loan funded successfully! Loan ID: ${log.args.loanId}`)
    console.log('Loan funded:', log)
  })

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      alert('Loan funding transaction submitted!')
      console.log('Loan funding transaction submitted successfully')
      setFundRequestId('')
      setFundAmount('')
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      alert(`Loan funding failed: ${error.message}`)
      console.error('Loan funding error:', error)
    }
  }, [error])

  // Mock loan requests for demo (in real implementation, fetch from contract)
  const mockRequests: LoanRequest[] = [
    {
      requestId: 1,
      borrower: '0x742d35Cc...8c123',
      collateralAsset: '🏠 NYC Commercial Property',
      collateralValue: 2000000,
      requestedAmount: 1600000,
      interestRate: 4.5,
      duration: 730,
      purpose: 'Property expansion and renovation for increased rental yield',
      ltvRatio: 80,
      healthScore: 85
    },
    {
      requestId: 2,
      borrower: '0x8ba1f109...d4e12',
      collateralAsset: '💼 Microsoft Corporate Bond',
      collateralValue: 500000,
      requestedAmount: 400000,
      interestRate: 3.8,
      duration: 365,
      purpose: 'Working capital for tech startup expansion',
      ltvRatio: 80,
      healthScore: 92
    },
    {
      requestId: 3,
      borrower: '0x1a2b3c4d...f5e67',
      collateralAsset: '📄 Trade Invoice Portfolio',
      collateralValue: 150000,
      requestedAmount: 120000,
      interestRate: 8.2,
      duration: 90,
      purpose: 'Bridge financing for inventory purchase',
      ltvRatio: 80,
      healthScore: 78
    }
  ]

  const requests = mockRequests // In real implementation, fetch from contract

  const handleFundLoan = async (requestId: number) => {
    if (!fundAmount) {
      alert('Please enter funding amount')
      return
    }
    
    try {
      await fundLoan(requestId, fundAmount)
    } catch (error) {
      console.error('Funding failed:', error)
    }
  }

  const handleQuickFund = async () => {
    if (!fundRequestId || !fundAmount) {
      alert('Please enter both loan ID and amount')
      return
    }
    
    try {
      await fundLoan(parseInt(fundRequestId), fundAmount)
    } catch (error) {
      console.error('Funding failed:', error)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getHealthScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30'
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  const calculateAPY = (interestRate: number, duration: number) => {
    return (interestRate * 365) / duration
  }

  const toggleDetails = (requestId: number) => {
    setShowDetails(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }))
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <span>Lend & Earn</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Fund Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Quick Fund
          </h3>
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                placeholder="Loan ID"
                value={fundRequestId}
                onChange={(e) => setFundRequestId(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Amount (STT)"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="flex-1"
                type="number"
                step="0.01"
              />
            </div>
            <Button
              onClick={handleQuickFund}
              disabled={!fundRequestId || !fundAmount || isPending || !isConnected}
              className="w-full"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Funding...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Transaction Submitted!
                </div>
              ) : (
                'Fund Loan'
              )}
            </Button>
          </div>
        </div>

        {/* Available Loan Requests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center justify-between">
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Available Opportunities
            </span>
            <span className="text-sm text-gray-600">{requests.length} active</span>
          </h3>

          {!isConnected ? (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
              <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300">Connect wallet to view lending opportunities</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {requests.map((request) => (
                <motion.div
                  key={request.requestId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">#{request.requestId}</span>
                        <div className={`px-2 py-1 rounded-full border ${getHealthScoreBgColor(request.healthScore)}`}>
                          <span className={`text-xs font-medium ${getHealthScoreColor(request.healthScore)}`}>
                            Health: {request.healthScore}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{request.borrower}</p>
                    </div>
                    
                    <Button
                      onClick={() => toggleDetails(request.requestId)}
                      variant="ghost"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Main Info */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Loan Amount</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(request.requestedAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Interest Rate</p>
                      <p className="text-lg font-bold text-green-400">{formatPercentage(request.interestRate)}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {request.duration} days
                    </span>
                    <span className="flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      {formatPercentage(request.ltvRatio)} LTV
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {formatPercentage(calculateAPY(request.interestRate, request.duration))} APY
                    </span>
                  </div>

                  {/* Collateral */}
                  <div className="p-2 bg-white/5 rounded border border-white/10 mb-3">
                    <p className="text-xs text-gray-600">Collateral</p>
                    <p className="text-sm font-medium text-white">{request.collateralAsset}</p>
                    <p className="text-xs text-green-400">{formatCurrency(request.collateralValue)} value</p>
                  </div>

                  {/* Expanded Details */}
                  {showDetails[request.requestId] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-3 border-t border-white/10"
                    >
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Loan Purpose</p>
                        <p className="text-sm text-white">{request.purpose}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-600">Potential Profit</p>
                          <p className="text-sm font-bold text-green-400">
                            {formatCurrency((request.requestedAmount * request.interestRate * request.duration) / (365 * 100))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Risk Level</p>
                          <p className={`text-sm font-bold ${getHealthScoreColor(request.healthScore)}`}>
                            {request.healthScore >= 80 ? 'Low' : request.healthScore >= 60 ? 'Medium' : 'High'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Input
                          placeholder="Funding amount (STT)"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          type="number"
                          step="0.01"
                        />
                        <Button
                          onClick={() => handleFundLoan(request.requestId)}
                          disabled={isPending || !fundAmount}
                          className="w-full"
                          variant="success"
                        >
                          {isPending ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                              Funding...
                            </div>
                          ) : isSuccess ? (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Transaction Submitted!
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Fund This Loan
                            </div>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Lending Stats */}
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
            Your Lending Performance
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-white">$0</p>
              <p className="text-xs text-gray-600">Total Lent</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-400">0%</p>
              <p className="text-xs text-gray-600">Avg APY</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">0</p>
              <p className="text-xs text-gray-600">Active Loans</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Lending Tips:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Diversify across multiple loans to reduce risk</li>
                <li>• Higher health scores indicate safer investments</li>
                <li>• Short-term loans often have higher APY</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}