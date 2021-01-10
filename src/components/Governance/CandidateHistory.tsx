/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  getAllProposals,
  getApproveFor,
  getEpoch,
  getIsInitialized,
  getRejectFor,
  getTokenTotalSupply,
  getTotalBondedAt,
} from '../../utils/infura'
import { ZAIS } from '../../constants/tokens'
import { proposalStatus } from '../../utils/gov'
import BigNumber from 'bignumber.js'

import { useUser } from '../../hooks'
import { H3, Flex, Text, Spacer } from '../Elements'
import AddressLink from '../AddressLink'

type Proposal = {
  index: number
  candidate: string
  account: string
  start: number
  period: number
  status: string
}

async function formatProposals(
  epoch: number,
  proposals: any[],
): Promise<Proposal[]> {
  const currentTotalStake = await getTokenTotalSupply(ZAIS.addr)
  const initializeds = await Promise.all(
    proposals.map((p) => getIsInitialized(ZAIS.addr, p.candidate)),
  )
  const approves = await Promise.all(
    proposals.map((p) => getApproveFor(ZAIS.addr, p.candidate)),
  )
  const rejecteds = await Promise.all(
    proposals.map((p) => getRejectFor(ZAIS.addr, p.candidate)),
  )
  const supplyAts = await Promise.all(
    proposals.map(async (p) => {
      const at = p.start + p.period - 1
      if (epoch > at) {
        return await getTotalBondedAt(ZAIS.addr, at)
      }
      return currentTotalStake
    }),
  )

  for (let i = 0; i < proposals.length; i++) {
    proposals[i].index = proposals.length - i
    proposals[i].start = parseInt(proposals[i].start)
    proposals[i].period = parseInt(proposals[i].period)
    proposals[i].status = proposalStatus(
      epoch,
      proposals[i].start,
      proposals[i].period,
      initializeds[i],
      new BigNumber(approves[i]),
      new BigNumber(rejecteds[i]),
      new BigNumber(supplyAts[i]),
    )
  }
  return proposals
}

const useCandidates = (): [Proposal[], boolean] => {
  const user = useUser()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function updateUserInfo() {
      const [epochStr, allProposals] = await Promise.all([
        getEpoch(ZAIS.addr),
        getAllProposals(ZAIS.addr),
      ])

      if (!isCancelled) {
        const formattedProposals = await formatProposals(
          parseInt(epochStr),
          allProposals,
        )
        setProposals(formattedProposals)
        setInitialized(true)
      }
    }
    updateUserInfo()
    const id = setInterval(updateUserInfo, 15000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [user])

  return [proposals, initialized]
}

const CandidateRow = ({ index, candidate, start, period, status }) => {
  const history = useHistory()
  return (
    <div
      css={css`
        cursor: pointer;
      `}
      onClick={() => history.push(`/governance/candidate/${candidate}`)}
    >
      <Flex
        css={css`
          justify-content: space-between;
        `}
      >
        <H3>Candidate #{index}</H3>
        <AddressLink address={candidate} />
      </Flex>

      <Spacer size={6} />

      <Flex
        css={css`
          justify-content: space-between;
          align-items: center;
        `}
      >
        <Flex>
          <Text>Proposed on: {start.toString()}</Text>
          <Spacer col />
          <Text>Ends on: {(start + period).toString()}</Text>
          <Spacer col />
          <Text>Status: {status}</Text>
        </Flex>
      </Flex>
    </div>
  )
}

function CandidateHistory() {
  const [proposals, initialized] = useCandidates()

  return initialized && proposals && proposals.length > 0 ? (
    <div>
      {proposals.map((p) => {
        return <CandidateRow {...p} />
      })}
    </div>
  ) : null
}

export default CandidateHistory
