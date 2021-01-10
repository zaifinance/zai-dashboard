import React from 'react'
import styled from '@emotion/styled'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { rem } from 'polished'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/
export function isAddress(address) {
  return ADDRESS_REGEX.test(address)
}

const EthIdenticon = (props) => {
  const { address, size, ...rest } = props
  return isAddress(address) ? (
    <Main size={size} {...rest}>
      <Jazzicon diameter={24} seed={jsNumberForAddress(address)} />
    </Main>
  ) : null
}

EthIdenticon.defaultProps = {
  size: 24,
}

interface StyleProps {
  size?: number
}

const Main = styled.div<StyleProps>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 100%;
  overflow: hidden;
  border: ${rem(0.5)} solid rgba(255, 255, 255, 0.8);
`

export default EthIdenticon
