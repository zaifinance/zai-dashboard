/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { invert, rem, transparentize } from 'polished'
import { Themed } from '../Theme'
import { mq } from '../../styles'

interface TextProps {
  size?: number
  color?: string
}

const getColor = ({ color, theme }: Themed<TextProps>) => {
  if (color === 'light') {
    return theme.textColorLight
  } else if (color === 'lightest') {
    return theme.textColorLightest
  }
  return color
}

export const Text = styled.div<Themed<TextProps>>`
  line-height: 1.5;
  font-size: ${(props) => rem(props.size)};
  font-weight: 400;
  color: ${(props) => props.theme.textColor};

  ${(props) =>
    props.color &&
    css`
      color: ${getColor(props)};
    `};
`

Text.defaultProps = {
  size: 12,
}

export const Heading = styled.div`
  display: flex;
  align-items: center;

  height: 4.625rem;
`

export const P = styled(Text)`
  font-size: ${rem(16)};
  margin-bottom: ${rem(8)};
`.withComponent('p')

export const H1 = styled(Text)`
  font-size: 4rem;
  margin-bottom: 1.75rem;
`.withComponent('h1')

export const H2 = styled(Text)`
  font-size: ${rem(32)};
`.withComponent('h2')

export const H3 = styled(Text)`
  font-size: ${rem(20)};
  letter-spacing: 0;
  font-weight: 500;
`.withComponent('h3')

export const H4 = styled(Text)`
  font-size: ${rem(16)};
  font-weight: 500;
`.withComponent('h4')

export const H5 = styled(Text)`
  font-size: ${rem(16)};
  font-weight: 400;
`.withComponent('h5')

export const Label = styled(Text)`
  font-size: ${rem(12)};
  font-weight: 500;
  margin-bottom: 0.125rem;
`.withComponent('h4')

export const LabelHeading = styled(Text)<Themed>`
  color: ${(props) => props.theme.textColorLightest};
  font-weight: 700;
  font-size: ${rem(12.5)};
  letter-spacing: 0;
`

export const slickText = (props) => css`
  color: ${props.theme.colorPairs[0].start};

  @supports (-webkit-background-clip: text) and
    (-webkit-text-fill-color: transparent) {
    background-image: linear-gradient(
      to right,
      ${props.theme.colorPairs[0].start} 0%,
      ${props.theme.colorPairs[1].start} 100%
    );
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @supports (-moz-background-clip: text) and (-moz-text-fill-color: transparent) {
    background-image: linear-gradient(
      to right,
      ${props.theme.colorPairs[0].start} 0%,
      ${props.theme.colorPairs[1].start} 100%
    );
    background-size: 100%;
    background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
  }
`

export const Semi = styled.span`
  font-weight: 500;
`

export const Bold = styled.span`
  font-weight: 500;
`

export const Slick = styled.span`
  ${slickText}
`

export const A = styled(Text)``.withComponent('a')

interface FlexProps {
  column?: boolean
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  ${(props) =>
    props.column &&
    css`
      flex-direction: column;
    `}
`

export const Input = styled.input<any>`
  position: relative;

  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  display: block;
  width: 100%;
  appearance: none;
  outline: none;
  border: 0;
  background: inherit;

  /* padding: ${rem(16)};

  border-radius: ${rem(12)};
  border-style: solid;
  border-width: ${rem(1)}; */

  border-color: #d8e0e3;
  /* background-color: #fff; */
  color: #708390;

  font-weight: 400;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;

  font-size: ${rem(20)};
  line-height: 1.35;

  transition: all 150ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s;

  &:focus {
    border-color: var(--theme-ui-colors-primary, #25273d);
    color: var(--theme-ui-colors-primary, #25273d);
  }

  ${(props) =>
    props.unit &&
    css`
      &::after {
      }
    `}
`

export const bigButtonBase = (props) => css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0px;
  min-width: 0px;
  appearance: none;
  outline: none;
  border: 0;

  text-align: center;
  text-decoration: none;
  color: white;
  border-radius: ${rem(18)};
  cursor: pointer;
  padding: ${rem(12)} ${rem(32)};

  font-weight: 500;
  line-height: 1.5;
  font-size: ${rem(18)};

  background: radial-gradient(
    100% 100% at 50% 50%,
    ${props.theme.colorPairs[0].start} 69%,
    ${transparentize(0.56, props.theme.colorPairs[0].end)} 100%
  );
  box-shadow: 0px ${rem(1)} ${rem(8)}
    ${transparentize(0.9, invert(props.theme.baseColor))};

  opacity: 1;

  &:disabled {
    cursor: not-allowed;

    /* transition: background 150ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; */

    ${props.invalid
      ? css`
          opacity: 0.6;
          /* background: radial-gradient(
        100% 100% at 50% 50%,
        ${transparentize(0.5, props.theme.colorPairs[0].start)} 60%,
        ${transparentize(0.5, props.theme.colorPairs[0].end)} 100%
      ); */
        `
      : css`
          background: rgba(37, 39, 61, 0.3);
        `}
  }
`

export const Button = styled.button<Themed<any>>`
  ${bigButtonBase};

  height: ${rem(52)};

  padding: ${rem(8)} ${rem(24)};
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  border: ${rem(1)} solid
    ${(props) => transparentize(0.8, invert(props.theme.baseColor))};
  box-shadow: 0px ${rem(1)} ${rem(4)}
    ${(props) => transparentize(0.96, invert(props.theme.baseColor))};

  &:disabled {
    background: #fff;
    opacity: 0.6;
    color: rgba(0, 0, 0, 0.6);

    cursor: not-allowed;

    /* transition: background 150ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s; */
  }
`

export const BigButton = styled.button<any>`
  ${bigButtonBase}
`

type LinkProps = typeof Link

export const LinkButton = styled<LinkProps>(Link)`
  ${bigButtonBase}
`

// export const Box = styled.div`
//   padding: 1.5rem;
//   background: radial-gradient(
//     100% 100% at 50% 50%,
//     rgba(255, 255, 255, 1) 50%,
//     rgba(203, 214, 107, 0.01) 100%
//   );
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   border-radius: 0.675rem;
// `
export const Box = styled.div<Themed<any>>`
  padding: 1.5rem;
  background: radial-gradient(
    100% 100% at 50% 50%,
    ${(props) => transparentize(0, props.theme.baseColor)} 50%,
    rgba(203, 214, 107, 0.01) 100%
  );
  border: 1px solid
    ${(props) => transparentize(0.9, invert(props.theme.baseColor))};
  border-radius: 0.675rem;
`

export const Form = styled.form`
  display: grid;
  gap: 1rem;
  width: 100%;
`

export const Seperator = styled.div<Themed<{ width?: number }>>`
  width: ${(props) => props.width}%;
  border-radius: ${rem(2)};
  height: ${rem(1)};
  background: radial-gradient(
    100% 100% at 50% 50%,
    ${(props) => transparentize(0.9, props.theme.textColor)},
    ${(props) => transparentize(1, props.theme.textColor)}
  );
  margin: 0 auto;
`

Seperator.defaultProps = {
  width: 40,
}

export const TwoCol = styled(Flex)`
  ${mq.mobile} {
    flex-wrap: wrap;
  }
`

export const Wrap = styled.div<Themed>`
  margin-right: ${({ theme }) => rem(theme.padUnit)};
  margin-left: ${({ theme }) => rem(theme.padUnit)};
`

export const Col = styled.div<Themed>`
  flex: 1 1 auto;
  width: 50%;

  display: flex;
  flex-direction: column;

  /* padding-right: ${({ theme }) => theme.padUnit};
padding-left: ${({ theme }) => theme.padUnit}; */

  &:first-of-type {
    /* margin-right: 2rem; */
    /* border-right: 1px solid rgba(0, 0, 0, 0.01); */
  }

  @media only screen and (max-width: 520px) {
    width: 100%;
    margin-bottom: ${rem(32)};
  }
`

interface SpacerProps {
  col?: boolean
  size?: number
}

export const Spacer = styled.div<SpacerProps>`
  flex: 0 0 auto;
  ${(props) =>
    props.col
      ? css`
          width: ${rem(props.size)};
        `
      : css`
          height: ${rem(props.size)};
        `}
`

Spacer.defaultProps = {
  col: false,
  size: 20,
}

export const Row = styled(Flex)`
  margin-top: ${rem(4)};
  margin-bottom: ${rem(1.5)};

  display: flex;
  justify-content: space-between;
`

const TableRowText = styled(Text)`
  font-size: ${rem(16.5)};
`

const TableRowTextLight = styled(TableRowText)<Themed>`
  color: ${(props) => props.theme.textColorLight};
`

export interface TableRowProps {
  left: any
  right: any
  LeftComponent?: React.ComponentType
  RightComponent?: React.ComponentType
}

export const Dotted = styled.div<Themed>`
  flex: 1;
  background-image: linear-gradient(
    to right,
    ${(props) => transparentize(0.85, props.theme.textColor)} 20%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: ${rem(8)} ${rem(1)};
  background-repeat: repeat-x;

  margin-left: ${rem(4)};
  margin-right: ${rem(4)};

  position: relative;
  top: -${rem(4)};
`

export const TableRow = ({ left = '', right = '' }: TableRowProps) => {
  return (
    <Row>
      <TableRowTextLight>{left}</TableRowTextLight>
      <Dotted />
      <TableRowText>{right}</TableRowText>
    </Row>
  )
}

export const TableBase = styled(Flex)`
  justify-content: space-between;
  width: 100%;

  @media only screen and (max-width: 520px) {
    flex-wrap: wrap;
  }
`

export const Cell = styled.div`
  flex: 1 0 50%;

  display: flex;
  flex-direction: column;

  padding-left: ${rem(30)};
  padding-right: ${rem(30)};

  &:first-of-type {
    padding-left: 0;
  }
  &:last-of-type {
    padding-right: 0;
  }

  @media only screen and (max-width: 520px) {
    flex: 1 1 auto;
    width: 100%;

    padding-left: ${rem(0)};
    padding-right: ${rem(0)};

    margin-bottom: ${rem(16)};
  }
`
