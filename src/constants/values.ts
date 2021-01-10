import BigNumber from 'bignumber.js'

// eslint-disable-next-line import/prefer-default-export
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1)
export const GOVERNANCE_QUORUM = new BigNumber('0.20')
export const GOVERNANCE_PROPOSAL_THRESHOLD = new BigNumber('0.005')
export const COUPON_EXPIRATION = 365 * 48
export const DAO_EXIT_LOCKUP_EPOCHS = 240
export const POOL_EXIT_LOCKUP_EPOCHS = 144

export const DAO_EPOCH_EXPANSION = new BigNumber(0.005)
