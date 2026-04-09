'use client'

import { useEffect, useState } from 'react'
import { useAccount, useWatchContractEvent } from 'wagmi'
import { formatUnits } from 'viem'
import { useReadMyTokenBalanceOf, myTokenAbi, } from '../contracts/generated'
import { TOKENS } from '../config/tokens'

export function Balance() {
  const [mounted, setMounted] = useState(false)
  const { address } = useAccount()

  const token = TOKENS[0] // MVP先用一个

  const { data, isLoading, refetch } = useReadMyTokenBalanceOf({
    address: token.address,
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  useWatchContractEvent({
    address: token.address,
    abi: myTokenAbi,
    eventName: 'Transfer',
    onLogs(logs) {
      const hit = logs.some(
        (log) =>
          log.args.from === address ||
          log.args.to === address
      )

      if (hit) refetch()
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!address) return <div>Not connected</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div>
        {token.symbol} Balance:{' '}
        {data ? formatUnits(data, token.decimals) : '0'}
      </div>

      <button onClick={() => refetch()}>
        Refresh
      </button>
    </div>
  )
}