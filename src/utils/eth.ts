export const formatAddress = (address: string) => {
  return address
    ? `${address.substr(0, 6)}...${address.substr(address.length - 4)}`
    : ''
}

export const etherscanLink = (type, hashOrAddress) => {
  return `https://etherscan.io/${type}/${hashOrAddress}`
}
