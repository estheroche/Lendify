'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Zap,
  Shield,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { somniaTestnet } from '@/lib/web3-config'
import { shortenAddress } from '@/lib/utils'

interface WalletConnectModalProps {
  size?: 'default' | 'sm' | 'lg' | 'xl'
  variant?: 'default' | 'outline'
  className?: string
}

export function WalletConnectModal({ size = 'default', variant = 'default', className }: WalletConnectModalProps) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<any>(null)

  const isOnSomnia = chainId === somniaTestnet.id
  const needsNetworkSwitch = isConnected && !isOnSomnia

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConnect = async (connector: any) => {
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

  // Show network switch button if connected to wrong network
  if (needsNetworkSwitch) {
    return (
      <Button 
        onClick={handleSwitchNetwork}
        disabled={isSwitching}
        variant="outline"
        size={size}
        className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10"
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

  // Show connected state with dropdown
  if (isConnected && address && isOnSomnia) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={size} className="border-green-500/50 text-green-300 hover:bg-green-500/10">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            {shortenAddress(address)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 bg-slate-800 border-slate-700">
          {/* Connection Status */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">Connected to Somnia</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                ULTRA-FAST
              </Badge>
            </div>
            <div className="text-xs text-gray-400 font-mono bg-slate-700/50 rounded px-2 py-1">
              {address}
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-slate-700" />
          
          {/* Actions */}
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer px-4 py-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                Address Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-3" />
                Copy Address
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => window.open(`https://explorer.somnia.network/address/${address}`, '_blank')}
            className="text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer px-4 py-2"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            View on Somnia Explorer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-slate-700" />
          
          <DropdownMenuItem 
            onClick={() => disconnect()}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer px-4 py-2"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Show connect button with modal
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isConnecting || isPending}
          size={size}
          variant={variant}
          className={className}
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
      <DialogContent className="sm:max-w-lg bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold text-white">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Connect your wallet to start using Lendify
          </DialogDescription>
        </DialogHeader>

        {/* Wallet Options */}
        <div className="space-y-2">
          <AnimatePresence>
            {connectors.map((connector, index) => (
              <motion.div
                key={connector.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <button
                  onClick={() => handleConnect(connector)}
                  disabled={isPending || selectedConnector?.id === connector.id}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      {connector.id === 'metaMask' ? (
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                          🦊
                        </div>
                      ) : (
                        <Wallet className="w-6 h-6 text-white/60" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white text-base">
                        {connector.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {connector.id === 'metaMask' ? 'Connect using MetaMask wallet' : 'Connect using browser wallet'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {selectedConnector?.id === connector.id && isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Network Badge */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Somnia Network</span>
            <Badge className="bg-purple-500/30 text-purple-200 text-xs">
              TESTNET
            </Badge>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By connecting your wallet, you agree to our{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}