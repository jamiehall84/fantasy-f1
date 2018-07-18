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
        const { match: { params } } = this.props;

        db.getSeason(params.season).then(s =>
            // console.log(s.val()),
            this.setState(() => ({season: s.val() }))
        );
    }
    GetSeason = () => {
        const { season } = this.state;
        debugger;
        db.getSeason(season.year).then(s =>
            this.setState(() => ({season: s.val() }))
        );
    }

    updateSeason = () => {
        const { season } = this.state;
        // Go through each race and check for qualifying & race results.
        for (let i = 1; i < season.races.length; i++) {
            const race = season.races[i];
            if(race.QualifyingResults === undefined){
                this.getQualifying(race);
            }
            if(race.Results === undefined){
                this.getResults(race);
            }
        }
    }

    getQualifying = (race) => {
        axios.get(`http://ergast.com/api/f1/2018/${race.round}/qualifying.json`)
          .then( res => {
            const data = res.data.MRData.RaceTable;
            if(data.Races[0]!=null){
                db.doSetQualifying(race.season, race.round, data.Races[0].QualifyingResults)
                .then(() => {
                    console.log(`Qualifying for this race have been added to the database.`);
                }).catch(error => {
                    console.log(error.message);
                })
            }
          });
      }

      getResults = (race) => {
        axios.get(`http://ergast.com/api/f1/2018/${race.round}/results.json`)
          .then( res => {
            const data = res.data.MRData.RaceTable;
            if(data.Races[0]!=null){
                // Calculate points and assign a player
                var results = this.processResults(data.Races[0].Results);
                console.log(results);
                db.doSetResults(race.season, race.round, results)
                .then(() => {
                    console.log(`Results for this race have been added to the database.`);
                }).catch(error => {
                    console.log(error.message);
                })
            }
          });
      }

      processResults = (results) => {

          for (let i = 0; i < results.length; i++) {
              const result = results[i];
              result.Points = this.calculatePoints(result.grid, result.position);
              result.Player = this.findPlayerByDriverCode(result.Driver.code);
          }
          return results;
      }
      findPlayerByDriverCode = (driverCode) => {
        const players = this.state.season.Players;
        var player = players.find(this.findPlayerByDriver1, driverCode);
        if(player === undefined){
            player = players.find(this.findPlayerByDriver2, driverCode);
        }
        return player;
      }
      findPlayerByDriver1 = (player) => {
        return player.Driver1.code == this ? player :'test';
      }
      findPlayerByDriver2 = (player) => {
        return player.Driver2.code == this ? player :undefined;
    }

      calculatePoints = (grid, position) => {
        const result = position != 'R' ? (21 - parseInt(position, 10)) : 0;
        const difference = position != 'R' ? (parseInt(grid,10) - parseInt(position,10)) : (parseInt(grid,10) - 20);
        const total = (result + difference);
        const points = {
            'result': result,
            'difference': difference,
            'total': total,
        };
        return points;
    }

      render(){
          const { season } = this.state;
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
                        <Button onClick={this.updateSeason.bind(this)} color='red'>Update season</Button>
                        <PlayerList season={season} addPlayer={this.GetSeason.bind(this)} />
                        { !!season.races && <RaceList races={season.races} season={season.year} /> }
                    </Container>
                    )
                }
            </AuthUserContext.Consumer>
          );
      }
}
// const PlayerList = ({ season, addSeason }) => (
    
//     <div>
//         <Header as='h2' color='red'>Players</Header>
//         <AddPlayerForm season={season} addSeason={addSeason} />
//         {season.Players!=null?
//         <List divided relaxed>
//             {Object.keys(season.Players).map(key =>
//                 <List.Item key={key}>
//                     <List.Icon name='user' size='large' verticalAlign='middle' />
//                     <List.Content>
//                         <List.Header as={Link} to={`/players/${key}`}>{season.Players[key].Name.displayName}</List.Header>
//                         {/* <List.Description as='a'>{races[key].date} {races[key].time}</List.Description> */}
//                     </List.Content>
//                 </List.Item>
//             )}
//         </List>
//         : null}
//     </div>
// );
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