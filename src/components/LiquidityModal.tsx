/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { useRecoilValue } from 'recoil'
import BigNumber from 'bignumber.js'

import TabGroup, { tabStateAtom } from './TabGroup'
import Modal, {
  ModalColorRush,
  ModalContentWrap,
  ModalHeader,
  ModalTransaction,
  EnableTout,
  ModalHeading,
} from './Modal'
import { Spacer, BigButton, TableRow, LabelHeading, Flex } from './Elements'
import {
  formInputAtomFamily,
  FigureInput,
  TwoWaySwitch,
  optionStateAtomFamily,
  ActionLabel,
  HelpText,
} from './Forms'
import Figure, { FigurePercent } from './Figure'

import { UNI } from '../constants/tokens'
import { MAX_UINT256 } from '../constants/values'
import { useTransaction, useUserPoolData, useZaiData } from '../hooks'
import { toBaseUnitBN } from '../utils/number'
import {
  depositPool,
  bondPool,
  approve,
  withdrawPool,
  unbondPool,
} from '../utils/web3'
import { frozenOrLocked } from '../utils'

enum LiquidityStages {
  Stage = 'Stage',
  Bond = 'Bond',
}

const TAB_GROUP_NAME = 'liquidityModal'

const LiquidityModal = () => {
  const { poolAddress } = useZaiData()
  const {
    uniBalance,
    uniAllowance,
    staged,
    bonded,
    status,
    epochYield,
    cycleYield,
  } = useUserPoolData()

  const isEnabled = uniAllowance.comparedTo(MAX_UINT256) === 0
  const isFluid = !frozenOrLocked(status)

  const currentTab =
    useRecoilValue(tabStateAtom(TAB_GROUP_NAME)) || LiquidityStages.Stage
  const formName = `${TAB_GROUP_NAME}/${currentTab}`

  const currentOptionIdx = useRecoilValue(optionStateAtomFamily(formName))
  const formValue = useRecoilValue(formInputAtomFamily(formName))

  const [sendTransaction, blocked, txHash] = useTransaction()

  const tabMap = {
    [LiquidityStages.Stage]: {
      options: [
        {
          max: uniBalance,
          label: 'Deposit',
          action: (value: BigNumber) =>
            sendTransaction((cb) =>
              depositPool(poolAddress, toBaseUnitBN(value, UNI.decimals), cb),
            ),
        },
        {
          max: staged,
          label: 'Withdraw',
          action: (value: BigNumber) =>
            sendTransaction((cb) =>
              withdrawPool(poolAddress, toBaseUnitBN(value, UNI.decimals), cb),
            ),
        },
      ],
      helpText:
        'Depositing or withdrawing UNI-LP requires you to be unlocked in the LP Pool',
    },

    [LiquidityStages.Bond]: {
      options: [
        {
          max: staged,
          label: 'Bond',
          action: (value: BigNumber) =>
            sendTransaction((cb) =>
              bondPool(poolAddress, toBaseUnitBN(value, UNI.decimals), cb),
            ),
        },
        {
          label: 'Unbond',
          max: bonded,
          action: (value: BigNumber) =>
            sendTransaction((cb) =>
              unbondPool(poolAddress, toBaseUnitBN(value, UNI.decimals), cb),
            ),
        },
      ],
      helpText:
        'Bonding or unbonding UNI-LP will reset your locked timer in the LP Pool to 3 cycles',
    },
  }

  const { options, helpText } = tabMap[currentTab]
  const { max, label, action } = options[currentOptionIdx]

  const valueOk =
    formValue &&
    new BigNumber(formValue).lte(max) &&
    new BigNumber(formValue).gt(0)

  const locked = isFluid && currentTab !== LiquidityStages.Bond

  return (
    <Modal>
      <ModalColorRush>
        <ModalHeader>
          <ModalHeading>Manage LP</ModalHeading>
        </ModalHeader>

        <ModalContentWrap>
          {txHash ? (
            <ModalTransaction text="Confirming Transaction" txHash={txHash} />
          ) : isEnabled ? (
            <React.Fragment>
              <FigureInput
                name={formName}
                max={max || new BigNumber(0)}
                unit="UNI-LP"
              />
              <Spacer size={16} />
              <TwoWaySwitch
                name={formName}
                options={options.map((o) => o.label)}
              />
              <Spacer size={24} />
            </React.Fragment>
          ) : (
            <EnableTout copy="To Bond or Unbond UNI-LP, you need to enable it first." />
          )}
        </ModalContentWrap>

        <TabGroup
          tabs={[LiquidityStages.Stage, LiquidityStages.Bond]}
          name={TAB_GROUP_NAME}
        />
      </ModalColorRush>

      <ModalContentWrap
        css={css`
          position: relative;
        `}
      >
        <LabelHeading>LP Bonding Rates</LabelHeading>
        <TableRow
          left="Epoch Yield"
          right={<FigurePercent value={epochYield} />}
        />
        <TableRow
          left="Cycle APR"
          right={<FigurePercent value={cycleYield} />}
        />

        <Spacer size={28} />

        {isEnabled ? (
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
            <ActionLabel label={label} value={formValue} locked={locked} />
          </BigButton>
        ) : (
          <BigButton
            css={css`
              width: 100%;
            `}
            disabled={blocked || isEnabled}
            onClick={() =>
              sendTransaction((cb) => approve(UNI.addr, poolAddress, cb))
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

        <TableRow
          left="Wallet"
          right={<Figure num={uniBalance} unit="UNI-LP" />}
        />
        <TableRow left="Staged" right={<Figure num={staged} unit="UNI-LP" />} />
        <TableRow left="Bonded" right={<Figure num={bonded} unit="UNI-LP" />} />
      </ModalContentWrap>
    </Modal>
  )
}

export default LiquidityModal
