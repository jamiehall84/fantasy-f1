import React, { Component } from 'react';
import {
    Menu,
    Icon,
  } from 'semantic-ui-react';
  import { Link } from 'react-router-dom';
  import SignOutButton  from './SignOut';
  import AuthUserContext from './AuthUserContext';
  import * as routes from '../constants/routes';
  import { firebase } from '../firebase';
  class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player: null,
            driver1Result: null,
            driver2Result: null,
        }
    }
      render(){
        var user = firebase.auth.currentUser;
          return(
            <AuthUserContext.Consumer>
                { authUser => authUser
                    ? 
                    <div>
                        <Menu.Item as={Link} to={routes.HOME} >
                            <Icon name='home' />
                            Home
                        </Menu.Item>
                        <Menu.Item as={Link} to={routes.ACCOUNT}>
                            <Icon name='user' />
                            Profile
                        </Menu.Item>
                        {user.email=='jamiehall84@gmail.com'&&
                            <Menu.Item as={Link} to={routes.ADMIN}>
                                <Icon name='user' />
                                Admin
                            </Menu.Item>
                        }
                        <SignOutButton />
                </div>
                    
                    : <NavigationNonAuth />
                }
                
            </AuthUserContext.Consumer>
          );
      }

  }


const NavigationAuth = (user) =>
  <div>
        <Menu.Item as={Link} to={routes.HOME} >
            <Icon name='home' />
            Home
        </Menu.Item>
        <Menu.Item as={Link} to={routes.ACCOUNT}>
            <Icon name='user' />
            Profile
        </Menu.Item>
        {user.uid=='pbxPXDuUv5Pj8rwwBWmm3JOmhqo2'&&
            <Menu.Item as={Link} to={routes.ADMIN}>
                <Icon name='user' />
                Admin
            </Menu.Item>
        }
        <SignOutButton />
  </div>

const NavigationNonAuth = () =>
  <div>
      <Menu.Item as={Link} to={routes.LANDING}>
            <Icon name='home' />
            Home
        </Menu.Item>
      <Menu.Item as={Link} to={routes.SIGN_IN} >
            <Icon name='log out' />
            Log in
        </Menu.Item>
  </div>

export default Navigation;