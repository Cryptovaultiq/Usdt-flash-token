# Usdt Token

This project builds a simple custom ERC-20 token named `Usdt-Token` with symbol `USDT`.

## What it does

- Deploys a token contract with a fixed initial supply.
- Mints the initial supply to the deployer.
- Allows the owner to transfer tokens to any wallet.
- Uses metadata-friendly token name and symbol so wallets can show `Usdt`.

## Limitations

- This is not real USDT.
- It is a custom ERC-20 token with no native bridge or on-chain USDT backing.
- Wallets may show it if the token contract is added or if the wallet detects the token on-chain.
- Importing the same phrase into another wallet does not automatically add the token unless the wallet auto-detects tokens on-chain.

## Setup

1. Install dependencies:
   ```bash
   cd token
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in values.

3. Deploy locally:
   ```bash
   npm run deploy:local
   ```

4. If using Sepolia, add keys and run:
   ```bash
   npm run deploy:sepolia
   ```

## Usage

- Deploy contract then set `CONTRACT_ADDRESS` in `.env`.
- Send tokens:
  ```bash
  npm run transfer:local
  ```

- Check balance:
  ```bash
  npm run balance:local
  ```

## Notes on wallet display

- `Usdt-Token` is the token name and `USDT` is the symbol.
- To appear in wallets like Trust Wallet, some wallets require adding the token contract manually or auto-detecting it from chain activity.
- A wallet import from the same phrase can show the token balance once the token contract is known to that wallet.
