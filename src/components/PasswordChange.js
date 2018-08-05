import React, { Component } from 'react';
import { auth } from '../firebase';
import {
    Card,
    Form,
    Button
  } from 'semantic-ui-react';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props){
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { passwordOne } = this.state;
        auth.doPasswordUpdate(passwordOne)
            .then(()=> {
                this.setState(() => ({...INITIAL_STATE}));
            })
            .catch(error => {
                this.setState(byPropKey('error',error));
            });
        event.preventDefault();
    }

    render(){
        const {
            passwordOne,
            passwordTwo,
            error,
        } = this.state;
        const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

        return(
            <Card fluid>
                <Card.Content>
                    <Card.Header>Change my password</Card.Header>
                    <Card.Description>
                        <Form size='large' onSubmit={this.onSubmit}>
                            <Form.Input 
                            value={passwordOne}
                            onChange={event => this.setState(byPropKey('passwordOne',event.target.value))}
                            type='password'
                            fluid icon='user' 
                            iconPosition='left' 
                            placeholder='Your new password' 
                            />
                            <Form.Input 
                            value={passwordTwo}
                            onChange={event => this.setState(byPropKey('passwordTwo',event.target.value))}
                            type='password'
                            fluid icon='user' 
                            iconPosition='left' 
                            placeholder='Confirm your new password' 
                            />
                            <Button color='green' fluid size='large' type="submit" disabled={isInvalid}>
                            Reset My Password
                            </Button>
                            { error && error.message }
                        </Form>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }
}

export default PasswordChangeForm;