/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { rem, transparentize } from 'polished'
import BigNumber from 'bignumber.js'

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

import { useHasWeb3, useUser, useUserData } from '../../hooks'
import { SupplyThemeProvider } from '../../components/Theme'
import Figure, { FigurePercent } from '../../components/Figure'

const CoolPanel = styled(PanelBody)<Themed>`
  background-image: linear-gradient(
    to bottom,
    ${(props) => transparentize(0.97, props.theme.colorPairs[0].start)},
    ${(props) => transparentize(0.99, props.theme.colorPairs[0].end)}
  );
`

const SupplyPanel = () => {
  const hasWeb3 = useHasWeb3()
  const user = useUser()
  const {
    balance,
    staged,
    bonded,
    status,
    fluidUntil,
    epochYield,
    cycleYield,
  } = useUserData()

  return (
    <SupplyThemeProvider>
      <Panel>
        <PanelHeader>
          <PanelHeading>Supply</PanelHeading>
          {user && <StatusBar status={status} fluidUntil={fluidUntil} />}
        </PanelHeader>

        {hasWeb3 ? (
          <CoolPanel>
            <LabelHeading>DAO</LabelHeading>
            <TableRow
              left="Epoch Yield"
              right={<FigurePercent value={epochYield} />}
            />
            <TableRow
              left="Cycle APY"
              right={<FigurePercent value={cycleYield} />}
            />

            <Spacer />

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
                      Trade Zai
                    </a>
                    )
                  </span>
                </React.Fragment>
              }
              right={<Figure num={balance} round={2} />}
            />
            <TableRow left="Staged" right={<Figure num={staged} round={2} />} />
            <TableRow left="Bonded" right={<Figure num={bonded} round={2} />} />
            <Spacer />
            <Form>
              <LinkButton as={Link} to="/dashboard/dao">
                Manage DAO
              </LinkButton>
            </Form>

            <Spacer />
            <Spacer />
            <Seperator />
            <Spacer />
            <Spacer />

            <LabelHeading>Coupons</LabelHeading>

            <TableRow
              left="Purchased"
              right={<Figure num={new BigNumber(0)} round={2} />}
            />
            <TableRow
              left="Redeemable"
              right={<Figure num={new BigNumber(0)} round={2} />}
            />
            <Spacer />
            <Form>
              <LinkButton as={Link} to="/dashboard/coupons">
                Manage Coupons
              </LinkButton>
            </Form>
          </CoolPanel>
        ) : (
          <CoolPanel>
            <Text>No web3 detected</Text>
          </CoolPanel>
        )}
      </Panel>
    </SupplyThemeProvider>
  )
}

export default SupplyPanel
