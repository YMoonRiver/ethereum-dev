'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import abi from '../abi/MyToken.json'
import { TOKEN_ADDRESS } from '../constants'
import { formatEther } from 'viem'

export function Balance() {
  const [mounted, setMounted] = useState(false)
  const { address } = useAccount()

  const { data, isLoading } = useReadContract({
    address: TOKEN_ADDRESS as `0x${string}`,
    abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!address) return <div>Not connected</div>
  if (isLoading) return <div>Loading...</div>

  return <div>MyToken Balance: {data ? formatEther(data as bigint) : '0'}</div>
}