/** @jsx jsx */
import { jsx, css } from '@emotion/react'

import { ZAIS } from '../../constants/tokens'
import { commit } from '../../utils/web3'
import { Button, Flex } from '../Elements'
import { ColumnFigure } from './components'

type CommitProps = {
  user: string
  candidate: string
  epoch: number
  startEpoch: number
  periodEpoch: number
  initialized: boolean
  approved: boolean
}

function Commit({
  user,
  candidate,
  epoch,
  startEpoch,
  periodEpoch,
  initialized,
  approved,
}: CommitProps) {
  function status(
    epoch,
    startEpoch,
    periodEpoch,
    initialized,
    approved,
  ): string {
    if (startEpoch === 0) {
      return 'N/A'
    }
    if (epoch < startEpoch) {
      return 'Unknown'
    }
    if (epoch < startEpoch + periodEpoch) {
      return 'Voting'
    }
    if (initialized) {
      return 'Committed'
    }
    if (approved) {
      return 'Approved'
    }
    return 'Rejected'
  }
  const s = status(epoch, startEpoch, periodEpoch, initialized, approved)

  return (
    <Flex
      css={css`
        justify-content: space-between;
      `}
    >
      <ColumnFigure heading="Status" value={s} />

      <Button
        onClick={() => {
          commit(ZAIS.addr, candidate)
        }}
        disabled={user === '' || s !== 'Approved'}
      >
        Commit
      </Button>
    </Flex>
  )
}

export default Commit
