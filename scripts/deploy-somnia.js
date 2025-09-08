const { ethers, network } = require("hardhat");

async function main() {
  console.log("🚀 Deploying LendifyCore to Somnia Dream Testnet...");
  console.log("Network:", network.name);
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "STT");
  
  // Deploy LendifyCore contract
  console.log("\n📄 Deploying LendifyCore contract...");
  const LendifyCore = await ethers.getContractFactory("LendifyCore");
  
  // Estimate gas for deployment
  const deployTx = await LendifyCore.getDeployTransaction();
  const gasEstimate = await ethers.provider.estimateGas(deployTx);
  console.log("Estimated gas for deployment:", gasEstimate.toString());
  
  const lendifyCore = await LendifyCore.deploy({
    gasLimit: gasEstimate * BigInt(110) / BigInt(100) // Add 10% buffer
  });
  
  console.log("⏳ Waiting for deployment confirmation...");
  await lendifyCore.waitForDeployment();
  
  const contractAddress = await lendifyCore.getAddress();
  console.log("✅ LendifyCore deployed to:", contractAddress);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await lendifyCore.owner();
  console.log("Contract owner:", owner);
  
  const protocolStats = await lendifyCore.getProtocolStats();
  console.log("Initial protocol stats:");
  console.log("  - Total Value Locked:", ethers.formatEther(protocolStats.totalValueLocked), "STT");
  console.log("  - Total Assets:", protocolStats.totalAssets.toString());
  console.log("  - Total Loans:", protocolStats.totalLoansOriginated.toString());
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  // Test asset type minimum values
  const realEstateMin = await lendifyCore.assetTypeMinValues(0); // RealEstate
  console.log("Real Estate minimum value:", ethers.formatEther(realEstateMin), "STT");
  
  // Set up some initial authorized verifiers (optional)
  if (network.name === "somnia") {
    console.log("\n⚙️  Setting up initial configuration for mainnet...");
    // Add any mainnet-specific setup here
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Explorer URL:", `https://explorer.somnia.network/address/${contractAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    gasUsed: gasEstimate.toString(),
    transactionHash: lendifyCore.deploymentTransaction()?.hash,
  };
  
  console.log("\n📋 Deployment Summary:");
  console.table(deploymentInfo);
  
  // Instructions for frontend update
  console.log("\n📱 Next Steps:");
  console.log("1. Update the CONTRACT_ADDRESS in src/lib/contract-config.ts");
  console.log(`   export const CONTRACT_ADDRESS = '${contractAddress}' as const`);
  console.log("2. Test the contract functions in the frontend");
  console.log("3. Verify the contract on Somnia Explorer (if available)");
  
  return contractAddress;
}

// Handle errors
main()
  .then((address) => {
    console.log(`\n✅ Deployment successful! Contract: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed!");
    console.error(error);
    process.exit(1);
  });