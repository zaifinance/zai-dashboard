import styled from '@emotion/styled'
import { rem } from 'polished'
import { Themed, coolStuff } from './Theme'

export const SiteWrapper = styled.div<Themed>`
  display: flex;

  align-items: stretch;
  width: 100%;
  min-height: 100vh;
  /* border-right: 1px solid #000; */
  background: linear-gradient(
      115deg,
      hsla(208, 78%, 55%, 0.02),
      hsla(330, 77%, 68%, 0.01)
    ),
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      ${(props) => props.theme.backgroundColorLight}
    );
`

export const Main = styled.div<Themed>`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  flex-direction: column;

  height: 100%;
`

export const Wrapper = styled.div<Themed>`
  width: 100%;
  max-width: ${rem(960)};
  margin: 0 auto;

  padding-left: ${(props) => rem(1.5 * props.theme.padUnit)};
  padding-right: ${(props) => rem(1.5 * props.theme.padUnit)};
`

export const Top = styled.div<Themed>`
  --diamond-width: ${rem(200)};
  --center-width: ${rem(380)};

  @media only screen and (max-width: 1023px) {
    --diamond-width: ${rem(140)};
    --center-width: ${rem(240)};
  }

  @media only screen and (max-width: 520px) {
    --diamond-width: ${rem(70)};
    --center-width: ${rem(0)};
  }

  position: relative;

  width: 100%;
  padding-bottom: ${rem(12 + 65)};

  background: radial-gradient(
    100% 100% at 50% 50%,
    ${(props) => props.theme.baseColor} 0%,
    rgba(144, 62, 155, 0.1) 100%
  );
  ${coolStuff};
`
