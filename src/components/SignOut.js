import React from 'react';
import { auth } from '../firebase';
import { Menu, Icon } from '../../node_modules/semantic-ui-react';
const SignOutButton = () => (
<Menu.Item as='a'onClick={auth.doSignOut}>
    <Icon name='log out' />
    Sign Out
</Menu.Item>
)
export default SignOutButton;