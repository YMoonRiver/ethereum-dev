import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'

export const config = getDefaultConfig({
  appName: 'My DApp',
  projectId: 'test', // 随便填（RainbowKit需要）
  chains: [
    {
      id: 31337,
      name: 'Anvil',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
      },
    },
  ],
  transports: {
    31337: http('http://127.0.0.1:8545'),
  },
})