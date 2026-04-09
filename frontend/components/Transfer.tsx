'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { TOKEN_ADDRESS } from '../constants'
import {
  useSimulateMyTokenTransfer,
  useWriteMyTokenTransfer,
} from '../contracts/generated'

export function Transfer() {
  const { address } = useAccount()

  const [mounted, setMounted] = useState(false)

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteMyTokenTransfer()

  const { isLoading: confirming, isSuccess } =
    useWaitForTransactionReceipt({
    hash,
  })

  const handleSend = () => {
    if (simulateError) return

    writeContract({
      address: TOKEN_ADDRESS,
      args: [
        to as `0x${string}`,
        parseUnits(amount, 18),
      ],
    })
  }

  const { isLoading: simulating, error: simulateError, isSuccess: simulateSuccess, } =
    useSimulateMyTokenTransfer({
      address: TOKEN_ADDRESS,
      args:
        to && amount
          ? [
              to as `0x${string}`,
              parseUnits(amount, 18),
            ]
          : undefined,

      query: {
        enabled: !!to && !!amount,
      },
    })

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 🚨 核心：SSR 不渲染任何 wagmi 相关 UI
  if (!mounted) return null

  if (!address) return <div>Please connect wallet</div>

  return (
    <div style={{ marginTop: 20 }}>
      <input
        placeholder="to"
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        placeholder="amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={
          simulating ||
          isPending ||
          confirming
        }
      >
        Send
      </button>

      {simulating && (
        <div>Checking transaction...</div>
      )}

      {simulateSuccess && !simulateError && (
        <div>Simulation Passed ✅</div>
      )}

      {simulateError && (
        <div>
          Simulation Failed ❌: {simulateError.message}
        </div>
      )}

      {isPending && <div>Waiting Wallet Confirm...</div>}

      {confirming && <div>Blockchain Confirming...</div>}

      {isSuccess && <div>Success ✅</div>}

      {error && <div>{error.message}</div>}

    </div>
  )
}