import { createConfig, http } from 'wagmi'
import { Chain } from 'viem'
import { injected, metaMask } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'

// Somnia Dream Testnet Chain Configuration
export const somniaTestnet: Chain = {
  id: 50312,
  name: 'Somnia Dream Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Somnia Explorer', 
      url: 'https://explorer.somnia.network' 
    },
  },
  contracts: {
    // Add contract addresses here after deployment
  },
  testnet: true,
  fees: {
    baseFeeMultiplier: 1.2,
    defaultPriorityFee: 1000000000n, // 1 gwei
  }
} as const

// Wagmi configuration for Somnia - simplified for better performance
export const wagmiConfig = createConfig({
  chains: [somniaTestnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    metaMask({
      dappMetadata: {
        name: 'Lendify',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        iconUrl: '/icon.png',
      },
    }),
  ],
  transports: {
    [somniaTestnet.id]: http('https://dream-rpc.somnia.network', {
      batch: true,
      fetchOptions: {
        timeout: 30000,
      },
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  ssr: true,
})

// React Query client for caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds - faster refresh for real-time data
      gcTime: 60_000, // 1 minute garbage collection
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Network parameters for adding Somnia to MetaMask
export const SOMNIA_NETWORK_PARAMS = {
  chainId: '0xC478', // 50312 in hex
  chainName: 'Somnia Dream Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://dream-rpc.somnia.network'],
  blockExplorerUrls: ['https://explorer.somnia.network'],
  iconUrls: [], // Add Somnia logo URL when available
}

// Helper function to add Somnia network to MetaMask
export const addSomniaNetwork = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SOMNIA_NETWORK_PARAMS],
      })
      return true
    } catch (error) {
      console.error('Failed to add Somnia network:', error)
      return false
    }
  }
  return false
}

// Helper function to switch to Somnia network
export const switchToSomnia = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xC478' }], // 50312 in hex
      })
      return true
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        return await addSomniaNetwork()
      }
      console.error('Failed to switch to Somnia network:', error)
      return false
    }
  }
  return false
}

// Contract configuration for Lendify
export const LENDIFY_CONTRACT = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const, // Will be updated after deployment
  chainId: somniaTestnet.id,
} as const

// Type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (accounts: string[]) => void) => void
      removeListener: (event: string, callback: (accounts: string[]) => void) => void
      isMetaMask?: boolean
    }
  }
}