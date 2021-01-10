/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { rem } from 'polished'

import Panel, {
  PanelBody,
  PanelHeader,
  PanelHeading,
} from '../../components/Panel'
import Page from '../Page'
import { useUserGovernanceData, useZaiData } from '../../hooks'
import {
  P,
  Spacer,
  TableRow,
  Seperator,
  Button,
  TwoCol,
  Col,
} from '../Elements'
import AddressLink from '../AddressLink'

import { formatPercent } from '../../utils/number'
import { GOVERNANCE_PROPOSAL_THRESHOLD } from '../../constants/values'
import CandidateHistory from './CandidateHistory'
import CandidatePanel from './CandidatePanel'
import ConnectedRoute from '../ConnectedRoute'
import AdvanceEpoch from '../AdvanceEpoch'

const GovernancePanel = () => {
  const { implementation } = useZaiData()
  return (
    <Panel>
      <PanelHeader>
        <PanelHeading>Governance Proposals</PanelHeading>
      </PanelHeader>
      <PanelBody>
        <TableRow
          left="Current Implementation"
          right={<AddressLink address={implementation} />}
        />

        <Spacer size={48} />
        <CandidateHistory />

        <Spacer size={48} />
        <Seperator />
        <Spacer size={48} />

        <P
          css={css`
            max-width: ${rem(320)};
            text-align: center;
            margin: 0 auto;
          `}
        >
          Proposals can be discussed by submitting a pull request to the{' '}
          <a
            href="https://github.com/zaifinance/zai-protocol/pulls"
            target="_blank"
            rel="noreferrer noopener"
          >
            Zai repository
          </a>
          .
        </P>

        <Spacer size={20} />
      </PanelBody>
    </Panel>
  )
}

const Governance = () => {
  const history = useHistory()

  const { ownership, canPropose } = useUserGovernanceData()

  return (
    <Page>
      <TwoCol>
        <Switch>
          <ConnectedRoute path="/governance/candidate/:candidate">
            <Col
              css={css`
                width: 100%;
              `}
            >
              <CandidatePanel />
            </Col>
          </ConnectedRoute>
          <Route>
            <Col
              css={css`
                width: 33%;
              `}
            >
              <Panel>
                <PanelHeader>
                  <PanelHeading>Voting Wallet</PanelHeading>
                </PanelHeader>
                <PanelBody>
                  <React.Fragment>
                    <TableRow
                      left="DAO Ownership"
                      right={`${formatPercent(ownership)}%`}
                    />
                    <Spacer />
                    <Button
                      disabled={!canPropose}
                      onClick={() => history.push('/governance/propose')}
                    >
                      Propose Candidate
                    </Button>
                    <Spacer />

                    <Seperator />
                    <Spacer />

                    <TableRow
                      left="Proposal Threshold"
                      right={`${GOVERNANCE_PROPOSAL_THRESHOLD.multipliedBy(
                        100,
                      )}%`}
                    />
                  </React.Fragment>
                </PanelBody>
              </Panel>
            </Col>
            <Spacer col />
            <Col
              css={css`
                width: 66%;
              `}
            >
              <GovernancePanel />

              <Spacer />

              <AdvanceEpoch />
            </Col>
          </Route>
        </Switch>
      </TwoCol>
    </Page>
  )
}

export default Governance
