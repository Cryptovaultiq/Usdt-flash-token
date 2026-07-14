require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set in the environment.");
  }

  const provider = ethers.provider;
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying from:", wallet.address);

  const UsdtToken = await hre.ethers.getContractFactory("UsdtToken", wallet);
  const contract = await UsdtToken.deploy();
  const txHash = contract.deploymentTransaction()?.hash;
  const address = await contract.getAddress();

  console.log("✅ UsdtToken deployed to:", address);
  console.log("Tx hash:", txHash);
  console.log("\nNext steps:");
  console.log("1. Update metadata/usdt-metadata.json with this address");
  console.log("2. Verify contract on Etherscan");
  console.log("3. Update token info on Etherscan with logo");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});