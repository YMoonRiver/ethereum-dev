'use client'

import { TOKENS } from '../config/tokens'
import { TokenItem } from './TokenItem'

export function TokenList() {
  return (
    <div>
      <h2>Assets</h2>
      {TOKENS.map((token) => (
        <TokenItem key={token.address} token={token} />
      ))}
    </div>
  )
}