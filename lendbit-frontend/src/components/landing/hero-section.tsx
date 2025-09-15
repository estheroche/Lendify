'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  BarChart3,
  Clock,
  DollarSign,
  Star,
  PlayCircle,
  ArrowRight,
  Globe,
  Award,
  Target,
  PieChart,
  FileText,
  Banknote,
  TrendingDown,
  Lock,
  Smartphone,
  Database,
  Network,
  ChevronRight
} from 'lucide-react'

interface HeroSectionProps {
  onWatchDemo: () => void
}

export function HeroSection({ onWatchDemo }: HeroSectionProps) {
  const stats = [
    { label: 'Total Value Locked', value: '$12.5M', change: '+180%', icon: TrendingUp },
    { label: 'Assets Tokenized', value: '1,247', change: '+34', icon: Building2 },
    { label: 'Success Rate', value: '99.7%', change: '+0.5%', icon: CheckCircle },
    { label: 'Active Lenders', value: '2,847', change: '+289', icon: Users }
  ]

  const features = [
    {
      icon: Clock,
      title: 'Sub-Second Processing',
      description: 'Lightning-fast loan approvals and asset tokenization powered by Somnia\'s 1M+ TPS blockchain infrastructure.'
    },
    {
      icon: Shield,
      title: 'Institutional Security', 
      description: 'Bank-grade security with community verification, multi-signature wallets, and comprehensive audit trails.'
    },
    {
      icon: Building2,
      title: 'Real Asset Backing',
      description: 'Every loan is backed by verified real-world assets including real estate, corporate bonds, and commodities.'
    }
  ]

  const assetTypes = [
    {
      icon: Building2,
      title: 'Real Estate',
      description: 'Commercial and residential properties worldwide',
      examples: ['Commercial Buildings', 'Residential Properties', 'Industrial Facilities', 'Land Assets'],
      value: '$2.5M+'
    },
    {
      icon: FileText,
      title: 'Corporate Bonds',
      description: 'Investment-grade corporate debt securities',
      examples: ['Government Bonds', 'Corporate Debt', 'Municipal Bonds', 'Treasury Securities'],
      value: '$5.8M+'
    },
    {
      icon: Banknote,
      title: 'Trade Finance',
      description: 'Invoices, receivables, and trade documents',
      examples: ['Trade Invoices', 'Supply Chain Finance', 'Letters of Credit', 'Export Finance'],
      value: '$3.2M+'
    },
    {
      icon: BarChart3,
      title: 'Commodities',
      description: 'Physical and financial commodity assets',
      examples: ['Precious Metals', 'Energy Assets', 'Agricultural Products', 'Industrial Metals'],
      value: '$1.0M+'
    }
  ]

  const benefits = [
    {
      title: 'Instant Liquidity Access',
      description: 'Unlock capital from your assets in seconds, not weeks. Traditional asset-backed lending can take 30-90 days.',
      stat: '0.4s',
      statLabel: 'Average Processing Time'
    },
    {
      title: 'Lower Interest Rates',
      description: 'Competitive rates starting from 3.5% APR. Asset-backed loans typically offer 40-60% lower rates than unsecured credit.',
      stat: '3.5%',
      statLabel: 'Starting APR'
    },
    {
      title: 'Global Asset Access',
      description: 'Tokenize and leverage assets across 50+ countries. Our network supports international real estate and financial instruments.',
      stat: '50+',
      statLabel: 'Supported Countries'
    },
    {
      title: 'Institutional Grade Security',
      description: 'Multi-layer security with community verification, smart contract audits, and institutional custody solutions.',
      stat: '99.99%',
      statLabel: 'Uptime Guarantee'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Real Estate Portfolio Manager',
      company: 'Chen Capital',
      content: 'Lendify enabled us to unlock $2.4M in liquidity from our Manhattan properties in under 30 seconds. The speed and reliability are unmatched.',
      rating: 5,
      initials: 'SC',
      result: '$2.4M unlocked in 30 seconds'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Chief Financial Officer',
      company: 'TechFlow Ventures',
      content: 'We tokenized our corporate bonds and accessed instant liquidity for expansion. The platform\'s professional interface made the process seamless.',
      rating: 5,
      initials: 'MR',
      result: 'Instant bond tokenization'
    },
    {
      name: 'Jennifer Walsh',
      role: 'Treasury Manager',
      company: 'Global Trade Solutions',
      content: 'Processing 1,000+ trade invoices with instant settlement transformed our cash flow management. This is the future of trade finance.',
      rating: 5,
      initials: 'JW',
      result: '1,000+ invoices processed'
    }
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Asset Verification',
      description: 'Upload documentation and asset details for community-driven verification through our decentralized network.',
      icon: Shield
    },
    {
      step: '02',
      title: 'Instant Tokenization',
      description: 'Your verified assets are tokenized on Somnia blockchain with sub-second finality and full transparency.',
      icon: Zap
    },
    {
      step: '03',
      title: 'Liquidity Access',
      description: 'Borrow against your tokenized assets instantly with competitive rates and flexible terms.',
      icon: DollarSign
    }
  ]

  const networkStats = [
    { label: 'Transaction Speed', value: '1M+ TPS', description: 'Somnia blockchain performance' },
    { label: 'Block Finality', value: '0.4s', description: 'Sub-second confirmation' },
    { label: 'Gas Efficiency', value: '99.8%', description: 'Ultra-low transaction costs' },
    { label: 'Network Uptime', value: '99.99%', description: 'Enterprise-grade reliability' }
  ]

  return (
    <div className="bg-white pt-8">
      {/* Hero Section */}
      <div className="professional-container professional-section">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Trust Indicators */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">SEC Compliant</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">Fully Audited</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Professional
                <span className="text-blue-600"> Real-World Asset</span> Lending
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Access instant liquidity from your real estate, corporate bonds, and trade assets. 
                Built on Somnia&apos;s ultra-high-performance blockchain with institutional-grade security.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                className="professional-button-primary text-lg px-8 py-4"
                onClick={onWatchDemo}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
              <Button 
                variant="outline" 
                className="professional-button-secondary text-lg px-8 py-4"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {stats.slice(0, 3).map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="professional-card p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Platform Stats</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                          <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Asset Types Section */}
      <div className="bg-gray-50 professional-section">
        <div className="professional-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Supported Asset Classes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tokenize and leverage a wide range of real-world assets with institutional-grade verification
            </p>
          </div>

          <div className="professional-grid professional-grid-2 lg:grid-cols-4">
            {assetTypes.map((asset, index) => (
              <motion.div
                key={asset.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="professional-card p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <asset.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{asset.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{asset.description}</p>
                    <div className="text-2xl font-bold text-blue-600">{asset.value}</div>
                    <div className="text-xs text-gray-500">Total Value</div>
                  </div>
                  
                  <div className="space-y-2">
                    {asset.examples.map((example) => (
                      <div key={example} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white professional-section">
        <div className="professional-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Lendify Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure, and lightning-fast asset tokenization process
            </p>
          </div>

          <div className="professional-grid professional-grid-3">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{step.step}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 transform -translate-y-1/2" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-blue-600 professional-section">
        <div className="professional-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose Lendify?
            </h2>
            <p className="text-xl text-blue-100">
              Revolutionary advantages over traditional asset-backed lending
            </p>
          </div>

          <div className="professional-grid professional-grid-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="professional-card bg-white p-8 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                      <p className="text-gray-700 leading-relaxed font-medium">{benefit.description}</p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-blue-600">{benefit.stat}</div>
                      <div className="text-sm text-gray-600 font-semibold">{benefit.statLabel}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Performance Section */}
      <div className="bg-gray-50 professional-section">
        <div className="professional-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powered by Somnia Network
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on the world&apos;s fastest blockchain with unparalleled performance and security
            </p>
          </div>

          <div className="professional-grid professional-grid-4">
            {networkStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="professional-card text-center p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white professional-section">
        <div className="professional-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals leveraging real-world assets
            </p>
          </div>

          <div className="professional-grid professional-grid-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="professional-card p-8 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-blue-600">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 italic leading-relaxed mb-4">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-sm font-medium text-green-600">
                      ✓ {testimonial.result}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-blue-600 professional-section">
        <div className="professional-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Asset Portfolio?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Join the future of institutional-grade DeFi. Access instant liquidity 
              while maintaining full control of your real-world assets. Start with a free consultation.
            </p>
            
            <div className="flex justify-center space-x-4 mb-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-blue-700 px-8 py-4 text-lg"
              >
                Schedule Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-blue-100">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Global Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}