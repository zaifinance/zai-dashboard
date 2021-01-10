/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled'
import { rem } from 'polished'

import { Flex, Spacer } from './Elements'

const LogoMarkBase = ({ fill = '#000', stroke = '#fff', ...props }) => {
  return (
    <svg
      width="932"
      height="931"
      viewBox="0 0 932 932"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(.5)" fill="none" fillRule="evenodd">
        <circle fill={fill} cx="465.5" cy="465.5" r="465.5" />
        <g fill={stroke}>
          <path d="M496.497 185.563l35.355 35.355-310.42 310.42-35.355-35.355zM681.497 216.562l35.355 35.355-466.69 466.69-35.356-35.355z" />
          <path d="M464.613 217.382l31.82-31.82L604.62 293.75l-31.82 31.82zM186.613 496.382l31.82-31.82L326.62 572.75l-31.82 31.82zM697.5 475c0 122.055-98.945 221-221 221-57.099 0-109.14-21.654-148.36-57.198l32.036-32.035C390.54 631.897 429.506 647 472 647c96.926 0 175.5-78.574 175.5-175.5 0-42.494-15.102-81.46-40.233-111.824l33.035-33.036C675.846 365.86 697.5 417.901 697.5 475z" />
        </g>
      </g>
    </svg>
  )
}

interface LogoMarkProps {
  size?: number
  fill?: string
  stroke?: string
}

export const LogoMark = styled(LogoMarkBase)<LogoMarkProps>`
  width: ${(props) => rem(props.size)};
  height: ${(props) => rem(props.size)};
`

LogoMark.defaultProps = {
  size: 36,
}

const Wordmark = styled.span`
  font-size: ${rem(18)};
  font-weight: 500;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1;

  position: relative;
  top: ${rem(0)};
`

const Logo = () => {
  return (
    <Flex
      css={css`
        align-items: center;
      `}
    >
      <LogoMark fill="#fff" stroke="#000" />
      <Spacer col size={10} />
      <Wordmark
        css={css`
          color: #fff;

          @media only screen and (max-width: 520px) {
            display: none;
          }
        `}
      >
        Zero Collateral Dai
      </Wordmark>
    </Flex>
  )
}

export default Logo

export const FancyLogo = (props: LogoMarkProps) => (
  <LogoMark
    css={css`
      border-radius: ${rem(40)};
      box-shadow: 0px ${rem(4)} ${rem(8)} rgba(0, 0, 0, 0.07);
    `}
    size={80}
    {...props}
  />
)
