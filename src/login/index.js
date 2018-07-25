import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { Container, Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { PasswordForgetLink } from '../components/PasswordForget';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});
const INITIAL_STATE = {
  email:'',
  password:'',
  error: null,
};

class LoginContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }
  onSubmit = (event) => {
    const {
      email,
      password
    } = this.state;
    const {history,} = this.props;
    auth.doSignInWithEmailAndPassword(email,password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
      event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;
    const isInvalid = 
      password === ''||
      email === '';
    
    return(
      <Container style={{ marginTop: '7em' }}>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Image src='/logo.png'size='small' centered /> 
            <Header as='h2' color='black' textAlign='center'>Log-in to your Fantasy F1 account</Header>
            <Form size='large' onSubmit={this.onSubmit}>
              <Segment stacked>
                  <Form.Input 
                  value={email}
                  onChange={event => this.setState(byPropKey('email',event.target.value))}
                  fluid icon='user' 
                  iconPosition='left' 
                  placeholder='Your E-mail address' 
                   />
                  <Form.Input
                  value={password}
                  onChange={event => this.setState(byPropKey('password',event.target.value))}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Your super secure password'
                  type='password'
                  name='password' />

                  <Button color='green' fluid size='large' type="submit" disabled={isInvalid}>
                    Sign In
                  </Button>
                  <PasswordForgetLink />
                  { error && error.message }
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(LoginContainer);