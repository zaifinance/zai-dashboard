/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import BigNumber from 'bignumber.js'

import { Text, Cell, Spacer, TwoCol } from '../../components/Elements'
import Figure, { FigurePercent } from '../Figure'
import {
  Section,
  Heading,
  SubHeading,
  ColumnFigure,
  TableRow,
  AddressLink,
  StatsWrapper,
} from './components'

import {
  useEpoch,
  usePrices,
  useTokenData,
  useUserData,
  useUserPoolData,
} from '../../hooks'
import { POOL, UNI, ZAI, ZAIS } from '../../constants/tokens'
import { formatBN } from '../../utils/number'

const Stats = () => {
  const { twapPrice, spotPrice } = usePrices()
  const { epochTime } = useEpoch()
  const { balance, bonded, staged, epochYield, cycleYield } = useUserData()
  const {
    uniBalance,
    bonded: poolBonded,
    staged: poolStaged,
    rewarded,
    claimable,
    epochYield: poolEpochYield,
    cycleYield: poolCycleYield,
  } = useUserPoolData()
  const {
    epoch,
    totalTokens,
    totalNet,
    coupons,
    totalDebt,

    totalBonded,
    totalStaged,
    poolTotalSupply,
    poolTotalBonded,
    poolTotalStaged,
    // poolTotalRewarded,
    // poolTotalClaimable,
    // pairBalanceDai,
    pairBalanceZai,
  } = useTokenData()

  const poolUserTotal =
    uniBalance?.plus(poolBonded)?.plus(poolStaged) ?? new BigNumber(0)

  let percentOfPool = new BigNumber(0)
  let bondedPercentOfPool = new BigNumber(0)
  let stagedPercentOfPool = new BigNumber(0)
  if (!poolTotalSupply.isZero()) {
    percentOfPool = poolUserTotal?.div(poolTotalSupply)
    bondedPercentOfPool = poolTotalBonded?.div(poolTotalSupply)
    stagedPercentOfPool = poolTotalStaged?.div(poolTotalSupply)
  }

  const userLPZai = percentOfPool?.times(pairBalanceZai)
  const poolBondedZai = bondedPercentOfPool.times(pairBalanceZai)
  const poolStagedZai = stagedPercentOfPool.times(pairBalanceZai)

  const supplyText =
    twapPrice.gt(1)
      ? 'total supply will expand by'
      : 'protocol debt will increase by'

  return (
    <StatsWrapper>
      <Section column>
        <Heading>Network</Heading>
        <Text
          css={css`
            font-size: var(--text-size);
            opacity: 0.5;
          `}
        >
          Next epoch, {supplyText} <Figure num={totalTokens.times(0.01)} />.
        </Text>
        <Spacer />
        <TwoCol
          css={css`
            justify-content: space-between;
          `}
        >
          <Cell
            css={css`
              flex-direction: row;
              justify-content: space-between;
            `}
          >
            <ColumnFigure heading="Next Epoch" value={epochTime} />
            <ColumnFigure
              heading="Spot Price"
              value={<Figure num={spotPrice} unit="DAI" />}
            />

            <ColumnFigure
              right
              heading="TWAP Price"
              value={<Figure num={twapPrice} unit="DAI" />}
            />
            <ColumnFigure right heading="Epoch" value={epoch} />
          </Cell>
        </TwoCol>

        <Spacer />
        <Spacer />

        <TwoCol
          css={css`
            justify-content: space-between;
          `}
        >
          <Cell>
            <SubHeading>Token Supply</SubHeading>
            <TableRow left="Tokens:" right={<Figure num={totalTokens} />} />
            <TableRow left="Coupons:" right={<Figure num={coupons} />} />
            <TableRow left="Total Supply:" right={<Figure num={totalNet} />} />
            <TableRow left="Debt:" right={<Figure num={totalDebt} />} />
          </Cell>
          <Cell>
            <SubHeading>Token Distribution</SubHeading>
            <TableRow left="DAO Staged:" right={<Figure num={totalStaged} />} />
            <TableRow left="DAO Bonded:" right={<Figure num={totalBonded} />} />
            <TableRow
              left="LP Staged:"
              right={
                <Figure
                  num={poolTotalStaged}
                  unit="UNI-LP"
                  tooltip={`${formatBN(poolStagedZai, 2)} ZAI`}
                />
              }
            />
            <TableRow
              left="LP Bonded:"
              right={
                <Figure
                  num={poolTotalBonded}
                  unit="UNI-LP"
                  tooltip={`${formatBN(poolBondedZai, 2)} ZAI`}
                />
              }
            />
            {/* <TableRow
              left="LP Rewarded:"
              right={<Figure num={poolTotalRewarded} unit="ZAI" />}
            />
            <TableRow
              left="LP Claimable:"
              right={<Figure num={poolTotalClaimable} unit="ZAI" />}
            /> */}
            {/* <TableRow
              left="LP Total:"
              right={<Figure num={poolTotalSupply} unit="UNI-LP" />}
            />

            <TableRow
              left="LP Claimable:"
              right={<Figure num={poolTotalClaimable} unit="ZAI" />}
            />
            <TableRow
              left="ZAI in LP:"
              right={<Figure num={pairBalanceZai} unit="ZAI" />}
            />
            <TableRow
              left="Dai in LP:"
              right={<Figure num={pairBalanceDai} unit="DAI" />}
            /> */}

            {/* <TableRow
              left="Total DAO:"
              right={
                <FigurePercent
                  value={totalStaged
                    ?.plus(totalBonded)
                    ?.div(totalTokens)
                    ?.times(100)}
                />
              }
            />
            <TableRow
              left="Total LP:"
              right={
                <FigurePercent
                  value={poolTotalBonded?.div(totalTokens)?.times(100)}
                />
              }
            /> */}
          </Cell>
        </TwoCol>

        <Spacer />

        <TwoCol>
          <Cell>
            <SubHeading>DAO Returns</SubHeading>
            <TableRow
              left="DAO Epoch Yield:"
              right={<FigurePercent value={epochYield} />}
            />
            <TableRow
              left="DAO Cycle Yield:"
              right={<FigurePercent value={cycleYield} />}
            />
            <TableRow
              left="DAO Annual Yield:"
              right={<FigurePercent value={cycleYield.times(365)} />}
            />
          </Cell>
          <Cell>
            <SubHeading>LP Returns</SubHeading>
            <TableRow
              left="LP Epoch Yield:"
              right={<FigurePercent value={poolEpochYield} />}
            />
            <TableRow
              left="LP Cycle Yield:"
              right={<FigurePercent value={poolCycleYield} />}
            />
            <TableRow
              left="LP Annual Yield:"
              right={<FigurePercent value={poolCycleYield.times(365)} />}
            />
          </Cell>
        </TwoCol>
      </Section>

      <Section column>
        <Heading>Account</Heading>
        <Spacer />
        <TwoCol
          css={css`
            justify-content: space-between;
          `}
        >
          <Cell>
            <SubHeading>ZAI</SubHeading>

            <TableRow left="Wallet:" right={<Figure num={balance} />} />
            <TableRow left="Staged:" right={<Figure num={staged} />} />
            <TableRow left="Bonded:" right={<Figure num={bonded} />} />
            <TableRow left="LP Pool:" right={<Figure num={userLPZai} />} />
            <TableRow left="LP Claimable:" right={<Figure num={claimable} />} />
            <TableRow left="LP Rewarded:" right={<Figure num={rewarded} />} />
            <TableRow
              left="Total:"
              right={
                <Figure
                  num={balance
                    ?.plus(staged)
                    ?.plus(bonded)
                    ?.plus(userLPZai)
                    ?.plus(claimable)
                    ?.plus(rewarded)}
                />
              }
            />
          </Cell>
          <Cell>
            <SubHeading>ZAI-DAI LP</SubHeading>

            <TableRow
              left="Wallet:"
              right={<Figure num={uniBalance} unit="UNI-LP" />}
            />
            <TableRow
              left="Staged:"
              right={<Figure num={poolStaged} unit="UNI-LP" />}
            />
            <TableRow
              left="Bonded:"
              right={<Figure num={poolBonded} unit="UNI-LP" />}
            />
            <TableRow
              left="Total:"
              right={
                <Figure
                  num={uniBalance?.plus(poolStaged)?.plus(poolBonded)}
                  unit="UNI-LP"
                />
              }
            />
          </Cell>
        </TwoCol>
      </Section>

      <Spacer size={40} />

      <Section column>
        <Heading>Contract Addresses</Heading>
        <TwoCol>
          <Cell>
            <ColumnFigure
              heading="Zai Token"
              value={<AddressLink address={ZAI.addr} />}
            />
            <ColumnFigure
              heading="DAO"
              value={<AddressLink address={ZAIS.addr} />}
            />
            <ColumnFigure
              heading="LP Bonding"
              value={<AddressLink address={POOL.addr} />}
            />
            <ColumnFigure
              heading="Uniswap LP"
              value={<AddressLink address={UNI.addr} />}
            />
          </Cell>
        </TwoCol>
      </Section>
    </StatsWrapper>
  )
}

export default Stats
