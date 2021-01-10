/* eslint-disable camelcase */
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

import { notify } from './txNotifier'
import { UniswapV2Router02 } from '../constants/contracts'

import { ZAI, DAI } from '../constants/tokens'

declare global {
  interface Window {
    ethereum: any
    web3?: Web3
    darkMode: boolean
  }
}

const uniswapRouterAbi = require('../constants/abi/UniswapV2Router02.json')
const erc20Abi = require('../constants/abi/ERC20.json')
const daoAbi = require('../constants/abi/Implementation.json')
const poolAbi = require('../constants/abi/Pool.json')

const DEADLINE_FROM_NOW = 60 * 15
const UINT256_MAX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

let web3
// eslint-disable-next-line no-undef
if ((window as any).ethereum !== undefined) {
  // eslint-disable-next-line no-undef
  web3 = new Web3((window as any).ethereum)
}

/**
 * Connection Utilities
 */

export const updateModalMode = async (theme) => {
  window.darkMode = theme === 'dark'
}

export const connect = async () => {
  // window.web3 = new Web3(window.ethereum)
  let addresses = await web3.eth.getAccounts()
  if (!addresses.length) {
    try {
      addresses = await window.ethereum.enable()
    } catch (e) {
      console.log(e)
      return false
    }
  }

  return addresses.length ? addresses[0].toLowerCase() : null
}

// const tx = await fakeApprove(5000)

// eslint-disable-next-line consistent-return
export const checkConnectedAndGetAddress = async () => {
  let addresses = await web3?.eth?.getAccounts()
  if (!addresses?.length) {
    try {
      addresses = await window.ethereum.enable()
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return addresses[0]
}

/**
 * ERC20 Utilities
 */
type TxCallback = (string) => void

export const approve = async (tokenAddr, spender, cb?: TxCallback) => {
  const account = await checkConnectedAndGetAddress()
  const oToken = new web3.eth.Contract(erc20Abi, tokenAddr)
  await oToken.methods
    .approve(spender, UINT256_MAX)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

/**
 * Uniswap Protocol
 */

export const buyZAI = async (buyAmount, maxInputAmount) => {
  const account = await checkConnectedAndGetAddress()
  const router = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

  console.log(
    'Gas required',
    Web3.utils.fromWei(
      await router.methods
        .swapTokensForExactTokens(
          buyAmount,
          maxInputAmount,
          [DAI.addr, ZAI.addr],
          account,
          deadline,
        )
        .estimateGas(),
    ),
  )

  // .send({ from: account })
  // .on('transactionHash', (hash) => {
  //   notify.hash(hash)
  // })
}

export const sellZAI = async (sellAmount, minOutputAmount) => {
  const account = await checkConnectedAndGetAddress()
  const router = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

  await router.methods
    .swapExactTokensForTokens(
      sellAmount,
      minOutputAmount,
      [ZAI.addr, DAI.addr],
      account,
      deadline,
    )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
    })
}

export const addLiquidity = async (amountZAI, amountDAI, slippage) => {
  const account = await checkConnectedAndGetAddress()
  const router = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW
  const slippageBN = new BigNumber(slippage)
  const minAmountZAI = new BigNumber(amountZAI)
    .multipliedBy(new BigNumber(1).minus(slippageBN))
    .integerValue(BigNumber.ROUND_FLOOR)
  const minAmountDAI = new BigNumber(amountDAI)
    .multipliedBy(new BigNumber(1).minus(slippageBN))
    .integerValue(BigNumber.ROUND_FLOOR)

  await router.methods
    .addLiquidity(
      ZAI.addr,
      DAI.addr,
      new BigNumber(amountZAI).toFixed(),
      new BigNumber(amountDAI).toFixed(),
      minAmountZAI,
      minAmountDAI,
      account,
      deadline,
    )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
    })
}

export const removeLiquidity = async (
  liquidityAmount,
  minAmountZAI,
  minAmountDAI,
) => {
  const account = await checkConnectedAndGetAddress()
  const router = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02)
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

  await router.methods
    .removeLiquidity(
      ZAI.addr,
      DAI.addr,
      new BigNumber(liquidityAmount).toFixed(),
      new BigNumber(minAmountZAI).toFixed(),
      new BigNumber(minAmountDAI).toFixed(),
      account,
      deadline,
    )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
    })
}

/**
 * Døllar Protocol
 */

export const advance = async (dao) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .advance()
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
    })
}

export const deposit = async (dao, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .deposit(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const withdraw = async (dao, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .withdraw(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const bond = async (dao, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .bond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const unbond = async (dao, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .unbond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const unbondUnderlying = async (dao, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .unbondUnderlying(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const purchaseCoupons = async (dao, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .purchaseCoupons(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const redeemCoupons = async (dao, epoch, amount, cb = undefined) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .redeemCoupons(epoch, new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      cb ? cb(hash) : notify.hash(hash)
    })
}

export const recordVote = async (dao, candidate, voteType) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .vote(candidate, voteType)
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
    })
}

export const commit = async (dao, candidate) => {
  const account = await checkConnectedAndGetAddress()
  const daoContract = new web3.eth.Contract(daoAbi, dao)
  return await daoContract.methods
    .commit(candidate)
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
    })
}

/* UNI-V2 Incentivization Pool */
export const depositPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress()
  const poolContract = new web3.eth.Contract(poolAbi, pool)
  return await poolContract.methods
    .deposit(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
      callback(hash)
    })
}

export const withdrawPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress()
  const poolContract = new web3.eth.Contract(poolAbi, pool)
  return await poolContract.methods
    .withdraw(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
      callback(hash)
    })
}

export const bondPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress()
  const poolContract = new web3.eth.Contract(poolAbi, pool)
  return await poolContract.methods
    .bond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
      callback(hash)
    })
}

export const unbondPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress()
  const poolContract = new web3.eth.Contract(poolAbi, pool)
  return await poolContract.methods
    .unbond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
      callback(hash)
    })
}

export const claimPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress()
  const poolContract = new web3.eth.Contract(poolAbi, pool)
  return await poolContract.methods
    .claim(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
      callback(hash)
    })
}

export const providePool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress()
  const poolContract = new web3.eth.Contract(poolAbi, pool)
  return await poolContract.methods
    .provide(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash)
      callback(hash)
    })
}
