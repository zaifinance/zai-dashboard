/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx, css, useTheme } from '@emotion/react'
import { rem, transparentize } from 'polished'

import {
  Text,
  TableBase,
  TableRowProps,
  Flex,
  Dotted,
  Row,
} from '../../components/Elements'

import { etherscanLink } from '../../utils/eth'
import { CopyIcon } from '../Icons'
import { Themed, ThemeProps } from '../Theme'
import { Wrapper } from '../Layout'

export const StatsWrapper = styled(Wrapper)`
  --header-size: ${rem(16)};
  --text-size: ${rem(14)};
`

export const Heading = styled(Text)`
  line-height: 1;
  font-size: var(--header-size);
  margin-bottom: ${rem(8)};
  opacity: 0.7;
`

export const SubHeading = styled(Heading)`
  font-size: var(--text-size);
`

export const Table = styled(TableBase)`
  max-width: 768px;
  margin: 0 auto;
`

const TableText = styled(Text)`
  font-size: var(--text-size);

  &:first-of-type {
  }
`

const DottedBoom = styled(Dotted)`
  background-image: linear-gradient(
    to right,
    ${(props) => transparentize(0.65, props.theme.textColor)} 20%,
    rgba(255, 255, 255, 0) 0%
  );
`

export const TableRow = ({
  left,
  right,
  LeftComponent = TableText,
  RightComponent = TableText,
  ...props
}: TableRowProps) => {
  return (
    <Row
      css={css`
        opacity: 0.47;
      `}
      {...props}
    >
      {typeof left === 'string' ? <LeftComponent>{left}</LeftComponent> : left}

      <DottedBoom />

      {typeof left === 'string' ? (
        <RightComponent>{right}</RightComponent>
      ) : (
        right
      )}
    </Row>
  )
}

export const SmallCopyIcon = styled(CopyIcon)<Themed>`
  width: ${rem(20)};
  height: ${rem(20)};
  padding: ${rem(2)} ${rem(4)};

  opacity: 0.5;

  cursor: pointer;
`

export const A = styled.a<Themed>`
  display: block;
  color: ${(props) => props.theme.textColorLight};
`

export const AddressLink = ({ address }) => {
  const theme = useTheme() as ThemeProps
  return (
    <Flex
      css={css`
        align-items: center;
      `}
    >
      <A
        href={etherscanLink('address', address)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address}
      </A>
      <SmallCopyIcon
        onClick={() => clipBoardCopy(address)}
        color={theme.textColor}
      />
    </Flex>
  )
}

function clipBoardCopy(value) {
  var tempInput = document.createElement('input')
  tempInput.value = value
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
}

export const Section = styled(Flex)`
  max-width: ${rem(768)};
  margin: 0 auto ${rem(40)};
`

export const ColumnHeading = styled(SubHeading)`
  font-size: var(--text-size);
  margin-bottom: ${rem(4)};
`

export const ColumnText = styled(Text)`
  font-size: var(--text-size);
  opacity: 0.5;
`

export const ColumnFigure = ({ heading, value, right = false }) => {
  return (
    <div
      css={css`
        margin-top: ${rem(12)};
        text-align: ${right ? 'right' : 'left'};
      `}
    >
      <ColumnHeading>{heading}</ColumnHeading>
      <ColumnText>{value}</ColumnText>
    </div>
  )
}
