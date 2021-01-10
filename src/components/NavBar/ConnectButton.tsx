/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { rem } from 'polished'
import { Link } from 'react-router-dom'

import EthIdenticon from '../EthIdenticon'
import { useHasWeb3, useUser } from '../../hooks'

interface ButtonProps {
  disabled?: boolean
}

const ConnectButtonContainer = styled.button<ButtonProps>`
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-around;

  margin: 0px;
  text-align: center;
  text-decoration: none;
  border-radius: 2rem;
  cursor: pointer;
  outline: none;
  padding: ${rem(4)} ${rem(12)};
  margin-right: -${rem(8)};

  color: #fff;

  line-height: 2;
  font-size: 1rem;

  font-weight: 400;
  min-width: 9.375rem;
  z-index: 1;
`.withComponent(Link)

const ConnectButton = () => {
  const account = useUser()
  const hasWeb3 = useHasWeb3()

  return account ? (
    <ConnectButtonContainer to="/connect">
      {`${account.substr(0, 6)}...${account.substr(account.length - 4)}`}
      <EthIdenticon
        css={css`
          margin-left: ${rem(12)};
        `}
        address={account}
      />
    </ConnectButtonContainer>
  ) : (
    <ConnectButtonContainer to="/connect" disabled={!hasWeb3}>
      Connect Wallet
    </ConnectButtonContainer>
  )
}

export default ConnectButton
