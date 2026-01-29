# Base Score App 🔵

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Network](https://img.shields.io/badge/network-Base_Mainnet-0052FF)
![Status](https://img.shields.io/badge/status-Active_Development-green)

**Base Score** is a decentralized reputation dashboard built on the **Base** L2 network. It aggregates a user's on-chain activity and **Farcaster** social graph to calculate a unified reputation score.

Designed with a high-contrast **Neumorphic (Embossed)** interface, the app provides a sleek, tactile user experience while leveraging the full power of the **OnchainKit** and **Wagmi** ecosystem.

---

## ✨ Key Features

### 🔐 Dual-Layer Authentication
- **Wallet Connection:** Robust support for multiple wallet standards via a custom unified modal:
  - **Browser Extension:** Direct injection support for MetaMask, Rabby, etc.
  - **Coinbase Smart Wallet:** Seamless onboarding with passkeys.
  - **WalletConnect:** QR code scanning for mobile wallets.
- **Social Identity:** Native integration with **Farcaster Auth Kit** for decentralized social identity verification.

### 🎨 High-Fidelity UI/UX
- **Neumorphism Design:** A modern, "Soft UI" aesthetic featuring embossed elements, pressed states, and realistic lighting effects.
- **High Contrast Mode:** Optimized for legibility and visual hierarchy in dark environments.
- **Responsive Layout:** Fully adaptive design that works seamlessly across desktop and mobile devices.

### 📊 Reputation Metrics (Beta)
- **Onchain Score:** Aggregated score based on transaction volume, contract interactions, and wallet age on Base.
- **Social Graph Value:** Valuation based on Farcaster follower quality and engagement.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain Hooks:** [Wagmi v2](https://wagmi.sh/) & [Viem](https://viem.sh/)
- **Component Kits:** - [OnchainKit](https://onchainkit.xyz/) (Base interactions)
  - [Farcaster Auth Kit](https://docs.farcaster.xyz/auth-kit/) (Social login)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- **Node.js** (v18.17.0 or later)
- **pnpm**, **npm**, or **yarn**
- A **WalletConnect** Project ID
- An **OnchainKit** API Key (from Coinbase Developer Portal)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/bayyubenjamin/base-score-app.git](https://github.com/bayyubenjamin/base-score-app.git)
   cd base-score-app  

2. **Configure Environment Variables:**
Create a `.env` file in the root directory and add your keys:
```bash
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

```


3. **Run the development server:**
```bash
npm run dev

```


4. **Open your browser:**
Navigate to [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the app.

---

### 📂 Project Structure

```bash
src/
├── app/
│   ├── globals.css       # Global styles (Neumorphism utilities)
│   ├── layout.tsx        # Root layout with Providers
│   └── page.tsx          # Main dashboard view
├── components/
│   ├── ConnectModal.tsx  # Custom unified wallet & social login modal
│   ├── Providers.tsx     # Wagmi, Query, & OnchainKit configuration
│   └── ...
└── public/               # Static assets (SVGs, icons)

```

---

### 🔧 Customization

#### Adjusting the Neumorphism Theme

You can tweak the shadow intensity and lighting direction in `src/app/globals.css` under the `@layer utilities` section:

```css
.emboss-flat {
  background: linear-gradient(145deg, #1c1d21, #17181b);
  box-shadow:  5px 5px 10px #121315, -5px -5px 10px #222327;
}

```

#### Adding New Connectors

Modify `src/components/Providers.tsx` to add support for additional wallets (e.g., Safe, Ledger):

```typescript
connectors: [
  injected(),
  coinbaseWallet(),
  walletConnect({ projectId: ... }),
  // Add others here
],

```

---

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

Built with ❤️ by [Bayyu Benjamin](https://www.google.com/search?q=https://github.com/bayyubenjamin) on **Base**.

```

```
