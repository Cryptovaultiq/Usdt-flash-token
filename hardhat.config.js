require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

const resolvedMainnetRpc = MAINNET_RPC_URL
  ? MAINNET_RPC_URL
  : INFURA_API_KEY && /^https?:\/\//i.test(INFURA_API_KEY)
    ? INFURA_API_KEY
    : INFURA_API_KEY
      ? `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
      : undefined;

if (!resolvedMainnetRpc) {
  console.warn("[hardhat] No INFURA_API_KEY or MAINNET_RPC_URL found. Mainnet deployment will not work until one is provided.");
}

if (!PRIVATE_KEY) {
  console.warn("[hardhat] No PRIVATE_KEY found. Mainnet deployment will not work until one is provided.");
}

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    mainnet: {
      url: resolvedMainnetRpc,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },
};