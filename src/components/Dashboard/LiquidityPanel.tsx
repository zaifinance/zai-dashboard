/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { rem } from 'polished'

import {
  Form,
  Spacer,
  TableRow,
  Seperator,
  LinkButton,
  LabelHeading,
  Text,
} from '../../components/Elements'
import Panel, {
  PanelBody,
  PanelHeader,
  PanelHeading,
} from '../../components/Panel'

import { Themed } from '../../components/Theme'

import StatusBar from '../../components/StatusBar'

import { useHasWeb3, useUser, useUserPoolData } from '../../hooks'
import { LiquidityThemeProvider } from '../../components/Theme'
import { transparentize } from 'polished'
import Figure, { FigurePercent } from '../../components/Figure'
import { POOL_EXIT_LOCKUP_EPOCHS } from '../../constants/values'

const CoolPanel = styled(PanelBody)<Themed>`
  background-image: linear-gradient(
    to bottom,
    ${(props) => transparentize(0.97, props.theme.colorPairs[0].start)},
    ${(props) => transparentize(0.99, props.theme.colorPairs[0].end)}
  );
`

const LiquidityPanel = () => {
  const hasWeb3 = useHasWeb3()
  const user = useUser()
  const {
    uniBalance,
    status,
    staged,
    bonded,
    rewarded,
    claimable,
    fluidUntil,
    epochYield,
    cycleYield,
  } = useUserPoolData()
  return (
    <LiquidityThemeProvider>
      <Panel>
        <PanelHeader>
          <PanelHeading>Liquidity</PanelHeading>
          {user && (
            <StatusBar
              status={status}
              fluidUntil={fluidUntil}
              rate={POOL_EXIT_LOCKUP_EPOCHS}
            />
          )}
        </PanelHeader>
        {hasWeb3 ? (
          <CoolPanel>
            <LabelHeading>LP</LabelHeading>
            <TableRow
              left="Epoch Yield"
              right={<FigurePercent value={epochYield} />}
            />
            <TableRow
              left="Cycle APR"
              right={<FigurePercent value={cycleYield} />}
            />

            <Spacer />

            {/* uniBalance */}
            <TableRow
              left={
                <React.Fragment>
                  Wallet{' '}
                  <span
                    css={css`
                      font-size: ${rem(12)};
                    `}
                  >
                    (
                    <a
                      href="https://info.uniswap.org/pair/0x323e054a6dd8762011d60993f51e23e2096b221f"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Add Liquidity
                    </a>
                    )
                  </span>
                </React.Fragment>
              }
              right={<Figure num={uniBalance} unit="UNI-LP" />}
            />
            <TableRow
              left="Staged"
              right={<Figure num={staged} unit="UNI-LP" />}
            />
            <TableRow
              left="Bonded"
              right={<Figure num={bonded} unit="UNI-LP" />}
            />
            <Spacer />
            <Form>
              <LinkButton as={Link} to="/dashboard/liquidity">
                Manage LP
              </LinkButton>
            </Form>

            <Spacer />
            <Spacer />
            <Seperator />
            <Spacer />
            <Spacer />

            <LabelHeading>Rewards</LabelHeading>
            <TableRow left="Earned" right={<Figure num={rewarded} />} />
            <TableRow left="Claimable" right={<Figure num={claimable} />} />
            <Spacer />

            <Form>
              <LinkButton as={Link} to="/dashboard/rewards">
                Manage Rewards
              </LinkButton>
            </Form>
          </CoolPanel>
        ) : (
          <CoolPanel>
            <Text>No web3 detected</Text>
          </CoolPanel>
        )}
      </Panel>
    </LiquidityThemeProvider>
  )
}

export default LiquidityPanel
