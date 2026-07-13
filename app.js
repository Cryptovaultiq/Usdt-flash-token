const contractAddressInput = document.getElementById('contractAddress');
const recipientAddressInput = document.getElementById('recipientAddress');
const amountInput = document.getElementById('amount');
const connectBtn = document.getElementById('connectBtn');
const sendBtn = document.getElementById('sendBtn');
const accountLabel = document.getElementById('accountLabel');
const networkLabel = document.getElementById('networkLabel');
const ownerLabel = document.getElementById('ownerLabel');
const messageBox = document.getElementById('messageBox');

let provider;
let signer;
let contract;
let connectedAddress = null;

const TOKEN_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function owner() view returns (address)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

async function connectWallet() {
  if (!window.ethereum) {
    messageBox.textContent = 'Please install MetaMask or another Ethereum wallet.';
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    connectedAddress = await signer.getAddress();

    accountLabel.textContent = connectedAddress;
    const network = await provider.getNetwork();
    networkLabel.textContent = `${network.name} (${network.chainId})`;

    messageBox.textContent = 'Wallet connected. Enter the contract address and recipient details.';
  } catch (error) {
    messageBox.textContent = `Connection failed: ${error.message}`;
  }
}

async function checkOwner() {
  const address = contractAddressInput.value.trim();
  if (!address || !connectedAddress) {
    ownerLabel.textContent = 'Waiting for contract address';
    return;
  }

  try {
    contract = new ethers.Contract(address, TOKEN_ABI, signer);
    const owner = await contract.owner();
    ownerLabel.textContent = owner.toLowerCase() === connectedAddress.toLowerCase() ? 'You are the owner' : 'You are not the owner';
  } catch (error) {
    ownerLabel.textContent = 'Unable to verify owner';
    messageBox.textContent = `Could not read contract: ${error.message}`;
  }
}

async function sendTokens() {
  if (!connectedAddress) {
    messageBox.textContent = 'Connect your wallet first.';
    return;
  }

  const contractAddress = contractAddressInput.value.trim();
  const recipientAddress = recipientAddressInput.value.trim();
  const amountValue = amountInput.value.trim();

  if (!contractAddress || !recipientAddress || !amountValue) {
    messageBox.textContent = 'Please fill in the contract address, recipient address, and amount.';
    return;
  }

  try {
    const decimals = await contract?.decimals?.();
    const parsedAmount = ethers.parseUnits(amountValue, decimals || 18);

    contract = new ethers.Contract(contractAddress, TOKEN_ABI, signer);
    const tx = await contract.transfer(recipientAddress, parsedAmount);
    messageBox.textContent = 'Transaction sent. Waiting for confirmation...';
    await tx.wait();
    messageBox.textContent = `Tokens sent successfully. Tx: ${tx.hash}`;
  } catch (error) {
    messageBox.textContent = `Transfer failed: ${error.message}`;
  }
}

connectBtn.addEventListener('click', connectWallet);
sendBtn.addEventListener('click', sendTokens);
contractAddressInput.addEventListener('blur', checkOwner);
