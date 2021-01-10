/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  getApproveFor,
  getEpoch,
  getIsInitialized,
  getPeriodFor,
  getRecordedVote,
  getRejectFor,
  getStartFor,
  getStatusOf,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBondedAt,
} from '../../utils/infura'
import { ZAIS } from '../../constants/tokens'
import { toTokenUnitsBN } from '../../utils/number'
import BigNumber from 'bignumber.js'
import Vote from './Vote'
import VoteHeader from './VoteHeader'
import Commit from './Commit'
import { proposalStatus } from '../../utils/gov'
import { useUser } from '../../hooks'

import { H3, Spacer, Flex, Seperator } from '../Elements'
import AddressLink from '../AddressLink'
import { CandidateWrapper, ColumnFigure } from './components'

interface CandidateParams {
  candidate: string
}

const Candidate = () => {
  const user = useUser()

  const { candidate } = useParams<CandidateParams>()

  const [approveFor, setApproveFor] = useState(new BigNumber(0))
  const [rejectFor, setRejectFor] = useState(new BigNumber(0))
  const [totalStake, setTotalStake] = useState(new BigNumber(0))
  const [vote, setVote] = useState(0)
  const [status, setStatus] = useState(0)
  const [userStake, setUserStake] = useState(new BigNumber(0))
  const [epoch, setEpoch] = useState(0)
  const [startEpoch, setStartEpoch] = useState(0)
  const [periodEpoch, setPeriodEpoch] = useState(0)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (user === '') {
      setVote(0)
      setStatus(0)
      setUserStake(new BigNumber(0))
      return
    }
    let isCancelled = false

    async function updateUserInfo() {
      const [voteStr, statusStr, userStakeStr] = await Promise.all([
        getRecordedVote(ZAIS.addr, user, candidate),
        getStatusOf(ZAIS.addr, user),
        getTokenBalance(ZAIS.addr, user),
      ])

      if (!isCancelled) {
        setVote(parseInt(voteStr, 10))
        setStatus(parseInt(statusStr, 10))
        setUserStake(toTokenUnitsBN(userStakeStr, ZAIS.decimals))
      }
    }
    updateUserInfo()
    const id = setInterval(updateUserInfo, 15000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [user, candidate])

  useEffect(() => {
    let isCancelled = false

    async function updateUserInfo() {
      let [
        approveForStr,
        rejectForStr,
        totalStakeStr,
        epochStr,
        startForStr,
        periodForStr,
        isInitialized,
      ] = await Promise.all([
        getApproveFor(ZAIS.addr, candidate),
        getRejectFor(ZAIS.addr, candidate),
        getTokenTotalSupply(ZAIS.addr),
        getEpoch(ZAIS.addr),
        getStartFor(ZAIS.addr, candidate),
        getPeriodFor(ZAIS.addr, candidate),
        getIsInitialized(ZAIS.addr, candidate),
      ])

      const epochN = parseInt(epochStr, 10)
      const startN = parseInt(startForStr, 10)
      const periodN = parseInt(periodForStr, 10)

      const endsAfter = startN + periodN - 1
      if (epochN > endsAfter && endsAfter >= 0) {
        totalStakeStr = await getTotalBondedAt(ZAIS.addr, endsAfter)
      }

      if (!isCancelled) {
        setApproveFor(toTokenUnitsBN(approveForStr, ZAIS.decimals))
        setRejectFor(toTokenUnitsBN(rejectForStr, ZAIS.decimals))
        setTotalStake(toTokenUnitsBN(totalStakeStr, ZAIS.decimals))
        setEpoch(epochN)
        setStartEpoch(startN)
        setPeriodEpoch(periodN)
        setInitialized(isInitialized)
      }
    }
    updateUserInfo()
    const id = setInterval(updateUserInfo, 15000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [candidate])

  console.log(approveFor.toString(), rejectFor.toString())

  return (
    <CandidateWrapper>
      <Flex>
        <H3>Address: </H3>
        <Spacer col />
        <AddressLink address={candidate} />
      </Flex>

      <Spacer size={48} />

      <VoteHeader
        approveFor={approveFor}
        rejectFor={rejectFor}
        totalStake={totalStake}
        showParticipation={startEpoch > 0}
      />

      <Spacer size={48} />
      <Seperator width={100} />
      <Spacer size={48} />

      <H3>Vote</H3>
      <Spacer />
      <Vote
        candidate={candidate}
        stake={userStake}
        vote={vote}
        status={status}
      />

      <Spacer size={48} />
      <Seperator width={100} />
      <Spacer size={48} />

      <H3>Commit</H3>
      <Spacer />

      <Flex
        css={css`
          justify-content: space-between;
        `}
      >
        <Flex>
          <ColumnFigure heading="Starts on" value={startEpoch} />
          <Spacer col />
          <ColumnFigure heading="Ends on" value={startEpoch + periodEpoch} />
          <Spacer col />
          <ColumnFigure heading="Period" value={periodEpoch} />
        </Flex>
        <ColumnFigure heading="Current epoch" value={epoch} />
      </Flex>

      <Spacer />

      <Commit
        user={user}
        candidate={candidate}
        epoch={epoch}
        startEpoch={startEpoch}
        periodEpoch={periodEpoch}
        initialized={initialized}
        approved={
          proposalStatus(
            epoch,
            startEpoch,
            periodEpoch,
            false,
            approveFor,
            rejectFor,
            totalStake,
          ) === 'Approved'
        }
      />
    </CandidateWrapper>
  )
}

export default Candidate
