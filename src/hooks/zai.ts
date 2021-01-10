import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
  atom,
  atomFamily,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

import {
  getTokenTotalSupply,
  getTotalBonded,
  getTotalDebt,
  getTotalNet,
  getTotalStaged,
  getTotalCoupons,
  getTotalRedeemable,
  getCouponPremium,
  getImplementation,
  getPool,
  getPoolTotalBonded,
  getPoolTotalStaged,
  getTokenBalance,
  getEpoch,
  getPoolTotalRewarded,
  getPoolTotalClaimable,
} from '../utils/infura'
import { toTokenUnitsBN } from '../utils/number'
import { ZAI, ZAIS, POOL, DAI, UNI } from '../constants/tokens'

const epochAtom = atom({
  key: 'Epoch',
  default: 0,
})

const poolAddressAtom = atom({
  key: 'PoolAddress',
  default: '0xf1a6bed23411d709069ddbd55a04700f9493476f',
})

export const totalTokensAtom = atom({
  key: 'TotalTokens',
  default: new BigNumber(0),
})

export const totalBondedAtom = atom({
  key: 'TotalBonded',
  default: new BigNumber(0),
})

export const totalStagedAtom = atom({
  key: 'TotalStaged',
  default: new BigNumber(0),
})

export const totalDebtAtom = atom({
  key: 'TotalDebt',
  default: new BigNumber(0),
})

export const totalNetAtom = atom({
  key: 'TotalNet',
  default: new BigNumber(0),
})

export const couponsAtom = atom({
  key: 'Coupons',
  default: new BigNumber(0),
})

export const couponPremiumAtom = atom({
  key: 'CouponPremium',
  default: new BigNumber(0),
})

export const redeemableAtom = atom({
  key: 'Redeemable',
  default: new BigNumber(0),
})

export const implementationAtom = atom({
  key: 'Implementation',
  default: '',
})

export const pairBalanceAtomFamily = atomFamily({
  key: 'PairBalance',
  default: new BigNumber(0),
})

export const poolTotalSupplyAtom = atom({
  key: 'PoolTotalSupply',
  default: new BigNumber(0),
})

export const poolTotalBondedAtom = atom({
  key: 'PoolTotalBonded',
  default: new BigNumber(0),
})

export const poolTotalStagedAtom = atom({
  key: 'PoolTotalStaged',
  default: new BigNumber(0),
})

export const poolTotalRewardedAtom = atom({
  key: 'PoolTotalRewarded',
  default: new BigNumber(0),
})

export const poolTotalClaimableAtom = atom({
  key: 'PoolTotalClaimable',
  default: new BigNumber(0),
})

// const hideRedeemedAtom = atom({
//   key: 'HideRedeemed',
//   default: false,
// })

export const totalZAISAtom = atom({
  key: 'TotalZAIS',
  default: new BigNumber(0),
})

export const useHasWeb3 = () => {
  const [hasWeb3, setHasWeb3] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let isCancelled = false

    async function update() {
      if (!isCancelled) {
        // @ts-ignore
        setHasWeb3(typeof window.ethereum !== 'undefined')
      }
    }

    update()
    const id = setInterval(update, 15000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [])

  return hasWeb3
}

const ONE_COUPON = new BigNumber(10).pow(18)

export const useUpdateZaiData = () => {
  const setEpoch = useSetRecoilState(epochAtom)

  const setTotalTokens = useSetRecoilState(totalTokensAtom)
  const setTotalDebt = useSetRecoilState(totalDebtAtom)
  const setTotalNet = useSetRecoilState(totalNetAtom)
  const setTotalBonded = useSetRecoilState(totalBondedAtom)
  const setTotalStaged = useSetRecoilState(totalStagedAtom)

  const setPoolTotalSupply = useSetRecoilState(poolTotalSupplyAtom)
  const setPoolTotalBonded = useSetRecoilState(poolTotalBondedAtom)
  const setPoolTotalStaged = useSetRecoilState(poolTotalStagedAtom)
  const setPoolTotalRewarded = useSetRecoilState(poolTotalRewardedAtom)
  const setPoolTotalClaimable = useSetRecoilState(poolTotalClaimableAtom)

  const setCoupons = useSetRecoilState(couponsAtom)
  const setRedeemable = useSetRecoilState(redeemableAtom)
  const setCouponPremium = useSetRecoilState(couponPremiumAtom)

  const setImplementation = useSetRecoilState(implementationAtom)
  const setPoolAddress = useSetRecoilState(poolAddressAtom)

  const setPairBalanceDai = useSetRecoilState(pairBalanceAtomFamily(DAI.symbol))
  const setPairBalanceZai = useSetRecoilState(pairBalanceAtomFamily(ZAI.symbol))

  const setTotalZAIS = useSetRecoilState(totalZAISAtom)

  useEffect(() => {
    let isCancelled = false

    async function updateTokenData() {
      if (!isCancelled) {
        const [
          epoch,
          totalSupply,
          totalDebt,
          totalNet,
          totalBonded,
          totalStaged,
          poolTotalSupply,
          poolTotalBonded,
          poolTotalStaged,
          poolTotalRewarded,
          poolTotalClaimable,
          coupons,
          redeemable,
          implementation,
          poolAddress,
          pairBalanceZai,
          pairBalanceDai,
          totalZAIS,
        ] = await Promise.all([
          getEpoch(ZAIS.addr),
          getTokenTotalSupply(ZAI.addr),
          getTotalDebt(ZAIS.addr),
          getTotalNet(ZAIS.addr),
          getTotalBonded(ZAIS.addr),
          getTotalStaged(ZAIS.addr),
          getTokenTotalSupply(UNI.addr),
          getPoolTotalBonded(POOL.addr),
          getPoolTotalStaged(POOL.addr),
          getPoolTotalRewarded(POOL.addr),
          getPoolTotalClaimable(POOL.addr),
          getTotalCoupons(ZAIS.addr),
          getTotalRedeemable(ZAIS.addr),
          getImplementation(ZAIS.addr),
          getPool(ZAIS.addr),
          getTokenBalance(ZAI.addr, UNI.addr),
          getTokenBalance(DAI.addr, UNI.addr),
          getTokenTotalSupply(ZAIS.addr),
        ])

        setEpoch(parseInt(epoch, 10))

        setTotalTokens(toTokenUnitsBN(totalSupply, ZAI.decimals))
        const totalDebtBN = toTokenUnitsBN(totalDebt, ZAI.decimals)
        setTotalDebt(totalDebtBN)
        setTotalNet(toTokenUnitsBN(totalNet, ZAI.decimals))
        setTotalBonded(toTokenUnitsBN(totalBonded, ZAI.decimals))
        setTotalStaged(toTokenUnitsBN(totalStaged, ZAI.decimals))
        setPoolTotalSupply(toTokenUnitsBN(poolTotalSupply, UNI.decimals))
        setPoolTotalBonded(toTokenUnitsBN(poolTotalBonded, ZAI.decimals))
        setPoolTotalStaged(toTokenUnitsBN(poolTotalStaged, ZAI.decimals))
        setPoolTotalRewarded(toTokenUnitsBN(poolTotalRewarded, ZAI.decimals))
        setPoolTotalClaimable(toTokenUnitsBN(poolTotalClaimable, ZAI.decimals))
        setCoupons(toTokenUnitsBN(coupons, ZAI.decimals))
        setRedeemable(toTokenUnitsBN(redeemable, ZAI.decimals))
        setPairBalanceDai(toTokenUnitsBN(pairBalanceDai, DAI.decimals))
        setPairBalanceZai(toTokenUnitsBN(pairBalanceZai, ZAI.decimals))
        setTotalZAIS(toTokenUnitsBN(totalZAIS, ZAIS.decimals))

        if (totalDebtBN.isGreaterThan(new BigNumber(1))) {
          const couponPremiumStr = await getCouponPremium(ZAIS.addr, ONE_COUPON)
          setCouponPremium(toTokenUnitsBN(couponPremiumStr, ZAI.decimals))
        } else {
          setCouponPremium(new BigNumber(0))
        }

        setImplementation(implementation)
        setPoolAddress(poolAddress)
      }
    }
    updateTokenData()
    const id = setInterval(updateTokenData, 10000)

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const zaiDataSelector = selector({
  key: 'ZaiData',
  get: ({ get }) => {
    const pairBalanceZai = get(pairBalanceAtomFamily(ZAI.symbol))
    const pairBalanceDai = get(pairBalanceAtomFamily(DAI.symbol))

    let zaiDaiRatio = pairBalanceDai.isZero()
      ? new BigNumber(1)
      : pairBalanceZai.div(pairBalanceDai)

    return {
      epoch: get(epochAtom),
      totalSupply: get(totalTokensAtom),
      totalTokens: get(totalTokensAtom),
      totalDebt: get(totalDebtAtom),
      totalNet: get(totalNetAtom),
      totalBonded: get(totalBondedAtom),
      totalStaged: get(totalStagedAtom),
      poolTotalSupply: get(poolTotalSupplyAtom),
      poolTotalBonded: get(poolTotalBondedAtom),
      poolTotalStaged: get(poolTotalStagedAtom),
      poolTotalRewarded: get(poolTotalRewardedAtom),
      poolTotalClaimable: get(poolTotalClaimableAtom),
      coupons: get(couponsAtom),
      couponPremium: get(couponPremiumAtom),
      redeemable: get(redeemableAtom),
      implementation: get(implementationAtom),
      poolAddress: get(poolAddressAtom),
      pairBalanceZai,
      pairBalanceDai,
      zaiDaiRatio,
    }
  },
})

export const useZaiData = () => {
  return useRecoilValue(zaiDataSelector)
}

export const useTokenData = () => {
  return useZaiData()
}
