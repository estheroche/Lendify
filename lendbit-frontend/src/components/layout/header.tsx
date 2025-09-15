'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Building2, Menu, X, TrendingUp, Zap, BarChart3, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThirdwebStyleModal } from '@/components/wallet/thirdweb-style-modal'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  protocolTVL?: string
}

export function Header({ protocolTVL }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()

  const navigationItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Markets', href: '#markets' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Analytics', href: '#analytics' }
  ]

  return (
    <header className="professional-nav sticky top-0 z-50 w-full">
      <div className="professional-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Lendify
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Real-World Asset Lending</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation - Desktop */}
          <motion.nav 
            className="hidden lg:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
              >
                {item.name}
              </a>
            ))}
          </motion.nav>

          {/* Protocol Stats - Desktop */}
          <motion.div 
            className="hidden xl:flex items-center space-x-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">TVL</p>
                <p className="text-sm font-semibold text-gray-900">{protocolTVL || '$12.5M'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Network</p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-900">Somnia</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
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
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
            className="lg:hidden border-t border-gray-200 bg-white shadow-lg"
          >
            <div className="professional-container py-6 space-y-6">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Mobile Protocol Stats */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Total Value Locked</p>
                    <p className="text-lg font-semibold text-gray-900">{protocolTVL || '$12.5M'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Network Status</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-lg font-semibold text-gray-900">Somnia Live</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Wallet Connection */}
              <div className="sm:hidden pt-4 border-t border-gray-200">
                <ThirdwebStyleModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}