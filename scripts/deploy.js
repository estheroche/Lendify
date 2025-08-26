const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying LendBitZero MVP...");

  const LendBitZero = await ethers.getContractFactory("LendBitZeroFixed");
  const lendBitZero = await LendBitZero.deploy();
  
  await lendBitZero.waitForDeployment();
  
  const contractAddress = await lendBitZero.getAddress();
  console.log("✅ LendBitZero deployed to:", contractAddress);

  // Set up initial access control
  console.log("Setting up access control...");
  const [owner] = await ethers.getSigners();
  
  // Owner is already a verifier and oracle by default
  console.log("✅ Owner set as verifier and oracle:", owner.address);
  
  // Get some initial stats
  const stats = await lendBitZero.getProtocolStats();
  console.log("📊 Initial Protocol Stats:");
  console.log("  - Total Assets:", stats[3].toString());
  console.log("  - Total Loans:", stats[4].toString());
  console.log("  - TVL:", ethers.formatEther(stats[0]), "ETH");
  
  console.log("\n🎯 Contract ready for frontend integration!");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Hardhat Local (Chain ID: 31337)");
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });