/** @jsx jsx */
import styled from '@emotion/styled'
import { jsx, css } from '@emotion/react'
import { rem } from 'polished'

import { Text } from '../Elements'

export const CandidateWrapper = styled.div`
  --header-size: ${rem(16)};
  --text-size: ${rem(14)};
`

export const Heading = styled(Text)`
  line-height: 1;
  font-size: var(--header-size);
  margin-bottom: ${rem(8)};
  opacity: 1;
`

export const SubHeading = styled(Heading)`
  font-size: var(--text-size);
`

export const ColumnHeading = styled(SubHeading)`
  font-size: var(--header-size);
  margin-bottom: ${rem(8)};
`

export const ColumnText = styled(Text)`
  font-size: var(--text-size);
  opacity: 0.5;
`

export const ColumnFigure = ({ heading, value, right = false }) => {
  return (
    <div
      css={css`
        margin-top: ${rem(12)};
        text-align: ${right ? 'right' : 'left'};
      `}
    >
      <ColumnHeading>{heading}</ColumnHeading>
      <ColumnText>{value}</ColumnText>
    </div>
  )
}
