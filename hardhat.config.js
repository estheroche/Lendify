require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000 // Increased for Somnia's high-performance requirements
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // Somnia Dream Testnet - Ultra-high performance blockchain
    somnia: {
      url: "https://dream-rpc.somnia.network",
      chainId: 50312,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
      timeout: 60000,
      // Optimized for Somnia's sub-second finality
      confirmations: 1,
    },
    // Keep Arbitrum for comparison purposes
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      // Note: Add Somnia explorer API key when available
      somnia: "no-api-key-needed"
    },
    customChains: [
      {
        network: "somnia",
        chainId: 50312,
        urls: {
          apiURL: "https://explorer-api.somnia.network/api",
          browserURL: "https://explorer.somnia.network"
        }
      }
    ]
  }
};