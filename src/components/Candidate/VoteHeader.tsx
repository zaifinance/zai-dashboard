/** @jsx jsx */
import { jsx, css } from '@emotion/react'

import BigNumber from 'bignumber.js'

import { Flex } from '../Elements'
import Figure, { FigurePercent } from '../Figure'
import { ColumnFigure } from './components'

type VoteHeaderProps = {
  approveFor: BigNumber
  rejectFor: BigNumber
  totalStake: BigNumber
  showParticipation: boolean
}

function approval(approve: BigNumber, reject: BigNumber): BigNumber {
  return approve
    .multipliedBy(10000)
    .dividedToIntegerBy(approve.plus(reject))
    .dividedBy(100)
}

function participation(
  approve: BigNumber,
  reject: BigNumber,
  totalStake: BigNumber,
): BigNumber {
  return approve
    .plus(reject)
    .multipliedBy(10000)
    .dividedToIntegerBy(totalStake)
    .dividedBy(100)
}

const VoteHeader = ({
  approveFor,
  rejectFor,
  totalStake,
  showParticipation,
}: VoteHeaderProps) => (
  <Flex
    css={css`
      justify-content: space-between;
    `}
  >
    <ColumnFigure
      heading="Approve"
      value={<Figure num={approveFor} unit="ZAIS" />}
    />
    <ColumnFigure
      heading="Reject"
      value={<Figure num={rejectFor} unit="ZAIS" />}
    />
    <ColumnFigure
      heading="Approval"
      value={<FigurePercent value={approval(approveFor, rejectFor)} />}
    />
    {showParticipation && (
      <ColumnFigure
        right
        heading="Participation"
        value={
          <FigurePercent
            value={participation(approveFor, rejectFor, totalStake)}
          />
        }
      />
    )}
  </Flex>
)

export default VoteHeader
