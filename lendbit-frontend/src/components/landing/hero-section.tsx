'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, ArrowRight, PlayCircle, Star, TrendingUp, Shield, Zap, Users, Building, DollarSign, BarChart3 } from 'lucide-react'

interface HeroSectionProps {
  onWatchDemo: () => void
}

export function HeroSection({ onWatchDemo }: HeroSectionProps) {
  const stats = [
    { label: 'Total Value Locked', value: '$12.5M', change: '+180%', icon: TrendingUp },
    { label: 'Instant Loans', value: '67', change: '+34', icon: Zap },
    { label: 'Success Rate', value: '99.7%', change: '+0.5%', icon: Shield },
    { label: 'Community Verifiers', value: '247', change: '+89', icon: Users }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Real Estate Developer',
      company: 'Chen Properties',
      content: 'Lendify unlocked $2M from my Manhattan property in 0.4 seconds using Somnia. Instant liquidity is game-changing.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CFO',
      company: 'TechFlow Inc.',
      content: 'Somnia&apos;s 1M+ TPS enables real-time bond tokenization. We got $5M liquidity instantly for our expansion.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Jennifer Walsh',
      role: 'Trade Finance Manager',
      company: 'Global Trade Solutions',
      content: 'Lendify on Somnia processed 1,000+ invoices with sub-second finality. Our cash flow improved 400%.',
      rating: 5,
      avatar: '👩‍💼'
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Main Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center space-x-6 mb-8"
          >
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">Audited by Consensys</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">Powered by Somnia</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">$12.5M TVL</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ultra-Fast RWA
            </span>
            <br />
            <span className="text-white">Lending on Somnia</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            The first ultra-high-performance RWA lending protocol on Somnia. Tokenize real estate, bonds, invoices, and commodities with sub-second finality. 
            Access instant liquidity with <span className="text-blue-400 font-semibold">1M+ TPS capability</span> and community-driven verification.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center mb-16"
          >
            <Button size="xl" variant="outline" onClick={onWatchDemo} className="px-8 py-4 text-lg">
              <PlayCircle className="w-6 h-6 mr-3" />
              Watch Demo
              <span className="ml-2 text-sm text-gray-400">(5 min)</span>
            </Button>
          </motion.div>

          {/* Value Propositions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">1M+ TPS Performance</h3>
                <p className="text-gray-400 leading-relaxed">
                  Experience unprecedented speed with Somnia's ultra-high performance blockchain. 
                  Process 1 million+ transactions per second with sub-second finality.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Real-time Processing</h3>
                <p className="text-gray-400 leading-relaxed">
                  Instant asset tokenization, real-time health monitoring, and immediate loan execution. 
                  Experience the future of DeFi with millisecond response times.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Community Verification</h3>
                <p className="text-gray-400 leading-relaxed">
                  Decentralized asset verification system powered by community validators. 
                  Enhanced security through distributed consensus and reputation scoring.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <Card className="text-center group hover:scale-105 transition-all">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                  <div className="text-xs text-green-400 font-medium">{stat.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Powered by Ultra-High Performance</h2>
          <p className="text-gray-400 mb-12">Join the future of RWA lending with Lendify on Somnia's lightning-fast blockchain</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-3">{testimonial.avatar}</div>
                      <div className="text-left">
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                        <div className="text-xs text-blue-400">{testimonial.company}</div>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 italic text-sm leading-relaxed">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ready for Ultra-Fast RWA Lending?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the future of DeFi. Instant tokenization, sub-second finality, and 1M+ TPS on Somnia.
              </p>
              
              <div className="flex justify-center">
                <Button size="xl" variant="outline" className="px-8 py-4">
                  <Users className="w-5 h-5 mr-2" />
                  Join Waitlist
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-400">
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Fully Audited
                </span>
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Low Gas Fees
                </span>
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  High Yields
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}