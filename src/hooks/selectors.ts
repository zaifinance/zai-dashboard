import { selector, useRecoilValue } from 'recoil'
import { DAO_EPOCH_EXPANSION } from '../constants/values'

import {
  balanceAtom,
  allowanceAtom,
  bondedAtom,
  stagedAtom,
  statusAtom,
  fluidUntilAtom,
  lockedUntilAtom,
  userPoolUNIBalanceAtom,
  userPoolDaiBalanceAtom,
  userPoolUNIAllowanceAtom,
  userPoolDaiAllowanceAtom,
  userPoolBondedAtom,
  userPoolStagedAtom,
  userPoolRewardedAtom,
  userPoolClaimableAtom,
  userPoolStatusAtom,
  userPoolFluidUntilAtom,
} from './user'
import { totalBondedAtom, totalTokensAtom, poolTotalBondedAtom } from './zai'

const epochDaoYieldSelector = selector({
  key: 'UserEpochYield',
  get: ({ get }) => {
    const totalBonded = get(totalBondedAtom)
    const totalSupply = get(totalTokensAtom)
    // const spotPrice = get(spotPriceAtom)

    return DAO_EPOCH_EXPANSION.div(totalBonded.div(totalSupply)).times(100)
  },
})

const cycleDaoYieldSelector = selector({
  key: 'UserCycleYield',
  get: ({ get }) => {
    const rate = get(epochDaoYieldSelector)

    return rate.div(100).plus(1).pow(48).times(48)
  },
})

const userDataSelector = selector({
  key: 'UserData',
  get: ({ get }) => {
    return {
      balance: get(balanceAtom),
      allowance: get(allowanceAtom),
      bonded: get(bondedAtom),
      staged: get(stagedAtom),
      status: get(statusAtom),
      fluidUntil: get(fluidUntilAtom),
      lockedUntil: get(lockedUntilAtom),
      epochYield: get(epochDaoYieldSelector),
      cycleYield: get(cycleDaoYieldSelector),
    }
  },
})

export const useUserData = () => {
  return useRecoilValue(userDataSelector)
}

const epochPoolYieldSelector = selector({
  key: 'UserPoolEpochYield',
  get: ({ get }) => {
    const totalBonded = get(poolTotalBondedAtom)
    const totalSupply = get(totalTokensAtom)

    return DAO_EPOCH_EXPANSION.div(totalBonded.div(totalSupply)).times(100)
  },
})

const cyclePoolYieldSelector = selector({
  key: 'UserPoolCycleYield',
  get: ({ get }) => {
    const rate = get(epochPoolYieldSelector)

    return rate.times(48)
  },
})

const userPoolDataSelector = selector({
  key: 'UserPoolData',
  get: ({ get }) => {
    return {
      uniBalance: get(userPoolUNIBalanceAtom),
      uniAllowance: get(userPoolUNIAllowanceAtom),
      daiBalance: get(userPoolDaiBalanceAtom),
      daiAllowance: get(userPoolDaiAllowanceAtom),
      bonded: get(userPoolBondedAtom),
      staged: get(userPoolStagedAtom),
      rewarded: get(userPoolRewardedAtom),
      claimable: get(userPoolClaimableAtom),
      status: get(userPoolStatusAtom),
      fluidUntil: get(userPoolFluidUntilAtom),
      epochYield: get(epochPoolYieldSelector),
      cycleYield: get(cyclePoolYieldSelector),
    }
  },
})

export const useUserPoolData = () => {
  return useRecoilValue(userPoolDataSelector)
}
