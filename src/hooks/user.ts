import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  getBalanceBonded,
  getBalanceOfStaged,
  getFluidUntil,
  getLockedUntil,
  getPoolBalanceOfBonded,
  getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolFluidUntil,
  getPoolStatusOf,
  getStatusOf,
  getTokenAllowance,
  getTokenBalance,
} from '../utils/infura'
import { DAI, UNI, ZAI, ZAIS } from '../constants/tokens'
import {
  ownership as calculateOwnership,
  toTokenUnitsBN,
} from '../utils/number'
import { useZaiData, totalZAISAtom } from './zai'
import { GOVERNANCE_PROPOSAL_THRESHOLD } from '../constants/values'

export const useUser = () => {
  const { account } = useWeb3React()
  return account
}

export const balanceAtom = atom({
  key: 'UserBalance',
  default: new BigNumber(0),
})

export const allowanceAtom = atom({
  key: 'UserAllowance',
  default: new BigNumber(0),
})

export const statusAtom = atom({
  key: 'UserStatus',
  default: 0,
})

export const fluidUntilAtom = atom({
  key: 'UserFluidUntil',
  default: 0,
})

export const lockedUntilAtom = atom({
  key: 'UserLockedUntil',
  default: 0,
})

export const stagedAtom = atom({
  key: 'UserStaged',
  default: new BigNumber(0),
})

export const bondedAtom = atom({
  key: 'UserBonded',
  default: new BigNumber(0),
})

export const userStakeAtom = atom({
  key: 'UserDAOBalance',
  default: new BigNumber(0),
})

// const couponBalanceAtom = atom({
//   key: 'UserCouponBalance',
//   default: new BigNumber(0),
// })

const useUpdater = (updater, timeout = 15000, deps = []) => {
  useEffect(() => {
    let isCancelled = false

    updater(isCancelled)
    const id = setInterval(updater, timeout)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export const useUpdateUserData = () => {
  const user = useUser()

  const setBalance = useSetRecoilState(balanceAtom)
  const setAllowance = useSetRecoilState(allowanceAtom)
  const setBonded = useSetRecoilState(bondedAtom)
  const setStaged = useSetRecoilState(stagedAtom)
  const setStatus = useSetRecoilState(statusAtom)
  const setFluidUntil = useSetRecoilState(fluidUntilAtom)
  const setLockedUntil = useSetRecoilState(lockedUntilAtom)
  const setUserStake = useSetRecoilState(userStakeAtom)
  // const setCouponBalance = useSetRecoilState(couponBalanceAtom)

  useUpdater(
    async function updateUserInfo(isCancelled: boolean) {
      if (!user) {
        return
      }

      const [
        balanceStr,
        allowanceStr,
        staged,
        bonded,
        status,
        fluidUntil,
        lockedUntil,
        userStake,
      ] = await Promise.all([
        getTokenBalance(ZAI.addr, user),
        getTokenAllowance(ZAI.addr, user, ZAIS.addr),
        getBalanceOfStaged(ZAIS.addr, user),
        getBalanceBonded(ZAIS.addr, user),
        getStatusOf(ZAIS.addr, user),
        getFluidUntil(ZAIS.addr, user),
        getLockedUntil(ZAIS.addr, user),
        getTokenBalance(ZAIS.addr, user),
        // getBalanceOfCoupons(ZAIS.addr, user),
      ])

      if (!isCancelled) {
        setBalance(toTokenUnitsBN(balanceStr, ZAI.decimals))
        setAllowance(new BigNumber(allowanceStr))
        setStaged(toTokenUnitsBN(staged, ZAI.decimals))
        setBonded(toTokenUnitsBN(bonded, ZAI.decimals))
        setStatus(parseInt(status, 10))
        setFluidUntil(parseInt(fluidUntil, 10))
        setLockedUntil(parseInt(lockedUntil, 10))
        setUserStake(toTokenUnitsBN(userStake, ZAIS.decimals))
      }
    },
    5000,
    [user],
  )
}

export const userPoolUNIBalanceAtom = atom({
  key: 'PoolUNIBalanceAtom',
  default: new BigNumber(0),
})

export const userPoolDaiBalanceAtom = atom({
  key: 'PoolDaiBalanceAtom',
  default: new BigNumber(0),
})
export const userPoolUNIAllowanceAtom = atom({
  key: 'PoolUNIAllowanceAtom',
  default: new BigNumber(0),
})
export const userPoolDaiAllowanceAtom = atom({
  key: 'PoolDaiAllowanceAtom',
  default: new BigNumber(0),
})
export const userPoolBondedAtom = atom({
  key: 'PoolBondedAtom',
  default: new BigNumber(0),
})
export const userPoolStagedAtom = atom({
  key: 'PoolStagedAtom',
  default: new BigNumber(0),
})
export const userPoolRewardedAtom = atom({
  key: 'PoolRewardedAtom',
  default: new BigNumber(0),
})
export const userPoolClaimableAtom = atom({
  key: 'PoolClaimableAtom',
  default: new BigNumber(0),
})
export const userPoolStatusAtom = atom({
  key: 'PoolStatusAtom',
  default: 0,
})
export const userPoolFluidUntilAtom = atom({
  key: 'PoolFluidUntilAtom',
  default: 0,
})

export const useUpdateUserPoolData = () => {
  const user = useUser()
  const { poolAddress } = useZaiData()

  const setUNIBalance = useSetRecoilState(userPoolUNIBalanceAtom)
  const setDaiBalance = useSetRecoilState(userPoolDaiBalanceAtom)
  const setUNIAllowance = useSetRecoilState(userPoolUNIAllowanceAtom)
  const setDaiAllowance = useSetRecoilState(userPoolDaiAllowanceAtom)
  const setBonded = useSetRecoilState(userPoolBondedAtom)
  const setStaged = useSetRecoilState(userPoolStagedAtom)
  const setRewarded = useSetRecoilState(userPoolRewardedAtom)
  const setClaimable = useSetRecoilState(userPoolClaimableAtom)
  const setStatus = useSetRecoilState(userPoolStatusAtom)
  const setFluidUntil = useSetRecoilState(userPoolFluidUntilAtom)

  useUpdater(
    async function updateUserInfo(isCancelled: boolean) {
      if (!user) {
        return
      }

      const [
        uniBalanceStr,
        daiBalanceStr,
        uniAllowanceStr,
        daiAllowanceStr,
        staged,
        bonded,
        rewarded,
        claimable,
        status,
        fluidUntil,
      ] = await Promise.all([
        getTokenBalance(UNI.addr, user),
        getTokenBalance(DAI.addr, user),
        getTokenAllowance(UNI.addr, user, poolAddress),
        getTokenAllowance(DAI.addr, user, poolAddress),

        getPoolBalanceOfStaged(poolAddress, user),
        getPoolBalanceOfBonded(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),

        getPoolStatusOf(poolAddress, user),
        getPoolFluidUntil(poolAddress, user),
      ])

      if (!isCancelled) {
        setUNIBalance(toTokenUnitsBN(uniBalanceStr, UNI.decimals))
        setDaiBalance(toTokenUnitsBN(daiBalanceStr, DAI.decimals))
        setUNIAllowance(new BigNumber(uniAllowanceStr))
        setDaiAllowance(new BigNumber(daiAllowanceStr))
        setStaged(toTokenUnitsBN(staged, UNI.decimals))
        setBonded(toTokenUnitsBN(bonded, UNI.decimals))
        setRewarded(toTokenUnitsBN(rewarded, UNI.decimals))
        setClaimable(toTokenUnitsBN(claimable, UNI.decimals))
        setStatus(parseInt(status, 10))
        setFluidUntil(parseInt(fluidUntil, 10))
      }
    },
    5000,
    [user],
  )
}

export function canPropose(ownership: BigNumber): boolean {
  return ownership.comparedTo(GOVERNANCE_PROPOSAL_THRESHOLD) >= 0
}

const governanceDataSelector = selector({
  key: 'UserGovernanceData',
  get: ({ get }) => {
    const ownership = calculateOwnership(get(userStakeAtom), get(totalZAISAtom))
    return {
      ownership,
      canPropose: canPropose(ownership),
    }
  },
})

export const useUserGovernanceData = () => {
  return useRecoilValue(governanceDataSelector)
}
