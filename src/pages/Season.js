import React, { Component } from 'react';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import { withRouter } from 'react-router-dom';
import {
    Container,
    List,
    Segment,
    Dimmer,
    Loader,
    Button,
    Icon,
  } from 'semantic-ui-react'
  import PlayerList from '../components/PlayerList';

class SeasonPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          season: null,
          races: null,
          player: null,
          showPlayer: false,
        };
    }
    componentWillMount(){
        const { season } = this.props;
            this.setState(() => ({season: season }))
    }
    GetSeason = () => {
        const { season } = this.state;
        db.getSeason(season.year).then(s =>
            this.setState(() => ({season: s.val() }))
        );
    }

    viewPlayer = (player) => {
        this.props.viewPlayer(player);
        this.props.history.push(`/player`);
    }
    closePlayer = () => {
        this.setState(() => ({
            player: null,
            showPlayer: false,
         }))
    }
    viewRace = (race) => {
        this.props.viewRace(race);
        this.props.history.push(`/race`);
    }

    render(){
        const { season } = this.props;
        return(
        <AuthUserContext.Consumer>
            {authUser => 
                (season==null?
                    <Segment
                    style={{ minHeight: '100vh' }}>
                        <Dimmer active>
                            <Loader size='large' color='green'>Loading Season</Loader>
                        </Dimmer>
                    </Segment>
                :
                    <div>
                        <Container style={{ marginTop: '7em' }}>
                            <Button 
                            onClick={this.props.updateSeason} 
                            color='green'
                            icon
                            >
                                <Icon name='sync alternate' />
                                Update season
                            </Button>
                            <PlayerList season={season} addPlayer={this.GetSeason.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />
                            { !!season.races && <RaceList races={season.races} season={season.year} viewRace={this.viewRace.bind(this)} /> }
                        </Container>
                    </div>
                )
            }
        </AuthUserContext.Consumer>
        );
    }
}
const RaceList = ({ viewRace, races }) => (
    <div>
        <h2>Races this season</h2>
        <List divided relaxed>
            {Object.keys(races).map(key =>
                <List.Item key={key}>
                    <List.Icon name='flag checkered' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header onClick={(race)=>viewRace(races[key])}>{races[key].raceName}</List.Header>
                        <List.Description as='a'>{races[key].date} {races[key].time}</List.Description>
                    </List.Content>
                </List.Item>
            )}
        </List>
    </div>
);

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(SeasonPage));