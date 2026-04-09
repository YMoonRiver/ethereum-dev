'use client'

import { useState } from 'react'
import { useWatchContractEvent } from 'wagmi'
import { myTokenAbi } from '../contracts/generated'
import { TOKENS } from '../config/tokens'
import { formatUnits } from 'viem'

export function TransactionHistory() {
  const [history, setHistory] = useState<any[]>([])

  const token = TOKENS[0]

  useWatchContractEvent({
    address: token.address,
    abi: myTokenAbi,
    eventName: 'Transfer',

    onLogs(logs) {
      setHistory((prev) => [
        ...logs.map((log) => ({
          from: log.args.from,
          to: log.args.to,
          value: log.args.value?.toString(),
        })),
        ...prev,
      ])
    },
  })

  return (
    <div>
      <h3>History</h3>

      {history.map((tx, i) => (
        <div key={i}>
          {tx.from?.slice(0, 6)} →
          {tx.to?.slice(0, 6)}
          : {formatUnits(tx.value, token.decimals)}
        </div>
      ))}
    </div>
  )
}