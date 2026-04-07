'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useReadMyTokenBalanceOf } from '../contracts/generated'
import { formatUnits } from 'viem'

export function TokenItem({ token }: any) {
  const { address } = useAccount()

  const { data } = useReadMyTokenBalanceOf({
    address: token.address,
    args: address ? [address] : undefined,
  })

  return (
    <Link href={`/token/${token.address}`}>
      <div style={{ border: '1px solid #ccc', padding: 10, marginTop: 10 }}>
        <div>{token.symbol}</div>
        <div>{data ? formatUnits(data, token.decimals) : '0'}</div>
      </div>
    </Link>
  )
}