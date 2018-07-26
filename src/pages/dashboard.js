import React, { Component } from "react";
import {
    Container,
    Grid
  } from 'semantic-ui-react';

import withAuthorization from '../components/withAuthorization';
import AuthUserContext from '../components/AuthUserContext';
import PlayerList from '../components/PlayerList';
import RaceList from '../components/RaceList';
import NextRace from '../components/NextRace';
import PreviousRace from '../components/PrevRace';

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
                    <PlayerList season={season} viewPlayer={this.viewPlayer.bind(this)} />
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