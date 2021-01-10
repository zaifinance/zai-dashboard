/** @jsx jsx */
import React, { useEffect, useState } from 'react'
import { jsx, css } from '@emotion/react'
import BigNumber from 'bignumber.js'
import { useRecoilValue } from 'recoil'

import { Spacer, BigButton, TableRow, Text, Seperator } from './Elements'
import TabGroup, { tabStateAtom } from './TabGroup'
import Modal, {
  EnableTout,
  ModalColorRush,
  ModalContentWrap,
  ModalHeader,
  ModalHeading,
  ModalTransaction,
  ModalCenterTout,
} from './Modal'
import { useTransaction, useUserData, useZaiData } from '../hooks'
import { MAX_UINT256 } from '../constants/values'
import { approve, purchaseCoupons } from '../utils/web3'
import { ZAI, ZAIS } from '../constants/tokens'

import { toBaseUnitBN, toTokenUnitsBN } from '../utils/number'
import { frozenOrLocked } from '../utils'

import { formInputAtomFamily, FigureInput, ActionLabel } from './Forms'
import Figure, { FigurePercent } from './Figure'

import CouponHistory from './CouponHistory'
import { getCouponPremium } from '../utils/infura'

const TAB_GROUP_NAME = 'couponsModal'

enum Stages {
  Purchase = 'Purchase',
  Redeem = 'Redeem',
}

const DAOModal = () => {
  const { redeemable, coupons } = useZaiData()
  const couponBalance = coupons
  const { allowance, staged, status } = useUserData()

  const isEnabled = allowance.comparedTo(MAX_UINT256) === 0
  const isFluid = !frozenOrLocked(status)

  const currentTab =
    useRecoilValue(tabStateAtom(TAB_GROUP_NAME)) || Stages.Purchase

  const formName = `${TAB_GROUP_NAME}/${currentTab}`
  const formValue = useRecoilValue(formInputAtomFamily(formName))

  const [sendTransaction, blocked, txHash] = useTransaction()

  const tabMap = {
    [Stages.Purchase]: {
      max: coupons,
      label: 'Purchase',
      action: (value: BigNumber) =>
        sendTransaction((cb) =>
          purchaseCoupons(ZAIS.addr, toBaseUnitBN(value, ZAI.decimals), cb),
        ),
    },

    [Stages.Redeem]: {
      label: 'Redeem',
      max: staged,
      action: (value: BigNumber) => console.log('should not get here'),
    },
  }

  const { max, label, action } = tabMap[currentTab]

  const valueOk =
    formValue &&
    new BigNumber(formValue).lte(max) &&
    new BigNumber(formValue).gt(0)
  const locked = isFluid

  const [premium, setPremium] = useState(new BigNumber(0))
  const updatePremium = async (purchaseAmount) => {
    if (purchaseAmount.lte(new BigNumber(0))) {
      setPremium(new BigNumber(0))
      return
    }
    const purchaseAmountBase = toBaseUnitBN(purchaseAmount, ZAI.decimals)
    const premium = await getCouponPremium(ZAIS.addr, purchaseAmountBase)
    const premiumFormatted = toTokenUnitsBN(premium, ZAI.decimals)
    setPremium(premiumFormatted)
  }

  useEffect(() => {
    if (formValue && valueOk) {
      updatePremium(new BigNumber(formValue))
    }
  }, [formValue, valueOk])

  return (
    <Modal>
      <ModalColorRush>
        <ModalHeader>
          <ModalHeading>Manage Coupons</ModalHeading>
        </ModalHeader>

        <ModalContentWrap>
          {txHash ? (
            <ModalTransaction text="Confirming Transaction" txHash={txHash} />
          ) : !isEnabled ? (
            <EnableTout copy="To manage coupons, you need to enable it first." />
          ) : currentTab === Stages.Purchase ? (
            <React.Fragment>
              <FigureInput
                disabled={isFluid}
                name={formName}
                max={max || new BigNumber(0)}
                unit="ZAI"
              />
              <Spacer size={16} />
            </React.Fragment>
          ) : (
            <ModalCenterTout
              css={css`
                min-height: auto;
              `}
            >
              <Spacer />
              <Text size={16} color="light">
                Coupons that you have purchased will be redeemable below
              </Text>
            </ModalCenterTout>
          )}
        </ModalContentWrap>

        <TabGroup
          tabs={[Stages.Purchase, Stages.Redeem]}
          name={TAB_GROUP_NAME}
        />
      </ModalColorRush>

      <ModalContentWrap>
        {currentTab === Stages.Redeem ? (
          <React.Fragment>
            <CouponHistory />
            <Spacer size={28} />
            <Seperator width={80} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TableRow
              left="Coupon Premium"
              right={<FigurePercent value={premium} />}
            />
            <Spacer size={28} />
          </React.Fragment>
        )}

        {!isEnabled ? (
          <BigButton
            css={css`
              width: 100%;
            `}
            disabled={blocked || isEnabled}
            onClick={() =>
              sendTransaction((cb) => approve(ZAI.addr, ZAIS.addr, cb))
            }
          >
            Enable
          </BigButton>
        ) : currentTab === Stages.Purchase ? (
          <BigButton
            css={css`
              width: 100%;
            `}
            disabled={blocked || !valueOk || locked}
            invalid={(blocked || !valueOk) && !locked}
            onClick={() => {
              action(formValue)
            }}
          >
            <ActionLabel label={label} value={formValue} locked={isFluid} />
          </BigButton>
        ) : null}

        <Spacer />
        <TableRow
          left="Purchased"
          right={<Figure num={couponBalance} round={2} />}
        />
        <TableRow
          left="Redeemable"
          right={<Figure num={redeemable} round={2} />}
        />
      </ModalContentWrap>
    </Modal>
  )
}

export default DAOModal
