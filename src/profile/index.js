import React from 'react'
import {Container, Grid, Header, Form, Segment, Button, Icon} from 'semantic-ui-react'
import { withRouter } from "react-router-dom";

class Profile extends React.Component{
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            displayName: props.user.displayName
        };
    }
    
    handleChange(e){
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }
    // onSubmit= () =>{
    //     const user = app.auth().currentUser;
    //     user.updateProfile({
    //         displayName: this.state.displayName
    //       }).then(function() {
    //         // Update successful.
    //         this.props.history.push('/');
    //       }).catch(function(error) {
    //         // An error happened.
    //         console.log(error);
    //       });
    // }
    render(){
        return(
            <Container style={{ marginTop: '7em' }}>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='black' textAlign='center'>
                Your Profile
                </Header>
                <Form size='large' onSubmit={this.onSubmit}>
                <Segment stacked>
                    <Form.Field>
                        <label>Display Name</label>
                        <input placeholder='Your Name' name='displayName' value={this.state.displayName} onChange={this.handleChange.bind(this)} />
                    </Form.Field>
                    <Button color='red' fluid size='large' type="submit">
                        <Icon name='save' /> Save
                    </Button>
                </Segment>
                </Form>
            </Grid.Column>
            </Grid>
            </Container>
        )
    };
}

export default withRouter(Profile);