import React from 'react';
import AuthUserContext from './AuthUserContext';
import { PasswordForgotForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from '../components/withAuthorization';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => 
            <div>
                <h1>Account: {authUser.email}</h1>
                <PasswordForgotForm />
                <PasswordChangeForm />
            </div>
        }
    </AuthUserContext.Consumer>
);

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(AccountPage);