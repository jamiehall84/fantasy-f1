import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import {
    Container,
    Segment,
    Grid,
    Header,
    Form,
    Button
  } from 'semantic-ui-react';
import * as routes from '../constants/routes';

const PasswordForgetPage = () => (
    <div>
        <h1>I forgot my damn password!</h1>
        <PasswordForgotForm />
    </div>
)

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgotForm extends Component{
    constructor(props){
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const { email } = this.state;
        auth.doPasswordReset(email)
            .then(() => {
                this.setState(() => ({...INITIAL_STATE}));
            })
            .catch(error => {
                this.setState(byPropKey('error',error));
            });
        event.preventDefault();
    }

    render() {
        const {
            email,
            error,
        } = this.state;
        const isInvalid = email === '';
        return (
            <Container style={{ marginTop: '7em' }}>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h4' color='black' textAlign='center'>I forgot my fucking password!!!</Header>
                    <Form size='large' onSubmit={this.onSubmit}>
                    <Segment stacked>
                        <Form.Input 
                        value={email}
                        onChange={event => this.setState(byPropKey('email',event.target.value))}
                        fluid icon='user' 
                        iconPosition='left' 
                        placeholder='Your E-mail address' 
                        />
                        <Button color='green' fluid size='large' type="submit" disabled={isInvalid}>
                            Sign In
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

const PasswordForgetLink = () => (
    <p>
        <Link to={routes.PASSWORD_FORGET}>I forgot my password</Link>
    </p>
);
export default PasswordForgetPage;

export {
    PasswordForgotForm,
    PasswordForgetLink,
};