import React, { Component } from 'react';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import axios from 'axios';
import { db } from '../firebase';
import { Link, withRouter } from 'react-router-dom';
import {
    Container,
    Header,
    List,
    Segment,
    Dimmer,
    Loader,
    Button
  } from 'semantic-ui-react'
  import PlayerList from '../components/PlayerList';

class SeasonPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          season: null,
          races: null
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

    

    render(){
        const { season } = this.props;
        return(
        <AuthUserContext.Consumer>
            {authUser => 
                (season==null?
                    <Segment
                    style={{ minHeight: '100vh' }}>
                        <Dimmer active inverted>
                            <Loader size='large'>Loading Season</Loader>
                        </Dimmer>
                    </Segment>
                :
                    <Container text style={{ marginTop: '7em' }}>
                        <Header as='h1' color='red'>{season.year}</Header>
                        <Button onClick={this.props.updateSeason} color='red'>Update season</Button>
                        <PlayerList season={season} addPlayer={this.GetSeason.bind(this)} />
                        { !!season.races && <RaceList races={season.races} season={season.year} /> }
                    </Container>
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