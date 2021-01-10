import { useEffect, useState } from 'react'
// import { getEpoch } from '../utils/infura'
// import { ZAIS } from '../constants/tokens'

const epochStart = 1608422400
const epochPeriod = 1800

const epochformatted = () => {
  const unixTimeSec = Math.floor(Date.now() / 1000)
  const diff = unixTimeSec - epochStart
  const epoch = Math.floor(diff / epochPeriod)
  const rest = diff % epochPeriod

  const epochMinute = Math.floor(rest / 60)
  const epochSecond = rest % 60

  const minutesLeft = 29 - epochMinute
  const secondsLeft = 59 - epochSecond

  return {
    epoch,
    epochTime: `00:${
      minutesLeft > 9 ? minutesLeft : '0' + minutesLeft.toString()
    }:${secondsLeft > 9 ? secondsLeft : '0' + secondsLeft.toString()}`,
  }
}

export const useEpoch = () => {
  const [epoch, setEpoch] = useState(null)
  const [epochOnChain] = useState(0)
  const [epochTime, setEpochTime] = useState('00:00:00')

  useEffect(() => {
    let isCancelled = false

    async function update() {
      if (!isCancelled) {
        const { epoch, epochTime } = epochformatted()
        setEpochTime(epochTime)
        setEpoch(epoch)
      }
    }
    update()
    const id = setInterval(update, 1000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [])

  return { epoch, epochTime, epochOnChain }
}
