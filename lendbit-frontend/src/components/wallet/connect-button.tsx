'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { 
  Wallet, 
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { somniaTestnet } from '@/lib/web3-config'
import { shortenAddress } from '@/lib/utils'

export function ConnectButton() {
  const { address, isConnected, isConnecting } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  const [copied, setCopied] = useState(false)
  const [showConnectors, setShowConnectors] = useState(false)

  const isOnSomnia = chainId === somniaTestnet.id
  const needsNetworkSwitch = isConnected && !isOnSomnia

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConnect = (connector: ReturnType<typeof useConnect>['connectors'][0]) => {
    connect({ connector })
    setShowConnectors(false)
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
        variant="outline"
        className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Switch to Somnia
      </Button>
    )
  }

  // Show connected state
  if (isConnected && address && isOnSomnia) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-green-500/50 text-green-300 hover:bg-green-500/10">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            {shortenAddress(address)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-slate-800 border-slate-700">
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Connected to Somnia</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">{address}</div>
          </div>
          
          <DropdownMenuSeparator className="bg-slate-700" />
          
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => window.open(`https://explorer.somnia.network/address/${address}`, '_blank')}
            className="text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-slate-700" />
          
          <DropdownMenuItem 
            onClick={() => disconnect()}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Show connect options
  if (showConnectors) {
    return (
      <div className="flex flex-col space-y-2 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Connect Wallet</span>
          <button
            onClick={() => setShowConnectors(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            variant="outline"
            onClick={() => handleConnect(connector)}
            disabled={isPending}
            className="justify-start border-gray-600 text-gray-300 hover:border-blue-500/50 hover:bg-blue-500/10"
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
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
          Connecting to Somnia Dream Testnet
        </div>
      </div>
    )
  }

  // Show connect button
  return (
    <Button
      onClick={() => setShowConnectors(true)}
      disabled={isConnecting || isPending}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
  )
}