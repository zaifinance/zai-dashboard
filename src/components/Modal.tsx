/** @jsx jsx */
import { jsx, css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { rem, transparentize } from 'polished'
import { DotLoader } from 'react-spinners'

import { A, Flex, Spacer, Text } from './Elements'
import { CloseX } from './Icons'
import { coolStuff, Themed, ThemeProps } from './Theme'
import { LogoMark } from './Logo'

import { etherscanLink } from '../utils/eth'

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 3;
`

export const ModalHeader = styled.header`
  position: relative;
  z-index: 1;
  padding: ${rem(18)} ${rem(20)};

  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`

export const ModalHeading = styled(Text)`
  font-size: ${rem(16)};
  font-weight: 500;
`

const ColorRush = styled.div`
  ${coolStuff}

  & > * {
    position: relative;
    z-index: 1;
  }
`

export const ModalColorRush = ({ children, ...props }) => {
  const theme = useTheme() as ThemeProps
  return (
    <ColorRush {...props}>
      <div
        css={css`
          position: absolute !important;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            ${transparentize(0.5, theme.baseColor)},
            ${transparentize(0.02, theme.baseColor)} 40%,
            ${transparentize(0.01, theme.baseColor)} 100%
          );
          z-index: 1;
        `}
      />
      {children}
    </ColorRush>
  )
}

export const ModalContentWrap = styled.div<Themed>`
  position: relative;
  padding: ${rem(24)} ${rem(28)};
  z-index: 1;
`

export const ModalCenterTout = styled(Flex)`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  min-height: ${rem(160)};

  text-align: center;

  padding: ${rem(12)} ${rem(48)} ${rem(0)};

  z-index: 1;
  position: relative;
`

const CloseButton = styled(CloseX)`
  position: absolute;
  z-index: 2;
  right: ${rem(10)};
  top: ${rem(10)};

  padding: ${rem(10)};

  width: ${rem(32)};
  height: ${rem(32)};

  opacity: 0.2;
  transition: opacity 0.1s ease-in-out;

  cursor: pointer;

  &:hover {
    opacity: 0.4;
  }
`

export const ModalBox = styled.div<Themed>`
  position: relative;
  z-index: 3;

  width: 100%;
  max-width: ${rem(420)};
  max-height: 96vh;

  background: ${(props) => props.theme.backgroundColor};

  overflow: scroll;

  border-radius: ${rem(4)} ${rem(4)} ${rem(12)} ${rem(12)};
  box-shadow: 0 ${rem(8)} ${rem(24)} rgba(255, 255, 255, 0.05);
`

const ModalBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 0;

  cursor: pointer;
`

const Modal = ({ children }) => {
  const history = useHistory()
  const onClickOut = () => {
    history.push('/')
  }
  return (
    <ModalContainer>
      <ModalBackground onClick={onClickOut} />

      <ModalBox>
        <CloseButton onClick={onClickOut} />
        {children}
      </ModalBox>
    </ModalContainer>
  )
}

export default Modal

export const ModalTransaction = ({
  text = 'Confirming Transaction',
  txHash,
}) => {
  const theme = useTheme()

  return (
    <ModalCenterTout>
      <DotLoader size={80} color={(theme as ThemeProps).colorPairs[0].start} />
      <Spacer />
      <Text size={16} color="light">
        {text}
      </Text>
      <Spacer size={4} />
      <A
        size={12}
        color="lightest"
        target="_blank"
        href={etherscanLink('tx', txHash)}
      >
        View transaction on Etherscan
      </A>
    </ModalCenterTout>
  )
}

export const EnableTout = ({ copy }) => {
  return (
    <ModalCenterTout>
      <LogoMark size={80} />
      <Spacer />
      <Text size={16} color="light">
        {copy}
      </Text>
    </ModalCenterTout>
  )
}
