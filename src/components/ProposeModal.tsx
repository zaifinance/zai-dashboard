/** @jsx jsx */
import React, { useState } from 'react'
import { jsx, css } from '@emotion/react'

import { Spacer, BigButton, Input, LabelHeading } from './Elements'
import { InputContainer } from './Forms'
import Modal, {
  ModalColorRush,
  ModalContentWrap,
  ModalHeader,
  ModalHeading,
  ModalTransaction,
} from './Modal'
import {
  useTransaction,
  useUser,
  useUserData,
  useUserGovernanceData,
} from '../hooks'

import { recordVote } from '../utils/web3'
import { ZAIS } from '../constants/tokens'

import { ActionLabel } from './Forms'

const plausibleCandidate = (candidate: string): boolean => {
  return /^(0x)[0-9a-fA-F]{40}$/i.test(candidate)
}

const ProposeModal = () => {
  const user = useUser()
  const { status } = useUserData()
  const { canPropose } = useUserGovernanceData()

  const [sendTransaction, blocked, txHash] = useTransaction()

  const [candidate, setCandidate] = useState('0x')

  return (
    <Modal>
      <ModalColorRush>
        <ModalHeader>
          <ModalHeading>Propose Candidate</ModalHeading>
        </ModalHeader>

        <ModalContentWrap>
          {txHash ? (
            <ModalTransaction text="Confirming Transaction" txHash={txHash} />
          ) : (
            <React.Fragment>
              <Spacer size={28} />
              <LabelHeading>Candidate contract address</LabelHeading>
              <Spacer size={8} />
              <InputContainer>
                <Input
                  value={candidate}
                  onChange={(e) => {
                    const { value } = e.target
                    if (value) {
                      setCandidate(value)
                    } else {
                      setCandidate('0x')
                    }
                  }}
                />
              </InputContainer>
            </React.Fragment>
          )}
        </ModalContentWrap>
      </ModalColorRush>

      <ModalContentWrap>
        <BigButton
          css={css`
            width: 100%;
          `}
          disabled={
            user === '' ||
            blocked ||
            !canPropose ||
            !plausibleCandidate(candidate) ||
            status === 1
          }
          onClick={() => {
            sendTransaction(() => {
              recordVote(
                ZAIS.addr,
                candidate,
                1, // APPROVE
              )
            })
          }}
        >
          <ActionLabel label="Propose" value="" locked={status !== 1} />
        </BigButton>

        <Spacer />
      </ModalContentWrap>
    </Modal>
  )
}

export default ProposeModal
