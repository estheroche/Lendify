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
  X
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
        className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10 font-medium"
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
            className="bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20 font-medium"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            {shortenAddress(address)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-black border-zinc-800">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm font-medium text-white">Connected</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-1">
                Somnia
              </Badge>
            </div>
            <div className="text-xs text-zinc-400 font-mono bg-zinc-900 rounded p-2 mb-3">
              {address}
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-zinc-800" />
          
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 mr-3" />
            )}
            {copied ? 'Copied!' : 'Copy Address'}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => window.open(`https://explorer.somnia.network/address/${address}`, '_blank')}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            View on Explorer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-zinc-800" />
          
          <DropdownMenuItem 
            onClick={() => disconnect()}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Connect button with Thirdweb-style modal
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isConnecting || isPending}
          size={size}
          variant={variant}
          className={`bg-white text-black hover:bg-gray-100 font-semibold ${className}`}
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
              Connect Wallet
            </DialogTitle>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Chain Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Somnia Testnet</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Chain ID: 50312</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
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
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        {isMetaMask ? (
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-lg">
                            🦊
                          </div>
                        ) : (
                          <Wallet className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          {connector.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {isMetaMask ? 'Most popular wallet' : 'Browser wallet'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isMetaMask && (
                        <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs px-2 py-1">
                          Recommended
                        </Badge>
                      )}
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-blue-500 transition-colors" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              By connecting, you agree to our{' '}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}