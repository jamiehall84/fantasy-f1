import React from "react";
import { Route, Redirect } from "react-router-dom";


function AuthRoute ({component: Component, authed, user, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component authed={authed} user={user} {...rest} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}
  
  export default AuthRoute