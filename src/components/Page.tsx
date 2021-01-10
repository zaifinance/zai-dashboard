/** @jsx jsx */
import styled from '@emotion/styled'
import { rem } from 'polished'

import { PANEL_HEADER_HEIGHT } from '../components/Panel'
import { Wrapper } from '../components/Layout'

const Page = styled(Wrapper)`
  margin-top: -${rem(PANEL_HEADER_HEIGHT)};

  padding-bottom: ${rem(120)};
`

export default Page
