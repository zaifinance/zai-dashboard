/** @jsx jsx */
import { useHistory, useLocation } from 'react-router-dom'
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { useWeb3React } from '@web3-react/core'
import { invert, rem, transparentize } from 'polished'

import { H3, H5, Flex, Spacer, Seperator } from './Elements'
import { FancyLogo } from './Logo'
import { Themed } from './Theme'
import Modal, {
  ModalColorRush,
  ModalContentWrap,
  ModalCenterTout,
} from './Modal'

import { MetaMask, Arrow } from './Icons'

import connectors from '../utils/connectors'

const ConnectItem = styled(Flex)<Themed>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: ${rem(80)};

  padding: ${rem(22)} ${rem(28)};
  border-radius: ${rem(12)};

  cursor: pointer;
  transition: box-shadow 0.1s ease-in-out;

  &:hover {
    box-shadow: 0px 0px ${rem(24)}
      ${(props) => transparentize(0.92, invert(props.theme.baseColor))};
  }
`.withComponent('a')

const StyledArrow = styled(Arrow)`
  width: ${rem(24)};
  height: ${rem(24)};

  opacity: 0.5;
`

const ConnectModal = () => {
  const history = useHistory()
  const { state } = useLocation<{ from?: string }>()
  const { activate } = useWeb3React()

  const connectWeb3 = async (connectorName = 'metamask') => {
    const connectorConstructor = connectors[connectorName]

    await activate(connectorConstructor())

    history.push(state?.from ? state.from : '/')
  }

  return (
    <Modal>
      <ModalColorRush>
        <ModalContentWrap>
          <ModalCenterTout>
            <Spacer size={36} />
            <FancyLogo fill="#fff" stroke="#000" />
            <Spacer />
            <H3>Connect Wallet</H3>
            <H5>To start using Zai Finance</H5>
            <Spacer />
          </ModalCenterTout>
        </ModalContentWrap>
      </ModalColorRush>

      <ModalContentWrap>
        <Seperator />
        <ConnectItem onClick={() => connectWeb3('metamask')}>
          <Flex
            css={css`
              align-items: center;
            `}
          >
            <MetaMask
              css={css`
                width: ${rem(30)};
              `}
            />
            <Spacer col />
            <H5>Metamask</H5>
          </Flex>
          <StyledArrow />
        </ConnectItem>
        <Seperator />
        {/* <ConnectItem onClick={connectWeb3}>
          <Flex
            css={css`
              align-items: center;
            `}
          >
            <WalletConnect
              css={css`
                width: ${rem(30)};
              `}
            />
            <Spacer col />
            <H5>Wallet Connect</H5>
          </Flex>
          <StyledArrow />
        </ConnectItem> */}
      </ModalContentWrap>
    </Modal>
  )
}

export default ConnectModal
