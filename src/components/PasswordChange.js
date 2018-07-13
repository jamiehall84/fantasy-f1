import React, { Component } from 'react';
import { auth } from '../firebase';
import {
    Container,
    Image,
    Segment,
    Grid,
    Header,
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
            <Container style={{ marginTop: '7em' }}>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Image src='/logo.png'size='small' centered /> 
                    <Header as='h2' color='black' textAlign='center'>Reset My Password</Header>
                    <Form size='large' onSubmit={this.onSubmit}>
                    <Segment stacked>
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
                        <Button color='red' fluid size='large' type="submit" disabled={isInvalid}>
                        Reset My Password
                        </Button>
                        { error && error.message }
                    </Segment>
                    </Form>
                </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export default PasswordChangeForm;