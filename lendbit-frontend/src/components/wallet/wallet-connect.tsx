'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Zap,
  Network,
  Copy,
  LogOut
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { somniaTestnet, addSomniaNetwork, switchToSomnia } from '@/lib/web3-config'
import { shortenAddress } from '@/lib/utils'

interface WalletConnectProps {
  size?: 'default' | 'sm' | 'lg' | 'xl'
  showDisconnect?: boolean
  showNetworkInfo?: boolean
}

export function WalletConnect({ 
  size = 'default', 
  showDisconnect = false,
  showNetworkInfo = false 
}: WalletConnectProps) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  
  const [showConnectors, setShowConnectors] = useState(false)
  const [copied, setCopied] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)

  const isOnSomnia = chainId === somniaTestnet.id
  const needsNetworkSwitch = isConnected && !isOnSomnia

  // Handle network switching
  const handleSwitchToSomnia = async () => {
    try {
      setNetworkError(null)
      
      if (switchChain) {
        // Try using wagmi first
        switchChain({ chainId: somniaTestnet.id })
      } else {
        // Fallback to direct MetaMask interaction
        const success = await switchToSomnia()
        if (!success) {
          setNetworkError('Failed to switch to Somnia network. Please try again.')
        }
      }
    } catch (error: unknown) {
      console.error('Network switch error:', error)
      
      if ((error as { code?: number }).code === 4902) {
        // Network not added to wallet
        const added = await addSomniaNetwork()
        if (!added) {
          setNetworkError('Please add Somnia network to your wallet manually.')
        }
      } else {
        setNetworkError((error as Error)?.message || 'Failed to switch networks')
      }
    }
  }

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Handle connector selection
  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setShowConnectors(false)
    }
  }

  // Clear network error when network changes
  useEffect(() => {
    if (isOnSomnia) {
      setNetworkError(null)
    }
  }, [isOnSomnia])

  if (isConnected && needsNetworkSwitch) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">Switch to Somnia Network</h3>
                <p className="text-sm text-gray-300">
                  Please switch to Somnia Dream Testnet to use Lendify
                </p>
              </div>
            </div>
            
            {networkError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{networkError}</p>
              </div>
            )}
            
            <div className="flex space-x-3 mt-4">
              <Button
                onClick={handleSwitchToSomnia}
                disabled={isSwitching}
                className="flex-1"
              >
                {isSwitching ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Network className="w-4 h-4 mr-2" />
                )}
                Switch Network
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => disconnect()}
                className="border-gray-600 text-gray-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isConnected && isOnSomnia) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        {showNetworkInfo && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-semibold text-white">Connected to Somnia</p>
                    <p className="text-sm text-gray-300">Ultra-fast RWA lending ready</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  ULTRA-FAST
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">
              {shortenAddress(address!)}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyAddress}
              className="p-1 h-auto"
            >
              {copied ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
              )}
            </Button>
          </div>

          {showDisconnect && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnect()}
              className="border-gray-600 text-gray-300"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Disconnect
            </Button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {!showConnectors ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={() => setShowConnectors(true)}
              disabled={isConnecting || isPending}
              size={size}
              className="w-full"
            >
              {isConnecting || isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Connect Wallet</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConnectors(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-2">
                  {connectors.map((connector) => (
                    <Button
                      key={connector.id}
                      variant="outline"
                      onClick={() => handleConnect(connector.id)}
                      disabled={isPending}
                      className="w-full justify-start border-gray-600 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10"
                    >
                      <div className="w-5 h-5 mr-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded" />
                      {connector.name}
                      {connector.id === 'metaMask' && (
                        <Badge className="ml-auto bg-blue-500/20 text-blue-300 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>Connecting to Somnia Dream Testnet</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Experience 1M+ TPS and sub-second finality
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}