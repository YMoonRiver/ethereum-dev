# Frontend (Next.js + wagmi + RainbowKit)

This is the frontend of the Ethereum DApp, built with a modern Web3 stack:

* Next.js (App Router)
* wagmi (React hooks for Ethereum)
* viem (low-level RPC client)
* RainbowKit (wallet connection UI)

---

## ✨ Features

* Connect wallet (MetaMask, WalletConnect, etc.)
* Read on-chain data (ERC20 balance)
* Write transactions (mint token)
* Listen to smart contract events (Minted)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── abi/              # Contract ABI (copied from foundry)
│   ├── lib/              # wagmi config
│   ├── components/       # UI components (Balance, MintButton, etc.)
│   └── constants.ts      # Contract addresses
│
├── public/
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

---

### 2. Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔗 Connect to Smart Contract

### Contract Address

Edit:

```
src/constants.ts
```

```ts
export const TOKEN_ADDRESS = '0xYourContractAddress'
```

---

### ABI

Make sure ABI is copied from the Foundry project:

```
foundry/out/MyToken.sol/MyToken.json
```

→ copy to:

```
frontend/src/abi/MyToken.json
```

---

## 🧠 Core Concepts

### Wallet Connection

Handled by RainbowKit:

```tsx
<ConnectButton />
```

---

### Read Contract (balance)

```ts
useReadContract({
  address: TOKEN_ADDRESS,
  abi,
  functionName: 'balanceOf',
  args: [address],
})
```

---

### Write Contract (mint)

```ts
useWriteContract({
  address: TOKEN_ADDRESS,
  abi,
  functionName: 'mint',
  args: [address, BigInt(1e18)],
})
```

---

### Event Listening

```ts
useWatchContractEvent({
  eventName: 'Minted',
  onLogs(logs) {
    console.log(logs)
  },
})
```

---

## ⚙️ Configuration

### Network

Currently using:

* Sepolia Testnet

Configured in:

```
src/lib/wagmi.ts
```

---

### WalletConnect

You need a `projectId` from WalletConnect:

```
https://cloud.walletconnect.com/
```

---

## ⚠️ Notes

* Make sure MetaMask is connected to Sepolia
* Ensure your wallet has test ETH
* ABI must match deployed contract
* Use `BigInt` for token amounts (not number)

---

## 🔒 Security Reminder

* Never expose private keys in frontend
* All transactions must be signed by the user wallet

---

## 🧩 Future Improvements

* Transaction status UI (pending / success / error)
* Token transfer UI
* Event history display
* Better state management
* UI framework (Tailwind / Shadcn)

---

## 🧱 Related

* Smart Contracts → `../foundry/`
* Shared ABI → `../shared/`

---

## 📌 Goal

This frontend is designed to:

> Bridge smart contracts and users, turning on-chain logic into a usable product.
