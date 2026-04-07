'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Balance } from '../components/Balance'
import { Transfer } from '../components/Transfer'
import { TokenList } from '../components/TokenList'

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>My DApp</h1>
      <ConnectButton />

      <Balance />

      <Transfer />

      <TokenList />
    </div>
  )
}