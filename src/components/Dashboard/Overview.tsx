/** @jsx jsx */
import React from "react";
import styled from "@emotion/styled";
import { jsx, css, useTheme } from "@emotion/react";
import { rem, transparentize } from "polished";

import {
  Bold,
  Label as LabelBase,
  Spacer,
  Col,
  slickText,
} from "../../components/Elements";
import { Wrapper } from "../../components/Layout";

import { formatBN } from "../../utils/number";
import { useEpoch, usePrices, useTokenData } from "../../hooks";
import BigNumber from "bignumber.js";
import { LogoMark } from "../../components/Logo";
import { Themed, ThemeProps } from "../../components/Theme";
import { DaiSymbol } from "../../components/Icons";
import Figure from "../../components/Figure";

const Title = styled<Themed>(Bold)`
  color: ${(props) => transparentize(0.3, props.theme.textColor)};
  line-height: 1;
  font-size: ${rem(24)};

  @media only screen and (max-width: 520px) {
    color: ${(props) => transparentize(0.5, props.theme.textColor)};
  }
`;

const SupplyTitle = styled(Title)`
  font-size: ${rem(42)};

  display: flex;
  align-items: center;
  font-weight: 400;

  ${slickText};

  @media only screen and (max-width: 520px) {
    color: ${(props) => props.theme.colorPairs[0].start};
  }
`;

const Label = styled<Themed>(LabelBase)`
  margin-bottom: ${rem(4)};
  color: ${(props) => transparentize(0.7, props.theme.textColor)};
`;

const WhiteLabel = styled(Label)`
  color: rgba(255, 255, 255, 0.5);

  @media only screen and (max-width: 520px) {
    opacity: 0.3;
    color: ${(props) => props.theme.textColor};
  }
`;

const Block = styled(Col)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EpochTime = () => {
  const { epochTime } = useEpoch();
  return <span>{epochTime}</span>;
};

const DashboardOverview = () => {
  const theme = useTheme() as ThemeProps;
  const { spotPrice } = usePrices();

  const { totalTokens, totalNet } = useTokenData();

  function limit(delta, price) {
    const l = new BigNumber(0.03);
    return delta.gt(l) ? l : delta;
  }

  let expansion = new BigNumber(0);
  if (totalNet && spotPrice) {
    const delta = limit(spotPrice.minus(1), spotPrice);
    // console.log(delta.toString())
    expansion = delta.times(totalNet);
  }

  // marketCap = {totalTokens &&
  //   spotPrice &&
  //   formatBNCash(totalTokens.times(spotPrice))}

  return (
    <React.Fragment>
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
            ${transparentize(1, theme.baseColor)} 0%,
            ${transparentize(0.1, theme.baseColor)} 40%,
            ${transparentize(0.05, theme.baseColor)} 80%
          );
          z-index: 1;

          display: none;

          @media only screen and (max-width: 520px) {
            display: block;
          }
        `}
      />

      <Spacer />

      <Wrapper
        css={css`
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 1;

          --diamond-width: ${rem(216)};
          --center-width: ${rem(426)};

          @media only screen and (max-width: 1023px) {
            --diamond-width: ${rem(156)};
            --center-width: ${rem(274)};
          }

          @media only screen and (max-width: 520px) {
            --diamond-width: ${rem(110)};
            --center-width: ${rem(170)};
          }
        `}
      >
        <Block
          css={css`
            flex: 0 0 var(--diamond-width);
            width: var(--diamond-width);

            @media only screen and (max-width: 520px) {
              padding-top: ${rem(127)};
            }
          `}
        >
          <WhiteLabel>Spot Price</WhiteLabel>
          <Title
            css={css`
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            `}
          >
            <DaiSymbol
              fill="#fff"
              css={css`
                width: ${rem(20)};
                height: ${rem(20)};
              `}
            />
            {spotPrice && formatBN(spotPrice, 4)}
          </Title>
          <Spacer size={40} />
        </Block>

        {/* <Spacer col /> */}

        <Block
          css={css`
            flex: 0 0 var(--center-width);
            width: var(--center-width);

            text-align: center;
            color: #000;
          `}
        >
          <Spacer size={24} />

          <Label
            css={css`
              font-size: ${rem(14)};
            `}
          >
            Total Supply
          </Label>
          <SupplyTitle>
            <LogoMark
              fill="transparent"
              stroke={theme.colorPairs[0].start}
              css={css`
                width: ${rem(42)};
                height: ${rem(42)};

                margin-top: ${rem(4)};
              `}
            />
            <Figure num={totalTokens} unit="" round={0} />
            {/* <span>{totalTokens && formatBN(totalTokens, 0)}</span> */}
          </SupplyTitle>

          <Spacer size={20} />

          <Label>Status</Label>
          <Title
            css={css`
              text-transform: uppercase;
              font-weight: 500;
              font-size: ${rem(20)};
            `}
          >
            {expansion.gt(0) ? "Expansion" : "Debt"}
          </Title>
          <Spacer size={24} />
        </Block>

        {/* <Spacer col /> */}

        <Block
          css={css`
            flex: 0 0 auto;
            flex: 0 0 var(--diamond-width);

            @media only screen and (max-width: 520px) {
              padding-top: ${rem(127)};
            }
          `}
        >
          <WhiteLabel>Next Epoch</WhiteLabel>
          <Title
            css={css`
              font-weight: 400;
              color: #fff;
            `}
          >
            <EpochTime />
          </Title>
          <Spacer size={40} />
        </Block>
      </Wrapper>
    </React.Fragment>
  );
};

export default DashboardOverview;
