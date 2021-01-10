import React from 'react'
import styled from '@emotion/styled'
import { invert, rem, transparentize } from 'polished'

import { H4 } from './Elements'
import { Themed } from './Theme'

export const PANEL_HEADER_HEIGHT = 58

export const PanelContainer = styled.div<Themed>`
  width: 100%;

  background: ${(props) => transparentize(0.05, props.theme.backgroundColor)};
  /* box-shadow: 0px ${rem(4)} ${rem(8)} rgba(16, 15, 16, 0.05); */
  box-shadow: 0px ${rem(4)} ${rem(8)}
    ${(props) => transparentize(0.95, invert(props.theme.baseColor))};
  border-radius: ${rem(12)};
  /* margin-bottom: 1.33rem; */

  z-index: 2;
`

export const PanelHeader = styled.header<Themed>`
  display: flex;
  flex-flow: inherit;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.05); */
  border-bottom: 1px solid
    ${(props) => transparentize(0.95, invert(props.theme.baseColor))};

  height: ${rem(PANEL_HEADER_HEIGHT)};
`

export const PanelBody = styled.div`
  display: flex;
  flex-flow: column;

  padding: 1.25rem 1.5rem 2rem;
`

export const PanelHeading = styled(H4)<Themed>`
  margin: 0;
  font-size: ${rem(20)};
  font-weight: 500;
  text-align: center;
  color: ${(props) => props.theme.textColor};
`

interface PanelProps {
  heading?: string
  children: React.ReactNode
  css?: any
}

const Panel = ({ heading, children, ...props }: PanelProps) => {
  return (
    <PanelContainer {...props}>
      {heading ? (
        <>
          <PanelHeader>
            <PanelHeading>{heading}</PanelHeading>
          </PanelHeader>
          <PanelBody>{children}</PanelBody>
        </>
      ) : (
        children
      )}
    </PanelContainer>
  )
}

export default Panel
