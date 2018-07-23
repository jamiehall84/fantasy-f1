import React, { Component } from "react";
import {
    Container,
    Header,
    Image,
    Segment,
    Dimmer,
    Loader,
  } from 'semantic-ui-react';
import { db } from '../firebase';
import withAuthorization from '../components/withAuthorization';
import AuthUserContext from '../components/AuthUserContext';
import axios from 'axios';
import PlayerList from '../components/PlayerList';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          season: null,
        };
    }
    componentDidMount(){
        const season = (new Date()).getFullYear();
        db.getSeason(season).then(s =>
            this.setState(() => ({season: s.val() }))
        );
    }

    addUser = (user) => {
        console.log(`PROPS ARE ${this.props.history}`);
        this.props.history.push('/profile');
    }

    getSeason = () => {
        axios.get(`http://ergast.com/api/f1/2018.json`)
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
        const { season } = this.state;
        return (
        <AuthUserContext.Consumer>
            {authUser => 
            ( season==null ?
                <Segment style={{ minHeight: '100vh' }}>
                    <Dimmer active inverted>
                        <Loader size='large'>Loading Season</Loader>
                    </Dimmer>
                </Segment>
            :
                <Container style={{ marginTop: '7em' }}>
                <Image src='/logo.png' size='large' style={{ marginTop: '2em' }} />
                <Header as='h1'>Fanstasy F1</Header>
                    <p>Hi {authUser.displayName}, this is a basic app in an effort to manage the data better.</p>
                    <p>
                    I'm happy to hear your thoughts on this and any ideas to take it further.
                    </p>
                    <PlayerList season={season} />
                </Container>
            )
            }
        </AuthUserContext.Consumer>
        );
    }
}

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(Dashboard);