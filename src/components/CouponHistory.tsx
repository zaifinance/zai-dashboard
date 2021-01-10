/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { rem } from 'polished'
import styled from '@emotion/styled'

import { ZAI, ZAIS } from '../constants/tokens'
import { useUser, useZaiData } from '../hooks'
import {
  getBatchBalanceOfCoupons,
  getBatchCouponsExpiration,
  getCouponEpochs,
} from '../utils/infura'
import { Button, Flex, Semi, Spacer, Text } from './Elements'
import { formatBN, toBaseUnitBN, toTokenUnitsBN } from '../utils/number'
import { redeemCoupons } from '../utils/web3'

const SmallButton = styled(Button)`
  font-size: ${rem(12)};
  padding: ${rem(4)} ${rem(12)};
  border-radius: ${rem(8)};
`

const Col = styled(Flex)<any>`
  ${(props) =>
    props.size
      ? css`
          flex: 0 0 auto;
          width: ${rem(props.size)};
        `
      : css`
          flex: 1;
        `}

  ${(props) =>
    props.right &&
    css`
      justify-content: flex-end;
    `}
`

const CouponRow = (props) => {
  const { epoch, coupons, balance, expiration, totalRedeemable } = props
  return (
    <Flex
      css={css`
        justify-content: space-between;
        align-items: center;
        padding: ${rem(12)} 0;
      `}
    >
      <Col size={56}>
        <Text size={14}>{props.epoch.toString()}</Text>
      </Col>

      <Col>
        <Text size={14}>
          {formatBN(toTokenUnitsBN(balance, ZAI.decimals), 2)}
          <span
            css={css`
              opacity: 0.5;
              font-size: ${rem(12)};
            `}
          >
            /{formatBN(toTokenUnitsBN(coupons, ZAI.decimals), 2)}
          </span>
        </Text>
      </Col>

      <Col size={60}>
        <Text size={14}>{expiration.toString()}</Text>
      </Col>

      <Col size={72} right>
        <SmallButton
          onClick={() =>
            redeemCoupons(
              ZAIS.addr,
              epoch,
              balance.isGreaterThan(toBaseUnitBN(totalRedeemable, ZAI.decimals))
                ? toBaseUnitBN(totalRedeemable, ZAI.decimals)
                : balance,
            )
          }
        >
          Redeem
        </SmallButton>
      </Col>
    </Flex>
  )
}

const CouponHistory = () => {
  const user = useUser()
  const [epochs, setEpochs] = useState([])
  const { redeemable } = useZaiData()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (user === '') {
      return
    }

    let isCancelled = false

    async function update() {
      const epochsFromEvents = await getCouponEpochs(ZAIS.addr, user)
      const epochNumbers = epochsFromEvents.map((e) => parseInt(e.epoch))
      const balanceOfCoupons = (await getBatchBalanceOfCoupons(
        ZAIS.addr,
        user,
        epochNumbers,
      )) as any
      const couponsExpirations = await getBatchCouponsExpiration(
        ZAIS.addr,
        epochNumbers,
      )

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.balance = new BigNumber(balanceOfCoupons[i])
        epoch.expiration = couponsExpirations[i]
        return epoch
      })

      if (!isCancelled) {
        // @ts-ignore
        setEpochs(couponEpochs)
        setInitialized(true)
      }
    }
    update()
    const id = setInterval(update, 15000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [user, redeemable])

  return epochs.length > 0 ? (
    <div>
      <Flex
        css={css`
          align-items: center;
          justify-content: space-between;
        `}
      >
        <Col size={56}>
          <Text>
            <Semi>Epoch</Semi>
          </Text>
        </Col>
        <Col>
          <Text>
            <Semi>Balance/Purchased</Semi>
          </Text>
        </Col>
        <Col size={60}>
          <Text>
            <Semi>Expires</Semi>
          </Text>
        </Col>
        <Col size={72}></Col>
      </Flex>
      <Spacer size={8} />
      <div
        css={css`
          max-height: ${rem(240)};
          overflow: scroll;
        `}
      >
        {initialized &&
          epochs.map((epoch) => {
            return <CouponRow {...epoch} />
          })}
      </div>
    </div>
  ) : (
    <Flex
      css={css`
        align-items: center;
        justify-content: center;
        flex-direction: column;
      `}
    >
      <Spacer />
      <Text>No coupons to display</Text>
    </Flex>
  )
}

export default CouponHistory
