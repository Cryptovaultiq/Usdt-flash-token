const hre = require("hardhat");

async function main() {
  const contractAddress = "0x6013b5f1b078177195e3ED8e5ED50bAa47fc20Cf";
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