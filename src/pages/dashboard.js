import React, { Component } from "react";
import {
    Container,
    Grid,
    Header,
    Message,
  } from 'semantic-ui-react';

import withAuthorization from '../components/withAuthorization';
import AuthUserContext from '../components/AuthUserContext';
import PlayerList from '../components/PlayerList';
import RaceList from '../components/RaceList';
import NextRace from '../components/NextRace';
import PreviousRace from '../components/PrevRace';
import PlayerProgressGraph from '../components/PlayerProgressGraph';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          season: null,
        };
    }
    viewPlayer = (player) => {
        this.props.viewPlayer(player);
        this.props.history.push(`/player`);
    }

    viewRace = (race) => {
        this.props.viewRace(race);
        this.props.history.push(`/race`);
    }
    
    render() {
        const { season } = this.props;
        return (
            <AuthUserContext.Consumer>
            {authUser => 
                <Container style={{ marginTop: '7em' }}>
                    <Message
                        color='green'>
                        <Message.Header>Hi {authUser.displayName}</Message.Header>
                        <p>Welcome to the Fantasy F1 app. This is still a bit of a work in progress, so I'm hoping that you will let me know if you spot anything that is not working as you would expect it to. Likewise, if you think of any cool features, let me know and I will see if I can get it added in. Enjoy!!</p>
                    </Message>
                    <Header as='h1' color='green'></Header>
                    <PlayerProgressGraph user={authUser} season={season}/>
                    <PlayerList season={season} viewPlayer={this.viewPlayer.bind(this)} user={authUser} />
                    <Grid columns={2} stackable style={{marginTop: '1em', marginBottom: '1em' }} >
                        <Grid.Row>
                            <Grid.Column>
                                <PreviousRace season={season} viewRace={this.viewRace.bind(this)} user={authUser} />
                            </Grid.Column>
                            <Grid.Column>
                                <NextRace season={season} viewRace={this.viewRace.bind(this)} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <RaceList season={season} viewRace={this.viewRace.bind(this)} style={{marginTop: '1em', marginBottom: '1em' }} />
                </Container>
            }
        </AuthUserContext.Consumer>
        );
    }
}

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(Dashboard);