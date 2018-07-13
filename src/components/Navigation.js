import React from 'react';
import {
    Menu,
    Icon,
  } from 'semantic-ui-react';
  import { Link } from 'react-router-dom';
  import SignOutButton  from './SignOut';
  import AuthUserContext from './AuthUserContext';
  import * as routes from '../constants/routes';

const Navigation = () =>
<AuthUserContext.Consumer>
    { authUser => authUser
        ? <NavigationAuth />
        : <NavigationNonAuth />
    }
</AuthUserContext.Consumer>

const NavigationAuth = () =>
  <div>
      <Menu.Item as={Link} to={routes.HOME}>
          <Icon name='home' />
          Home
      </Menu.Item>
      <Menu.Item as={Link} to={routes.ACCOUNT}>
          <Icon name='user' />
          Profile
      </Menu.Item>
      <SignOutButton />
  </div>

const NavigationNonAuth = () =>
  <div>
      <Menu.Item as={Link} to={routes.SIGN_IN} >
            <Icon name='log out' />
            Log in
        </Menu.Item>
  </div>

export default Navigation;