'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { DollarSign, Calculator, Calendar, AlertTriangle, TrendingUp, Shield, Info } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface LoanRequestProps {
  onRequestLoan: (loanData: LoanFormData) => Promise<void>
  isLoading: boolean
  isConnected: boolean
  userAssets?: Array<{ tokenId: number, name: string, value: number, type: string }>
}

export interface LoanFormData {
  collateralId: string
  amount: string
  interestRate: string
  duration: string
  purpose: string
}

export function LoanRequest({ onRequestLoan, isLoading, isConnected, userAssets = [] }: LoanRequestProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    collateralId: '',
    amount: '',
    interestRate: '5.0',
    duration: '365',
    purpose: ''
  })

  const [calculations, setCalculations] = useState({
    maxLoanAmount: 0,
    monthlyPayment: 0,
    totalInterest: 0,
    totalRepayment: 0,
    ltvRatio: 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  // Real-time calculations
  useEffect(() => {
    if (selectedAsset && formData.amount && formData.interestRate && formData.duration) {
      const principal = parseFloat(formData.amount)
      const rate = parseFloat(formData.interestRate) / 100
      const days = parseInt(formData.duration)
      const assetValue = selectedAsset.value

      // Calculate LTV ratio
      const ltvRatio = (principal / assetValue) * 100

      // Simple interest calculation
      const totalInterest = (principal * rate * days) / 365
      const totalRepayment = principal + totalInterest
      const monthlyPayment = totalRepayment / (days / 30)

      // Max loan amount (80% LTV)
      const maxLoanAmount = assetValue * 0.8

      setCalculations({
        maxLoanAmount,
        monthlyPayment,
        totalInterest,
        totalRepayment,
        ltvRatio
      })
    }
  }, [formData, selectedAsset])

  // Update selected asset when collateral changes
  useEffect(() => {
    if (formData.collateralId && userAssets.length > 0) {
      const asset = userAssets.find(a => a.tokenId.toString() === formData.collateralId)
      setSelectedAsset(asset)
    }
  }, [formData.collateralId, userAssets])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.collateralId) {
      newErrors.collateralId = 'Please select a collateral asset'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Loan amount must be greater than 0'
    } else if (calculations.ltvRatio > 80) {
      newErrors.amount = 'Loan amount exceeds 80% LTV ratio'
    }

    if (!formData.interestRate || parseFloat(formData.interestRate) < 0.1) {
      newErrors.interestRate = 'Interest rate must be at least 0.1%'
    }

    if (!formData.duration || parseInt(formData.duration) < 7) {
      newErrors.duration = 'Duration must be at least 7 days'
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Loan purpose is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onRequestLoan(formData)
      // Reset form on success
      setFormData({
        collateralId: '',
        amount: '',
        interestRate: '5.0',
        duration: '365',
        purpose: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Loan request failed:', error)
    }
  }

  const getLTVColor = (ltv: number) => {
    if (ltv <= 60) return 'text-green-400'
    if (ltv <= 75) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getLTVBgColor = (ltv: number) => {
    if (ltv <= 60) return 'bg-green-500/20'
    if (ltv <= 75) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <span>Request Loan</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collateral Selection */}
          <div className="space-y-2">
            <Label htmlFor="collateral">Collateral Asset</Label>
            <Select
              id="collateral"
              value={formData.collateralId}
              onChange={(e) => setFormData({ ...formData, collateralId: e.target.value })}
              className={errors.collateralId ? 'border-red-500' : ''}
            >
              <option value="">Select an asset...</option>
              {userAssets.map((asset) => (
                <option key={asset.tokenId} value={asset.tokenId.toString()}>
                  {asset.name} - {formatCurrency(asset.value)}
                </option>
              ))}
            </Select>
            {errors.collateralId && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {errors.collateralId}
              </p>
            )}
            {selectedAsset && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{selectedAsset.name}</p>
                    <p className="text-xs text-gray-400">{selectedAsset.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(selectedAsset.value)}</p>
                    <p className="text-xs text-gray-400">Asset Value</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="loan-amount">Loan Amount (ETH)</Label>
              {selectedAsset && (
                <span className="text-xs text-gray-400">
                  Max: {formatCurrency(calculations.maxLoanAmount)} (80% LTV)
                </span>
              )}
            </div>
            <Input
              id="loan-amount"
              type="number"
              step="0.01"
              placeholder="8.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {errors.amount}
              </p>
            )}
            
            {/* LTV Indicator */}
            {selectedAsset && formData.amount && (
              <div className={`p-2 rounded-lg ${getLTVBgColor(calculations.ltvRatio)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">LTV Ratio</span>
                  <span className={`text-sm font-bold ${getLTVColor(calculations.ltvRatio)}`}>
                    {formatPercentage(calculations.ltvRatio)}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      calculations.ltvRatio <= 60 ? 'bg-green-400' :
                      calculations.ltvRatio <= 75 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(calculations.ltvRatio, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interest Rate & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                placeholder="5.0"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className={errors.interestRate ? 'border-red-500' : ''}
              />
              {errors.interestRate && (
                <p className="text-xs text-red-400">{errors.interestRate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">6 months</option>
                <option value="365">1 year</option>
                <option value="730">2 years</option>
              </Select>
            </div>
          </div>

          {/* Loan Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="e.g., Business expansion, Property renovation, Working capital..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className={errors.purpose ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.purpose && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {errors.purpose}
              </p>
            )}
          </div>

          {/* Loan Calculations */}
          {formData.amount && formData.interestRate && formData.duration && selectedAsset && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
            >
              <div className="flex items-center mb-3">
                <Calculator className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium text-white">Loan Calculations</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Monthly Payment</p>
                  <p className="font-bold text-white">{formatCurrency(calculations.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Interest</p>
                  <p className="font-bold text-white">{formatCurrency(calculations.totalInterest)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Repayment</p>
                  <p className="font-bold text-white">{formatCurrency(calculations.totalRepayment)}</p>
                </div>
                <div>
                  <p className="text-gray-400">APY</p>
                  <p className="font-bold text-green-400">{formData.interestRate}%</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="space-y-4">
            {!isConnected && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Please connect your wallet to request a loan
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isConnected || isLoading || userAssets.length === 0}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Creating Loan Request...
                </div>
              ) : (
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Request Loan
                </div>
              )}
            </Button>

            {userAssets.length === 0 && isConnected && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  You need to tokenize assets first before requesting loans
                </p>
              </div>
            )}

            <div className="text-xs text-center text-gray-400 space-y-1">
              <p className="flex items-center justify-center">
                <Shield className="w-3 h-3 mr-1" />
                Secured by smart contracts on Arbitrum
              </p>
              <p>⚡ Low gas fees • 🔒 Your collateral is protected • 📊 Transparent rates</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}