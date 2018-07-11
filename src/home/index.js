import React, { Component } from "react";
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Button,
  } from 'semantic-ui-react'
  import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'
  import app from '../base'

class HomeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
    }
  ComponentWillMount() {
      
  }
  goToProfile(event){
    event.preventDefault();
    this.props.history.push('/profile');
  }
  handleClick(){
    app.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }
  render() {
    return (
      <Container text style={{ marginTop: '7em' }}>
      <Image src='/logo.png' size='large' style={{ marginTop: '2em' }} />
        <Header as='h1'>Fanstasy F1</Header>
        <p>Hi {this.props.user.displayName}, this is a basic app in an effort to manage the data better.</p>
        <p>
          I'm happy to hear your thoughts on this and any ideas to take it further.
        </p>
        <p className=''>
        <Link to="/profile"> You can edit your profile here.</Link>
        </p>
      </Container>
    );
  }
}

export default HomeContainer;