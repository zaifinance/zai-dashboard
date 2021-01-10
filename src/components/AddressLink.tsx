import React from 'react'
import styled from '@emotion/styled'
import { rem } from 'polished'

import EthIdenticon from './EthIdenticon'
import { etherscanLink, formatAddress } from '../utils/eth'
import { Spacer } from './Elements'

const A = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: ${rem(16)};
`

const AddressLink = ({ address }) => {
  return (
    <A href={etherscanLink('address', address)} target="_blank">
      <EthIdenticon address={address} />
      <Spacer col size={8} />
      {formatAddress(address)}
    </A>
  )
}

export default AddressLink
