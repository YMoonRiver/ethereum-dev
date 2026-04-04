'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import abi from '../abi/MyToken.json'
import { TOKEN_ADDRESS } from '../constants'

export function Transfer() {
  const { address } = useAccount()

  const [mounted, setMounted] = useState(false)

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const { writeContract, data, isPending, isSuccess, error } =
    useWriteContract()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🚨 核心：SSR 不渲染任何 wagmi 相关 UI
  if (!mounted) return null

  if (!address) return <div>Please connect wallet</div>

  const handleTransfer = () => {
    if (!to || !amount) return

    writeContract({
      address: TOKEN_ADDRESS as `0x${string}`,
      abi,
      functionName: 'transfer',
      args: [to, parseEther(amount)],
    })
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Transfer ERC20</h3>

      <input
        placeholder="To Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />

      <button onClick={handleTransfer} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </button>

      {isSuccess && <div>✅ Success: {data}</div>}
      {error && <div>❌ Error: {error.message}</div>}
    </div>
  )
}