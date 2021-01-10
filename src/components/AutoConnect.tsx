import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import connectors from '../utils/connectors'

const AUTO_CONNECT = false

const AutoConnect = () => {
  const w3ctx = useWeb3React()
  const { active, activate } = w3ctx

  const connectWeb3 = async (connectorName = 'metamask') => {
    await activate(connectors[connectorName]())
  }

  useEffect(() => {
    if (!AUTO_CONNECT || active) {
      return
    }
    connectWeb3('metamask')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default AutoConnect
