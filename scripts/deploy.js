const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Deploying from:", signer.address);

  const UsdtToken = await hre.ethers.getContractFactory("UsdtToken");
  const usdtToken = await UsdtToken.deploy();

  const deploymentTx = usdtToken.deploymentTransaction();
  const receipt = await deploymentTx.wait();
  const address = await usdtToken.getAddress();

  console.log("✅ UsdtToken deployed to:", address);
  console.log("Tx hash:", deploymentTx.hash);
  console.log("Block number:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed.toString());
  console.log("\nNext steps:");
  console.log("1. Update metadata/usdt-metadata.json with this address");
  console.log("2. Verify contract on Etherscan");
  console.log("3. Update token info on Etherscan with logo");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});