import React from 'react'
import BigNumber from 'bignumber.js'
import ReactTooltip from 'react-tooltip'

import { formatBN } from '../utils/number'
import { useThemeName } from './Theme'

interface FigureProps {
  num: BigNumber
  unit?: string
  round?: number
  tooltip?: any
}

const Figure = ({ num, round = 2, unit = 'ZAI', tooltip }: FigureProps) => {
  const [themeName] = useThemeName()
  return num ? (
    tooltip ? (
      <span data-tip={tooltip}>
        {formatBN(num, round)} <small>{unit}</small>
        <ReactTooltip type={themeName === 'dark' ? 'light' : 'dark'} />
      </span>
    ) : (
      <>
        {formatBN(num, round)} <small>{unit}</small>
      </>
    )
  ) : null
}

export default Figure

interface FigurePercentProps {
  value: BigNumber
  round?: number
}

export const FigurePercent = ({ value, round = 2 }: FigurePercentProps) => {
  return !value?.isNaN() ? <>{formatBN(value, round)}%</> : null
}
