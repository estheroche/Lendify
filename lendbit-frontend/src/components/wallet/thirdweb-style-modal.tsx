'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Wallet, 
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Shield,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { somniaTestnet } from '@/lib/web3-config'
import { shortenAddress } from '@/lib/utils'

interface ThirdwebStyleModalProps {
  size?: 'default' | 'sm' | 'lg' | 'xl'
  variant?: 'default' | 'outline'
  className?: string
}

export function ThirdwebStyleModal({ size = 'default', variant = 'default', className }: ThirdwebStyleModalProps) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<typeof connectors[0] | null>(null)

  const isOnSomnia = chainId === somniaTestnet.id
  const needsNetworkSwitch = isConnected && !isOnSomnia

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConnect = async (connector: typeof connectors[0]) => {
    setSelectedConnector(connector)
    try {
      await connect({ connector })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Connection failed:', error)
      setSelectedConnector(null)
    }
  }

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: somniaTestnet.id })
    }
  }

  // Wrong network state
  if (needsNetworkSwitch) {
    return (
      <Button 
        onClick={handleSwitchNetwork}
        disabled={isSwitching}
        variant="outline"
        size={size}
        className="border-amber-200 text-amber-700 hover:bg-amber-50 font-medium bg-amber-50"
      >
        {isSwitching ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <AlertTriangle className="w-4 h-4 mr-2" />
        )}
        Switch to Somnia
      </Button>
    )
  }

  // Connected state
  if (isConnected && address && isOnSomnia) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size={size} 
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 font-medium"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            {shortenAddress(address)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200 shadow-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900">Connected</span>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1">
                Somnia
              </Badge>
            </div>
            <div className="text-xs text-gray-600 font-mono bg-gray-100 rounded-lg p-3 mb-3 break-all">
              {address}
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-gray-100" />
          
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer mx-1 rounded-md"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 mr-3" />
            )}
            {copied ? 'Copied!' : 'Copy Address'}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => window.open(`https://explorer.somnia.network/address/${address}`, '_blank')}
            className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer mx-1 rounded-md"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            View on Explorer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-100" />
          
          <DropdownMenuItem 
            onClick={() => disconnect()}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer mx-1 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Connect button with professional modal
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isConnecting || isPending}
          size={size}
          variant={variant}
          className={`professional-button-primary ${className}`}
        >
          {isConnecting || isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border-gray-200 p-0 gap-0 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Connect Your Wallet
            </DialogTitle>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Connect to access your real-world asset portfolio
          </p>
        </DialogHeader>

        <div className="p-6">
          {/* Network Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Somnia Network</h3>
                  <p className="text-sm text-gray-600">Ultra-fast RWA lending • Chain ID: 50312</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Testnet
              </Badge>
            </div>
          </div>

          {/* Wallet Options */}
          <div className="space-y-3">
            <AnimatePresence>
              {connectors
                .filter((connector, index, arr) => {
                  // Remove duplicate MetaMask connectors - keep only one
                  if (connector.id === 'metaMask') {
                    return arr.findIndex(c => c.id === 'metaMask') === index;
                  }
                  return true;
                })
                .map((connector, index) => {
                const isMetaMask = connector.id === 'metaMask'
                const isLoading = selectedConnector?.id === connector.id && isPending
                
                return (
                  <motion.button
                    key={connector.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleConnect(connector)}
                    disabled={isPending}
                    className="professional-card w-full flex items-center justify-between p-4 hover:shadow-md transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        {isMetaMask ? (
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <Wallet className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          {connector.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isMetaMask ? 'Most popular Web3 wallet' : 'Browser extension wallet'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isMetaMask && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1">
                          Recommended
                        </Badge>
                      )}
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Secure Connection</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Your wallet connection is encrypted and secure. We never store your private keys.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By connecting, you agree to our{' '}
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Terms of Service</span>
              {' '}and{' '}
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Privacy Policy</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}