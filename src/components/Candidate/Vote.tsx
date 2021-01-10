/** @jsx jsx */
import { jsx, css } from '@emotion/react'

import BigNumber from 'bignumber.js'

import { recordVote } from '../../utils/web3'

import { ZAIS } from '../../constants/tokens'

import { ColumnFigure } from './components'
import { Button, Flex, Spacer } from '../Elements'
import Figure from '../Figure'

type VoteProps = {
  candidate: string
  stake: BigNumber
  vote: number
  status: number
}

const VOTE_TYPE_MAP = ['Undecided', 'Approve', 'Reject']

function Vote({ candidate, stake, vote, status }: VoteProps) {
  return (
    <Flex
      css={css`
        justify-content: space-between;
      `}
    >
      <ColumnFigure
        heading="My Stake"
        value={<Figure num={stake} unit="ZAIS" />}
      />
      <ColumnFigure heading="My Vote" value={VOTE_TYPE_MAP[vote]} />

      <Flex>
        <Button
          onClick={() => {
            recordVote(
              ZAIS.addr,
              candidate,
              0, // UNDECIDED
            )
          }}
          disabled={status === 1 || vote === 0 || stake.isZero()}
        >
          Unvote
        </Button>

        <Spacer col />

        <Button
          onClick={() => {
            recordVote(
              ZAIS.addr,
              candidate,
              1, // APPROVE
            )
          }}
          disabled={status === 1 || vote === 1 || stake.isZero()}
        >
          Accept
        </Button>
        <Spacer col />
        <Button
          wide
          onClick={() => {
            recordVote(
              ZAIS.addr,
              candidate,
              2, // REJECT
            )
          }}
          disabled={status === 1 || vote === 2 || stake.isZero()}
        >
          Reject
        </Button>
      </Flex>
    </Flex>
  )
}

export default Vote
