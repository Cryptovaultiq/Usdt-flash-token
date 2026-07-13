const hre = require("hardhat");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
  const UsdtToken = await hre.ethers.getContractAt("UsdtToken", contractAddress);

  readline.question("Enter recipient address: ", async (recipient) => {
    readline.question("Enter amount to send: ", async (amount) => {
      console.log(`Sending ${amount} USDT to ${recipient}...`);

      try {
        const tx = await UsdtToken.transfer(recipient, hre.ethers.parseUnits(amount, 18));
        await tx.wait();
        console.log(`✅ Successfully sent ${amount} USDT to ${recipient}`);
        console.log(`Tx hash: ${tx.hash}`);
      } catch (error) {
        console.error("Error:", error.message);
      }

      readline.close();
    });
  });
}

main();