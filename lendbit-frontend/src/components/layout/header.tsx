'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Building, Menu, X, TrendingUp, Shield, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThirdwebStyleModal } from '@/components/wallet/thirdweb-style-modal'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  protocolTVL?: string
}

export function Header({ protocolTVL }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lendify
            </h1>
            <p className="text-xs text-gray-400 -mt-1">Ultra-Fast RWA • Somnia</p>
          </div>
        </motion.div>

        {/* Protocol Stats - Desktop */}
        <motion.div 
          className="hidden lg:flex items-center space-x-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-xs text-gray-400">TVL</p>
              <p className="text-sm font-medium text-white">{protocolTVL || '$0.00'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <Zap className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Network</p>
              <p className="text-sm font-medium text-white">Somnia</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-white">Live</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Connect Button & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden sm:block"
          >
            <ThirdwebStyleModal />
          </motion.div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {/* Mobile Protocol Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">TVL</p>
                    <p className="text-sm font-medium text-white">{protocolTVL || '$0.00'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Network</p>
                    <p className="text-sm font-medium text-white">Somnia</p>
                  </div>
                </div>
              </div>

              {/* Mobile Wallet Connection */}
              <div className="sm:hidden w-full">
                <ThirdwebStyleModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}