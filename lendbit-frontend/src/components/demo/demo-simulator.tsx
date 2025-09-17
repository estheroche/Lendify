'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, RotateCcw, CheckCircle, AlertTriangle, TrendingUp, Building, CreditCard, FileText, Coins } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface DemoStep {
  id: string
  title: string
  description: string
  action: string
  result?: string
  status: 'pending' | 'running' | 'completed' | 'error'
  duration: number
}

interface DemoScenario {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  complexity: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  steps: DemoStep[]
}

interface DemoSimulatorProps {
  onRunDemo?: (scenarioId: string) => void
}

export function DemoSimulator({ onRunDemo }: DemoSimulatorProps) {
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [scenarioSteps, setScenarioSteps] = useState<DemoStep[]>([])

  const scenarios: DemoScenario[] = [
    {
      id: 'real-estate',
      title: 'Real Estate Tokenization & Loan',
      description: 'Complete workflow: Tokenize a $2M commercial property, get it verified, and secure a $1.6M loan',
      icon: Building,
      category: 'Real Estate',
      complexity: 'Beginner',
      duration: '5 minutes',
      steps: [
        {
          id: '1',
          title: 'Tokenize Property',
          description: 'Submit commercial property worth $2,000,000',
          action: 'tokenizeAsset(RealEstate, $2M, "Commercial Property", "NYC")',
          status: 'pending',
          duration: 2000
        },
        {
          id: '2', 
          title: 'Asset Verification',
          description: 'Property undergoes professional valuation and legal verification',
          action: 'verifyAsset(tokenId: 1, approved: true)',
          status: 'pending',
          duration: 3000
        },
        {
          id: '3',
          title: 'Create Loan Request', 
          description: 'Request $1.6M loan (80% LTV) at 4.5% APR for 2 years',
          action: 'createLoanRequest(collateral: 1, amount: $1.6M, rate: 4.5%, duration: 730d)',
          status: 'pending',
          duration: 2500
        },
        {
          id: '4',
          title: 'Loan Funding',
          description: 'Institutional lender funds the loan automatically',
          action: 'fundLoan(requestId: 1, amount: $1.6M)',
          result: 'Loan funded! Borrower receives $1.6M, lender earns 4.5% APY',
          status: 'pending',
          duration: 2000
        }
      ]
    },
    {
      id: 'bond-collateral',
      title: 'Corporate Bond Leverage',
      description: 'Use Microsoft corporate bonds to access instant liquidity for business expansion',
      icon: CreditCard,
      category: 'Corporate Finance',
      complexity: 'Intermediate', 
      duration: '4 minutes',
      steps: [
        {
          id: '1',
          title: 'Submit Bond Portfolio',
          description: 'Tokenize $500K Microsoft AAA-rated corporate bonds',
          action: 'tokenizeAsset(Bond, $500K, "Microsoft Corp Bonds", "US")',
          status: 'pending',
          duration: 1500
        },
        {
          id: '2',
          title: 'Instant Verification', 
          description: 'AAA-rated bonds are automatically verified via oracle',
          action: 'verifyAsset(tokenId: 2, approved: true, reason: "AAA Rating Confirmed")',
          status: 'pending',
          duration: 1000
        },
        {
          id: '3',
          title: 'Quick Loan Request',
          description: 'Request $400K (80% LTV) at premium rate for working capital',
          action: 'createLoanRequest(collateral: 2, amount: $400K, rate: 3.8%, duration: 365d)',
          status: 'pending',
          duration: 1500
        },
        {
          id: '4',
          title: 'Instant Funding',
          description: 'DeFi lenders compete for high-grade collateral',
          action: 'fundLoan(requestId: 2, amount: $400K)',
          result: 'Funded in 30 seconds! Best rate: 3.8% APY',
          status: 'pending',
          duration: 1000
        }
      ]
    },
    {
      id: 'invoice-finance',
      title: 'Trade Invoice Financing', 
      description: 'Convert pending invoices into immediate cash flow for inventory purchase',
      icon: FileText,
      category: 'Trade Finance',
      complexity: 'Intermediate',
      duration: '3 minutes',
      steps: [
        {
          id: '1',
          title: 'Upload Invoice Portfolio',
          description: 'Submit $150K in verified trade receivables',
          action: 'tokenizeAsset(Invoice, $150K, "Fortune 500 Invoices", "Global")',
          status: 'pending',
          duration: 2000
        },
        {
          id: '2',
          title: 'Credit Assessment',
          description: 'AI analyzes debtor creditworthiness and payment history',
          action: 'creditCheck(debtors: ["Apple", "Microsoft", "Google"])',
          status: 'pending',
          duration: 2500
        },
        {
          id: '3',
          title: 'Bridge Financing',
          description: 'Request $120K bridge loan at 8.2% for 90 days',
          action: 'createLoanRequest(collateral: 3, amount: $120K, rate: 8.2%, duration: 90d)',
          status: 'pending',
          duration: 1500
        },
        {
          id: '4',
          title: 'Cash Flow Unlocked',
          description: 'Receive immediate liquidity for inventory purchase',
          action: 'fundLoan(requestId: 3, amount: $120K)',
          result: 'Inventory purchased! Invoice collection automated',
          status: 'pending',
          duration: 1000
        }
      ]
    },
    {
      id: 'liquidation-event',
      title: 'Market Crash & Liquidation',
      description: 'Witness how the protocol protects lenders during market downturns',
      icon: AlertTriangle,
      category: 'Risk Management',
      complexity: 'Advanced',
      duration: '6 minutes',
      steps: [
        {
          id: '1',
          title: 'Peak Market Loan',
          description: 'Borrower takes maximum LTV loan during market peak',
          action: 'createLoanRequest(collateral: PropertyToken, amount: $800K, LTV: 80%)',
          status: 'pending',
          duration: 2000
        },
        {
          id: '2',
          title: 'Market Crash Simulation',
          description: 'Property values drop 30% due to market conditions',
          action: 'updateAssetPrice(tokenId: 4, newPrice: $700K) // 30% drop',
          status: 'pending',
          duration: 3000
        },
        {
          id: '3',
          title: 'Health Factor Alert',
          description: 'Health factor drops below 110% liquidation threshold',
          action: 'calculateHealthFactor(loanId: 4) // Returns: 87.5%',
          status: 'pending',
          duration: 2000
        },
        {
          id: '4',
          title: 'Automated Liquidation',
          description: 'Protocol liquidates position to protect lenders',
          action: 'liquidateLoan(loanId: 4, liquidator: AutoLiquidator)',
          result: 'Lender protected! Collateral transferred, loan settled',
          status: 'pending',
          duration: 2500
        }
      ]
    },
    {
      id: 'portfolio-management',
      title: 'Multi-Asset Portfolio Strategy',
      description: 'Advanced portfolio management with diversified RWA collateral',
      icon: TrendingUp,
      category: 'Portfolio Management', 
      complexity: 'Advanced',
      duration: '8 minutes',
      steps: [
        {
          id: '1',
          title: 'Diversified Tokenization',
          description: 'Create portfolio: $2M property + $1M bonds + $500K gold',
          action: 'tokenizeMultipleAssets([RealEstate: $2M, Bonds: $1M, Gold: $500K])',
          status: 'pending',
          duration: 3000
        },
        {
          id: '2',
          title: 'Portfolio Verification',
          description: 'Professional verification of all asset classes',
          action: 'verifyAssetPortfolio(tokenIds: [1,2,3], verifier: InstitutionalVerifier)',
          status: 'pending',
          duration: 2500
        },
        {
          id: '3',
          title: 'Strategic Borrowing',
          description: 'Optimize borrowing across different asset classes',
          action: 'createPortfolioLoan(totalValue: $3.5M, targetLTV: 75%, strategy: "Diversified")',
          status: 'pending',
          duration: 3000
        },
        {
          id: '4',
          title: 'Yield Optimization',
          description: 'AI suggests optimal allocation for maximum yield',
          action: 'optimizePortfolio(riskTolerance: "Moderate", targetYield: 6.5%)',
          result: 'Portfolio optimized! Projected yield: 7.2% with 68% efficiency',
          status: 'pending',
          duration: 2000
        }
      ]
    }
  ]

  const runScenario = async (scenario: DemoScenario) => {
    setActiveScenario(scenario.id)
    setScenarioSteps([...scenario.steps])
    setIsRunning(true)
    setCurrentStep(0)

    for (let i = 0; i < scenario.steps.length; i++) {
      setCurrentStep(i)
      
      // Update step to running
      setScenarioSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'running' } : step
      ))

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, scenario.steps[i].duration))

      // Update step to completed
      setScenarioSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'completed' } : step
      ))
    }

    setIsRunning(false)
    onRunDemo?.(scenario.id)
  }

  const stopDemo = () => {
    setIsRunning(false)
    setActiveScenario(null)
    setScenarioSteps([])
    setCurrentStep(0)
  }

  const resetDemo = () => {
    setScenarioSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
    setCurrentStep(0)
    setIsRunning(false)
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-400 bg-green-500/20'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20'  
      case 'Advanced': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Demo Scenarios</h2>
        <p className="text-gray-400">Experience real-world RWA lending scenarios with guided simulations</p>
      </div>

      {/* Scenario Selection */}
      {!activeScenario && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => {
            const Icon = scenario.icon
            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
                        scenario.id === 'real-estate' ? 'from-blue-500 to-blue-600' :
                        scenario.id === 'bond-collateral' ? 'from-green-500 to-green-600' :
                        scenario.id === 'invoice-finance' ? 'from-purple-500 to-purple-600' :
                        scenario.id === 'liquidation-event' ? 'from-red-500 to-red-600' :
                        'from-yellow-500 to-yellow-600'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(scenario.complexity)}`}>
                        {scenario.complexity}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">{scenario.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="px-2 py-1 bg-white/5 rounded">{scenario.category}</span>
                      <span>{scenario.duration}</span>
                    </div>

                    <Button
                      onClick={() => runScenario(scenario)}
                      disabled={isRunning}
                      className="w-full group-hover:scale-105 transition-all"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Demo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Active Scenario */}
      {activeScenario && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Scenario Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    {React.createElement(scenarios.find(s => s.id === activeScenario)?.icon || Building, {
                      className: "w-6 h-6 text-white"
                    })}
                  </div>
                  <div>
                    <CardTitle>{scenarios.find(s => s.id === activeScenario)?.title}</CardTitle>
                    <p className="text-gray-400 text-sm mt-1">
                      {scenarios.find(s => s.id === activeScenario)?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isRunning ? (
                    <Button onClick={stopDemo} variant="destructive" size="sm">
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button onClick={resetDemo} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  )}
                  <Button onClick={() => setActiveScenario(null)} variant="outline" size="sm">
                    Back
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Steps Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {scenarioSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all ${
                      step.status === 'completed' ? 'bg-green-500/20 border-green-500/30' :
                      step.status === 'running' ? 'bg-blue-500/20 border-blue-500/30 animate-pulse' :
                      step.status === 'error' ? 'bg-red-500/20 border-red-500/30' :
                      'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'running' ? 'bg-blue-500' :
                        step.status === 'error' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : step.status === 'running' ? (
                          <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                        ) : step.status === 'error' ? (
                          <AlertTriangle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">{step.id}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                        
                        <div className="bg-black/50 rounded p-2 font-mono text-xs text-green-400 mb-2">
                          {step.action}
                        </div>
                        
                        {step.result && step.status === 'completed' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-2 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-300"
                          >
                            ✅ {step.result}
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {step.duration / 1000}s
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{currentStep + (isRunning ? 1 : 0)}/{scenarioSteps.length}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((currentStep + (isRunning ? 1 : 0)) / scenarioSteps.length) * 100}%` 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}