import { useState } from 'react'

export const useTransaction = (): [any, boolean, string] => {
  const [txHash, setTxHash] = useState<string>()
  const [blocked, setBlocked] = useState(false)

  const sendTransaction = async (txFunc) => {
    setBlocked(true)
    try {
      const tx = await txFunc((hash) => {
        setTxHash(hash)
      })

      console.log(tx)
    } catch (err) {
      console.log('Transaction error:', err)
    }

    setBlocked(false)
    setTxHash(undefined)
  }

  return [sendTransaction, blocked, txHash]
}
