import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Governance from './Governance'

import NavBar from './NavBar'

import Dashboard from './Dashboard'
import DashboardOverview from './Dashboard/Overview'

import { Top } from './Layout'
import ConnectModal from './ConnectModal'
import DAOModal from './DAOModal'
import CouponsModal from './CouponsModal'
import LiquidityModal from './LiquidityModal'
import RewardsModal from './RewardsModal'
import ProposeModal from './ProposeModal'

import ConnectedRoute from './ConnectedRoute'

import { SupplyThemeProvider, LiquidityThemeProvider } from './Theme'

import {
  useUpdateUserData,
  useUpdateUserPoolData,
  useUpdateZaiData,
} from '../hooks'

const ZaiUpdater = () => {
  useUpdateZaiData()

  return null
}

const UserUpdater = () => {
  useUpdateUserData()
  useUpdateUserPoolData()

  return null
}

const Routes = () => {
  return (
    <Router>
      <Top>
        <NavBar />
        <DashboardOverview />
      </Top>
      <MainRoutes />
    </Router>
  )
}

const MainRoutes = () => {
  return (
    <>
      <ZaiUpdater />
      <UserUpdater />
      <Switch>
        <Route path="/governance/">
          <Governance />

          <Switch>
            <ConnectedRoute path="/governance/propose">
              <ProposeModal />
            </ConnectedRoute>
          </Switch>
        </Route>

        <Route path="/dashboard">
          <Dashboard />
          <Switch>
            <ConnectedRoute path="/dashboard/dao">
              <SupplyThemeProvider>
                <DAOModal />
              </SupplyThemeProvider>
            </ConnectedRoute>
            <ConnectedRoute path="/dashboard/coupons">
              <SupplyThemeProvider>
                <CouponsModal />
              </SupplyThemeProvider>
            </ConnectedRoute>
            <ConnectedRoute path="/dashboard/liquidity">
              <LiquidityThemeProvider>
                <LiquidityModal />
              </LiquidityThemeProvider>
            </ConnectedRoute>
            <ConnectedRoute
              path={['/dashboard/rewards', '/dashboard/rewards/:panel']}
            >
              <LiquidityThemeProvider>
                <RewardsModal />
              </LiquidityThemeProvider>
            </ConnectedRoute>
          </Switch>
        </Route>

        <Route path="/">
          <Dashboard />

          <Route path="/connect">
            <ConnectModal />
          </Route>
        </Route>
      </Switch>
    </>
  )
}

export default Routes
