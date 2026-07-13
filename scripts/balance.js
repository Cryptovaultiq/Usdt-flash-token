const hre = require("hardhat");

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
  const UsdtToken = await hre.ethers.getContractAt("UsdtToken", contractAddress);
  const [signer] = await hre.ethers.getSigners();
  
  const balance = await UsdtToken.balanceOf(signer.address);
  const formattedBalance = hre.ethers.formatUnits(balance, 18);
  
  // Fake price for demonstration (you can change this)
  const fakePrice = 1.00; 
  const usdValue = (parseFloat(formattedBalance) * fakePrice).toLocaleString();

  console.log("✅ Balance:", formattedBalance, "USDT");
  console.log("💰 USD Value:", "$" + usdValue);
  console.log("This is Usdt price for Tether USD Token");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});