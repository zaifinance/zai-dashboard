import BigNumber from "bignumber.js";

/**
 * Convert 10.999 to 10999000
 */
export function toBaseUnitBN(
  rawAmt: string | number | BigNumber,
  decimals: number
): BigNumber {
  let amt = rawAmt;
  if (typeof rawAmt === "string") {
    amt = rawAmt.replaceAll(",", "");
  }
  const raw = new BigNumber(amt);
  const base = new BigNumber(10);
  const decimalsBN = new BigNumber(decimals);
  return raw.times(base.pow(decimalsBN)).integerValue();
}

/**
 * Convert 10999000 to 10.999
 */
export const toTokenUnitsBN = (
  tokenAmount: string | number | BigNumber,
  tokenDecimals: number
): BigNumber => {
  const amt = new BigNumber(tokenAmount);
  const digits = new BigNumber(10).pow(new BigNumber(tokenDecimals));
  return amt.div(digits);
};

export const isPos = (amount: BigNumber): boolean => {
  return !amount.isZero() && amount.isPositive();
};

export const ownership = (
  balance: BigNumber,
  totalSupply: BigNumber
): BigNumber => {
  return (
    balance?.multipliedBy(new BigNumber(100)).dividedBy(totalSupply ?? 1) ||
    new BigNumber(0)
  );
};

/**
 * BigNumber string formatting
 */

export const formatBN = (amount: BigNumber, position: number = 0): string => {
  if (!amount || !amount.isFinite()) {
    return "";
  }
  if (!amount || amount.isZero()) {
    return "0.00";
  }
  // if
  //   return '0.00'

  //   // return pad(
  //   //   amount.precision(position, BigNumber.ROUND_FLOOR).toFixed(),
  //   //   position,
  //   // )
  // }

  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: position,
    minimumFractionDigits: position,
  }).format(Number(amount.toFixed(position)));
};

export const formatPercent = (amount: BigNumber) => {
  if (!amount || amount.isZero()) {
    return "0.00";
  }
  return amount.toPrecision(2);
};

export const formatBNCash = (
  amount: BigNumber,
  currency: string = "USD"
): string => {
  if (amount?.isLessThan(new BigNumber(1))) {
    return pad(amount.precision(2, BigNumber.ROUND_FLOOR).toFixed(), 2);
  }
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount.toFixed(2, BigNumber.ROUND_FLOOR)));
};

function pad(bnStr, position) {
  if (!bnStr.includes(".")) {
    bnStr += ".";
  }

  const parts = bnStr.split(".");
  for (let i = 0; i < position - parts[1].length; i++) {
    bnStr += "0";
  }

  return bnStr;
}

export function formatMoney(n) {
  n = n.toPrecision(3);
  return Math.abs(Number(n)) >= 1.0e9
    ? Math.abs(Number(n)) / 1.0e9 + "B"
    : Math.abs(Number(n)) >= 1.0e6
    ? Math.abs(Number(n)) / 1.0e6 + "MM"
    : Math.abs(Number(n)) >= 1.0e3
    ? Math.abs(Number(n)) / 1.0e3 + "K"
    : Math.abs(Number(n));
}
