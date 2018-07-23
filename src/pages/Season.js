import React, { Component } from 'react';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import { Link, withRouter } from 'react-router-dom';
import {
    Container,
    Header,
    List,
    Segment,
    Dimmer,
    Loader,
    Button,
    Icon,
  } from 'semantic-ui-react'
  import PlayerList from '../components/PlayerList';
  import PlayerPage from './Player';

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
        this.setState(() => ({
            player: player,
            showPlayer: true,
         }))
    }
    closePlayer = () => {
        this.setState(() => ({
            player: null,
            showPlayer: false,
         }))
    }

    render(){
        const { season } = this.props;
        const {showPlayer, player} = this.state;
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
                        <Container text style={{ marginTop: '7em' }}>
                            <Button 
                            onClick={this.props.updateSeason} 
                            color='green'
                            icon
                            >
                                <Icon name='sync alternate' />
                                Update season
                            </Button>
                            <PlayerList season={season} addPlayer={this.GetSeason.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />
                            { !!season.races && <RaceList races={season.races} season={season.year} /> }
                        </Container>
                        {showPlayer && <PlayerPage season={season} player={player} close={this.closePlayer.bind(this)} open={showPlayer} />}
                    </div>
                )
            }
        </AuthUserContext.Consumer>
        );
    }
}
const RaceList = ({ season, races }) => (
    <div>
        <h2>Races this season</h2>
        <List divided relaxed>
            {Object.keys(races).map(key =>
                <List.Item key={key}>
                    <List.Icon name='flag checkered' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as={Link} to={`/race/${season}/${key}`}>{races[key].raceName}</List.Header>
                        <List.Description as='a'>{races[key].date} {races[key].time}</List.Description>
                    </List.Content>
                </List.Item>
            )}
        </List>
    </div>
);

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(SeasonPage));