/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx, css, useTheme } from '@emotion/react'
import { desaturate, rem, transparentize } from 'polished'

import { Flex, Text } from './Elements'
import { IconLocked, IconUnlocked } from './Icons'

import { useEpoch } from '../hooks'
import { DAO_EXIT_LOCKUP_EPOCHS } from '../constants/values'
import { Themed, ThemeProps } from './Theme'

const BarContainer = styled.div<Themed>`
  width: 100%;
  position: relative;
  border: ${rem(2)} solid
    ${(props) =>
      transparentize(0.8, desaturate(0.3, props.theme.colorPairs[0].start))};
  border-right: none;
  border-radius: ${rem(6)};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  height: ${rem(6)};
  height: ${rem(16)};

  max-width: 55%;

  overflow: hidden;

  display: flex;

  display: flex;
  justify-content: center;
  align-items: center;
`

const BarPart = styled.div<Themed>`
  position: absolute;
  left: 0;
  top: 0;

  width: 100%;

  background: ${(props) =>
    transparentize(0.8, desaturate(0.2, props.theme.colorPairs[0].start))};
  height: 100%;
`

const BarText = styled(Text)`
  z-index: 1;

  font-size: ${rem(8)};

  color: ${(props) => props.theme.colorPairs[0].start};
`

interface BalanceBarProps {
  filled?: number
  text?: string
}

const BalanceBar = ({ filled = 0, text }: BalanceBarProps) => {
  return (
    <BarContainer>
      {filled > 0 && (
        <BarPart
          css={css`
            width: ${filled * 100}%;
          `}
        />
      )}
      {false && <BarText>{text}</BarText>}
    </BarContainer>
  )
}

const Circle = styled.div<Themed>`
  display: flex;
  justify-content: center;
  align-items: center;

  border: ${rem(2)} solid
    ${(props) =>
      transparentize(0.8, desaturate(0.3, props.theme.colorPairs[0].start))};
  background: transparent;
  border-radius: 100%;
  width: ${rem(32)};
  height: ${rem(32)};

  margin-left: -${rem(2)};
`

const formatCycles = (remaining) => {
  const cycles = Math.floor(remaining / 48)
  return cycles === 0 ? '' : `${cycles} cycle${cycles === 1 ? '' : 's'} + `
}
const formatEpochs = (remaining) => {
  const epochs = remaining % 48
  return `${epochs} epoch${epochs === 1 ? '' : 's'}`
}

const StatusBar = ({ status, fluidUntil, rate = DAO_EXIT_LOCKUP_EPOCHS }) => {
  const theme = useTheme() as ThemeProps
  const { epoch } = useEpoch()
  const remaining = fluidUntil - epoch > 0 ? fluidUntil - epoch : 0
  const barText = `Locked for ${formatCycles(remaining)}${formatEpochs(
    remaining,
  )}`
  return (
    <Flex
      css={css`
        flex: 1;
        justify-content: flex-end;
        align-items: center;
      `}
    >
      {remaining > 0 && <BalanceBar filled={remaining / rate} text={barText} />}
      <Circle>
        {status === 0 ? (
          <IconUnlocked
            css={css`
              width: ${rem(18)};
              height: ${rem(18)};

              stroke: ${theme.colorPairs[0].start};
            `}
          />
        ) : (
          <IconLocked
            css={css`
              width: ${rem(18)};
              height: ${rem(18)};

              stroke: ${theme.colorPairs[0].start};
            `}
          />
        )}
      </Circle>
    </Flex>
  )
}

export default StatusBar
