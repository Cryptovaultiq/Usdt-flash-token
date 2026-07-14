import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';

const TOKEN_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function owner() view returns (address)',
  'function decimals() view returns (uint8)'
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [owner, setOwner] = useState('');
  const [contractAddress, setContractAddress] = useState(import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || '0x6013b5f1b078177195e3ED8e5ED50bAa47fc20Cf');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('Connect any WalletConnect-compatible wallet to continue.');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

      if (!projectId) {
        setMessage('WalletConnect project ID is not configured. Please set VITE_WALLETCONNECT_PROJECT_ID in your environment.');
        return;
      }

      const wcProvider = await EthereumProvider.init({
        projectId,
        chains: [1],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData_v4'],
        events: ['chainChanged', 'accountsChanged']
      });

      await wcProvider.enable();

      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const signerInstance = await ethersProvider.getSigner();
      const account = await signerInstance.getAddress();
      const network = await ethersProvider.getNetwork();

      setProvider(ethersProvider);
      setSigner(signerInstance);
      setAddress(account);
      setChainId(network.chainId.toString());
      setMessage('Wallet connected. You can now send tokens.');
    } catch (error) {
      setMessage(`Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!signer || !contractAddress) return;

    const checkOwner = async () => {
      try {
        const contract = new ethers.Contract(contractAddress, TOKEN_ABI, signer);
        const ownerAddress = await contract.owner();
        setOwner(ownerAddress.toLowerCase() === address.toLowerCase() ? 'You are the owner' : 'You are not the owner');
      } catch (error) {
        setOwner('Unable to verify owner');
      }
    };

    checkOwner();
  }, [signer, contractAddress, address]);

  const sendTokens = async () => {
    if (!signer || !contractAddress || !recipient || !amount) {
      setMessage('Please fill in the contract address, recipient address, and amount.');
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(contractAddress, TOKEN_ABI, signer);
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(amount, Number(decimals));
      const tx = await contract.transfer(recipient, parsedAmount);
      setMessage('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setMessage(`Transfer successful. Tx: ${tx.hash}`);
    } catch (error) {
      setMessage(`Transfer failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>USDT Token Sender</h1>
      <p>Connect any WalletConnect-compatible wallet and send tokens to any recipient address.</p>

      <div style={{ background: '#111827', color: 'white', padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <button onClick={connectWallet} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <p><strong>Wallet:</strong> {address || 'Not connected'}</p>
        <p><strong>Chain ID:</strong> {chainId || 'Not connected'}</p>
        <p><strong>Owner status:</strong> {owner || 'Waiting for contract address'}</p>
      </div>

      <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Token Contract Address</label>
        <input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="0x6013b5f1b078177195e3ED8e5ED50bAa47fc20Cf" style={{ width: '100%', padding: 10, marginBottom: 12 }} />

        <label style={{ display: 'block', marginBottom: 6 }}>Recipient Wallet Address</label>
        <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..." style={{ width: '100%', padding: 10, marginBottom: 12 }} />

        <label style={{ display: 'block', marginBottom: 6 }}>Amount</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100" style={{ width: '100%', padding: 10, marginBottom: 12 }} />

        <button onClick={sendTokens} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>
          {loading ? 'Processing...' : 'Send Tokens'}
        </button>
      </div>

      <div style={{ marginTop: 20, padding: 16, background: '#e2e8f0', borderRadius: 12 }}>
        {message}
      </div>
    </div>
  );
}

export default App;
