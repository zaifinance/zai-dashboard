/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'

import { Spacer, BigButton, TableRow, Flex } from './Elements'
import TabGroup, { tabStateAtom } from './TabGroup'
import Modal, {
  EnableTout,
  ModalColorRush,
  ModalContentWrap,
  ModalHeader,
  ModalHeading,
  ModalTransaction,
} from './Modal'
import { useTransaction, useUserPoolData, useZaiData } from '../hooks'
import { MAX_UINT256 } from '../constants/values'
import { approve, claimPool, providePool } from '../utils/web3'
import { DAI, ZAI } from '../constants/tokens'

import {
  formInputAtomFamily,
  FigureInput,
  ActionLabel,
  HelpText,
} from './Forms'
import Figure from './Figure'
import { useRecoilValue } from 'recoil'
import BigNumber from 'bignumber.js'
import { toBaseUnitBN, toTokenUnitsBN, formatBN } from '../utils/number'
import { frozenOrLocked } from '../utils'
import { rem } from 'polished'

const TAB_GROUP_NAME = 'rewardsModal'

enum RewardsStages {
  Claim = 'Claim',
  Provide = 'Add to LP',
}

const RewardsModal = () => {
  const { poolAddress, pairBalanceDai, pairBalanceZai } = useZaiData()
  const {
    daiBalance,
    daiAllowance,
    claimable,
    rewarded,
    status,
  } = useUserPoolData()

  const isEnabled = daiAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0
  const isFluid = !frozenOrLocked(status)

  const currentTab =
    useRecoilValue(tabStateAtom(TAB_GROUP_NAME)) || RewardsStages.Claim

  const formName = `${TAB_GROUP_NAME}/${currentTab}`
  const formValue = useRecoilValue(formInputAtomFamily(formName))

  const [sendTransaction, blocked, txHash] = useTransaction()

  const tabMap = {
    [RewardsStages.Claim]: {
      max: claimable,
      label: 'Claim',
      action: (value: BigNumber) =>
        sendTransaction((cb) =>
          claimPool(poolAddress, toBaseUnitBN(value, ZAI.decimals), cb),
        ),
      helpText: 'Claiming requires you to be unlocked in the LP Pool',
    },

    [RewardsStages.Provide]: {
      max: rewarded,
      label: 'Provide',
      action: (value: BigNumber) =>
        sendTransaction((cb) =>
          providePool(poolAddress, toBaseUnitBN(value, ZAI.decimals), cb),
        ),
      helpText: (
        <React.Fragment>
          Provide earned Zai (with equivalent Dai) to compound bonded UNI-LP.
          Requires you to be unlocked in the LP Pool
        </React.Fragment>
      ),
    },
  }

  const { max, label, action, helpText } = tabMap[currentTab]

  const ratio = pairBalanceDai.isZero()
    ? new BigNumber(1)
    : pairBalanceDai.div(pairBalanceZai)

  const amountZai = toBaseUnitBN(formValue, ZAI.decimals)
  const newAmountDai = amountZai
    .multipliedBy(ratio)
    .integerValue(BigNumber.ROUND_FLOOR)

  const daiBalanceBU = toBaseUnitBN(daiBalance, DAI.decimals)

  const valueOk =
    formValue &&
    new BigNumber(formValue).lte(max) &&
    new BigNumber(formValue).gt(0)
  const locked = isFluid

  return (
    <Modal>
      <ModalColorRush>
        <ModalHeader>
          <ModalHeading>Manage Rewards</ModalHeading>
        </ModalHeader>

        <ModalContentWrap>
          {txHash ? (
            <ModalTransaction text="Enabling Provide" txHash={txHash} />
          ) : isEnabled ? (
            <React.Fragment>
              <FigureInput
                name={formName}
                max={max || new BigNumber(0)}
                unit="ZAI"
              />
              <Spacer size={16} />
            </React.Fragment>
          ) : (
            <EnableTout copy="To Provide ZAI-DAI LP, you need to enable it first." />
          )}
        </ModalContentWrap>

        <TabGroup
          tabs={[RewardsStages.Claim, RewardsStages.Provide]}
          name={TAB_GROUP_NAME}
        />
      </ModalColorRush>

      <ModalContentWrap>
        <Spacer size={28} />

        {isEnabled ? (
          <BigButton
            css={css`
              width: 100%;
            `}
            disabled={
              blocked ||
              !valueOk ||
              locked ||
              (currentTab === RewardsStages.Provide &&
                newAmountDai.isGreaterThan(daiBalanceBU))
            }
            invalid={(blocked || !valueOk) && !locked}
            onClick={() => {
              action(formValue)
            }}
          >
            <ActionLabel
              label={label}
              value={
                formValue
                  ? ' ' +
                    `${formValue} ZAI` +
                    (currentTab === RewardsStages.Provide
                      ? ` (${formatBN(
                          toTokenUnitsBN(newAmountDai, DAI.decimals),
                          4,
                        )} DAI)`
                      : '')
                  : ''
              }
              // unit="DAI"

              locked={locked}
            />
          </BigButton>
        ) : (
          <BigButton
            css={css`
              width: 100%;
            `}
            disabled={blocked || isEnabled}
            onClick={() =>
              sendTransaction((cb) => approve(DAI.addr, poolAddress, cb))
            }
          >
            Enable
          </BigButton>
        )}

        <Spacer size={6} />
        <Flex
          css={css`
            justify-content: center;
            text-align: center;
          `}
        >
          <HelpText>{helpText}</HelpText>
        </Flex>

        <Spacer />

        <TableRow left="Earned" right={<Figure num={rewarded} round={4} />} />
        <TableRow
          left="Claimable"
          right={<Figure num={claimable} round={4} />}
        />
        <TableRow
          left={
            <React.Fragment>
              Dai{' '}
              <span
                css={css`
                  font-size: ${rem(12)};
                `}
              >
                (
                <a
                  href="https://app.compound.finance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Borrow Dai
                </a>
                )
              </span>
            </React.Fragment>
          }
          right={<Figure num={daiBalance} round={4} unit="DAI" />}
        />
      </ModalContentWrap>
    </Modal>
  )
}

export default RewardsModal
