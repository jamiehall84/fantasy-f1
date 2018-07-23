import React, { Component } from "react";
import {
    Container,
    Header,
    Image,
    Button,
  } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import withAuthorization from '../components/withAuthorization';
import AuthUserContext from '../components/AuthUserContext';
import axios from 'axios';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class HomeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          season: null,
        };
    }

  addUser = (user) => {
    console.log(`PROPS ARE ${this.props.history}`);
    this.props.history.push('/profile');
  }

  getSeason = () => {
    axios.get(`https://ergast.com/api/f1/2018.json`)
      .then( res => {
        const season = res.data.MRData.RaceTable;
        this.setState(byPropKey('season',season));
        console.log(res);
      });
  }

  goToProfile(event){
    event.preventDefault();
    this.props.history.push('/profile');
  }
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => 
          <Container text style={{ marginTop: '7em' }}>
          <Image src='/logo.png' size='large' style={{ marginTop: '2em' }} />
            <Header as='h1'>Fanstasy F1</Header>
            <p>Hi {authUser.displayName}, this is a basic app in an effort to manage the data better.</p>
            <p>
              I'm happy to hear your thoughts on this and any ideas to take it further.
            </p>
            <p className=''>
            <Link to="/profile"> You can edit your profile here.</Link>
            </p>
            <p>
              <Button onClick={() => this.addUser(authUser)} >Add User to DB</Button>
            </p>
            <p>
              <Button onClick={() => this.getSeason()} >Get Season Data</Button>
            </p>
          </Container>
        }
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(HomeContainer);