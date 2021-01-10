import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useUser } from '../hooks'

const ConnectedRoute = ({ children, ...props }) => {
  let user = useUser()
  return (
    <Route
      {...props}
      render={({ location }) => {
        return user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/connect',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}

export default ConnectedRoute
