/** @jsx jsx */
import { jsx } from '@emotion/react'

import Panel, {
  PanelBody,
  PanelHeader,
  PanelHeading,
} from '../../components/Panel'

import Candidate from '../Candidate'

const CandidatePanel = () => {
  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>Candidate</PanelHeading>
      </PanelHeader>
      <PanelBody>
        {/* <TableRow
          left="Candidate Implementation"
          right={<AddressLink address={implementation} />}
        /> */}

        <Candidate />
      </PanelBody>
    </Panel>
  )
}
export default CandidatePanel
