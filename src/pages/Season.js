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
        // Go though each player and update their points
        for(let i=0; i < season.Players.length; i++){
            var player = season.Players[i];
            if(player.Points === undefined){
                player.Points = [];
                player.total = 0;
            }
            for(let r = 1; r < season.races.length; r++){
                const race = season.races[r];
                if(race.Results !== undefined){
                    var d1 = race.Results.filter(res => {
                            return res.Driver.code === player.Driver1.code
                        }
                    );
                    var d2 = race.Results.filter(res => {
                            return res.Driver.code === player.Driver2.code
                        }
                    );
                    var driver1 = {
                        'code': d1[0].Driver.code,
                        'grid': d1[0].grid,
                        'position': d1[0].position,
                        'result': d1[0].Points.result,
                        'difference': d1[0].Points.difference,
                        'total': d1[0].Points.total
                    }
                    var driver2 = {
                        'code': d2[0].Driver.code,
                        'grid': d2[0].grid,
                        'position': d2[0].position,
                        'result': d2[0].Points.result,
                        'difference': d2[0].Points.difference,
                        'total': d2[0].Points.total
                    }
                    var total = {
                        'result': d1[0].Points.result + d2[0].Points.result,
                        'difference': d1[0].Points.difference + d2[0].Points.difference,
                        'total': (d1[0].Points.result + d2[0].Points.result) + (d1[0].Points.difference + d2[0].Points.difference)
                    }
                    
                    player.Points[r] = {
                        'raceName': race.raceName,
                        'Driver1': driver1,
                        'Driver2': driver2,
                        'Total': total
                    }
                    player.total = player.total + total.total;
                    
                }
            }
            db.doUpdatePlayer(season.year, i, player);
            console.log(player);
        }
    }

    getQualifying = (race) => {
        axios.get(`https://ergast.com/api/f1/2018/${race.round}/qualifying.json`)
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
    axios.get(`https://ergast.com/api/f1/2018/${race.round}/results.json`)
        .then( res => {
        const data = res.data.MRData.RaceTable;
        if(data.Races[0]!=null){
            var results = this.processResults(data.Races[0].Results);
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
    var result = players.filter(p => {
        return p.Driver1.code === driverCode || p.Driver2.code === driverCode
        });
    return result[0];
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