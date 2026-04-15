'use client'

import { useEffect, useMemo, useState } from 'react'
import { parseEther, formatEther } from 'viem'
import { usePublicClient } from 'wagmi'

import { TOKENS, ADDRESS } from '../config/tokens'

import {
    useWriteSimpleSwapSwapAforB,
    useWriteSimpleSwapSwapBforA,
    useReadSimpleSwapReserveA,
    useReadSimpleSwapReserveB,
    useWriteMyTokenApprove,
} from '../contracts/generated'

export function Swap() {
    const [mounted, setMounted] = useState(false)
    const [amount, setAmount] = useState('')
    const [mode, setMode] = useState<'AtoB' | 'BtoA'>('AtoB')
    const [loading, setLoading] = useState(false)

    const publicClient = usePublicClient()

    const TOKEN_A = TOKENS[1].address
    const TOKEN_B = TOKENS[2].address
    const SWAP = ADDRESS[0].address

    useEffect(() => setMounted(true), [])

    // =========================
    // 1. READ RESERVES
    // =========================
    const { data: reserveA } = useReadSimpleSwapReserveA({
        address: SWAP,
    })

    const { data: reserveB } = useReadSimpleSwapReserveB({
        address: SWAP,
    })

    // =========================
    // 2. WRITE
    // =========================
    const { writeContractAsync: swapAforB } =
        useWriteSimpleSwapSwapAforB()

    const { writeContractAsync: swapBforA } =
        useWriteSimpleSwapSwapBforA()

    const { writeContractAsync: approve } =
        useWriteMyTokenApprove()

    // =========================
    // 3. INPUT
    // =========================
    const amountBN = useMemo(() => {
        if (!amount) return BigInt(0)
        try {
            return parseEther(amount)
        } catch {
            return BigInt(0)
        }
    }, [amount])

    // =========================
    // 4. AMM QUOTE
    // =========================
    const output = useMemo(() => {
        if (!reserveA || !reserveB || amountBN === BigInt(0)) return BigInt(0)

        const rA = reserveA
        const rB = reserveB

        if (mode === 'AtoB') {
            return (rB * amountBN) / (rA + amountBN)
        } else {
            return (rA * amountBN) / (rB + amountBN)
        }
    }, [amountBN, reserveA, reserveB, mode])

    // =========================
    // 5. SWAP (approve + swap 串行)
    // =========================
    const handleSwap = async () => {
        if (!amountBN || loading) return

        try {
            setLoading(true)

            const token = mode === 'AtoB' ? TOKEN_A : TOKEN_B

            // 1️⃣ approve
            const approveHash = await approve({
                address: token,
                args: [SWAP, amountBN],
            })

            if (!publicClient) throw new Error('publicClient not ready')

            await publicClient.waitForTransactionReceipt({
                hash: approveHash,
            })

            // 2️⃣ swap
            if (mode === 'AtoB') {
                const swapHash = await swapAforB({
                    address: SWAP,
                    args: [amountBN],
                })

                await publicClient.waitForTransactionReceipt({
                    hash: swapHash,
                })
            } else {
                const swapHash = await swapBforA({
                    address: SWAP,
                    args: [amountBN],
                })

                await publicClient.waitForTransactionReceipt({
                    hash: swapHash,
                })
            }

            // 清空输入（体验优化）
            setAmount('')

        } catch (err) {
            console.error('Swap error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    // =========================
    // 6. UI
    // =========================
    return (
        <div style={{ padding: 24, maxWidth: 420 }}>
            <h2>🔥 Mini Uniswap V1</h2>

            {/* mode switch */}
            <div style={{ marginBottom: 12 }}>
                <button
                    disabled={loading}
                    onClick={() => setMode('AtoB')}
                >
                    A → B
                </button>

                <button
                    disabled={loading}
                    onClick={() => setMode('BtoA')}
                    style={{ marginLeft: 8 }}
                >
                    B → A
                </button>
            </div>

            {/* input */}
            <input
                placeholder="amount"
                value={amount}
                disabled={loading}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* quote */}
            <div style={{ marginTop: 12 }}>
                <p>
                    Output: <b>{formatEther(output)}</b>
                </p>

                <p>Reserve A: {reserveA ? formatEther(reserveA) : '0'}</p>
                <p>Reserve B: {reserveB ? formatEther(reserveB) : '0'}</p>
            </div>

            {/* actions */}
            <div style={{ marginTop: 12 }}>
                <button
                    onClick={handleSwap}
                    disabled={loading || !amountBN}
                >
                    {loading ? 'Processing...' : 'Approve + Swap'}
                </button>
            </div>
        </div>
    )
}