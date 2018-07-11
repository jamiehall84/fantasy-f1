import React from 'react'
import { Container, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'


const LoginView = ({onSubmit}) => {
    return(
        <div className='login-form'>
            <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
                height: 100%;
            }
            `}</style>
            <Container style={{ marginTop: '7em' }}>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Image src='/logo.png'size='small' centered /> 
                <Header as='h2' color='black' textAlign='center'>
                
                Log-in to your Fantasy F1 account
                </Header>
                <Form size='large' onSubmit={onSubmit}>
                <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Your E-mail address' name='email' />
                    <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Your super secure password'
                    type='password'
                    name='password' />

                    <Button color='red' fluid size='large' type="submit">
                    Login
                    </Button>
                </Segment>
                </Form>
            </Grid.Column>
            </Grid>
            </Container>
        </div>
    );
};
export default LoginView;