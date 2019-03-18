import React, { Component } from 'react';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import axios from 'axios';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {
    Container,
    Header,
    List,
    Button,
  } from 'semantic-ui-react';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          seasons: null,
          races: null
        };
    }
    componentWillMount(){
        db.getSeasons().then(s =>
            this.setState(() => ({seasons: s.val() }))
        );
        db.getRaces(2018).then(races =>
            this.setState(() => ({races: races.val() }))
        );
    }
    getSeason = () => {
        axios.get(`https://ergast.com/api/f1/2019.json`)
          .then( res => {
            const season = res.data.MRData.RaceTable;
            db.doCreateSeason(season.season)
                .then(() => {
                    console.log(`season ${season.season} has been added to the database.`);
                    for (let index = 0; index < season.Races.length; index++) {
                        db.doCreateRace(
                            season.season,
                            season.Races[index].Circuit,
                            season.Races[index].date,
                            season.Races[index].raceName,
                            season.Races[index].round,
                            season.Races[index].time,
                            season.Races[index].season,
                            season.Races[index].url,
                            null,
                            null,
                            null
                        )
                        
                            .then(() => {
                                console.log(`${season.Races[index].raceName} has been added to the database.`);
                                this.getQualifying(season.Races[index]);
                                this.getResults(season.Races[index]);
                            }).catch(error => {
                                console.log(error.message);
                            })
                            this.setState(() => ({races: season.Races }))
                    }

                })
                .catch(error => {
                    console.log(error.message);
                });
          });
      }
      getQualifying = (race) => {
        axios.get(`https://ergast.com/api/f1/2019/${race.round}/qualifying.json`)
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
        axios.get(`https://ergast.com/api/f1/2019/${race.round}/results.json`)
          .then( res => {
            const data = res.data.MRData.RaceTable;
            if(data.Races[0]!=null){
                db.doSetResults(race.season, race.round, data.Races[0].Results)
                .then(() => {
                    console.log(`Results for this race have been added to the database.`);
                }).catch(error => {
                    console.log(error.message);
                })
            }
          });
      }
      getDrivers = () => {
        axios.get(`https://ergast.com/api/f1/2019/drivers.json`)
          .then( res => {
            const data = res.data.MRData.DriverTable.Drivers;
            if(data[0]!=null){
                db.doSetDrivers(2019, data)
                .then(() => {
                    console.log(`Drivers for this season have been added to the database.`);
                }).catch(error => {
                    console.log(error.message);
                })
            }
          });
      }
      createSeason = (year) => {
          if(!isNaN(year)){
            db.doCreateSeason(year);
          }

      }
      render(){
          const { seasons } = this.state;
          return(
            <AuthUserContext.Consumer>
                {authUser => 
                    <Container text style={{ marginTop: '7em' }}>
                        <Header as='h1'>Fanstasy F1 Admin</Header>
                        { !!seasons && <SeasonList seasons={seasons} /> }
                        {/* { !!races && <RaceList races={races} /> } */}
                        <p>
                            <Button onClick={() => this.getSeason()} >Get Season Data</Button>
                            {/* <Button onClick={() => this.createSeason(2019)} >Create 2019 Season</Button> */}
                            <Button onClick={() => this.getDrivers()} color='red' >Get Season Drivers</Button>
                        </p>
                    </Container>
                }
            </AuthUserContext.Consumer>
          );
      }
}

const SeasonList = ({ seasons }) => (
    <div>
        <h2>Season List</h2>
        <List divided relaxed>
            {Object.keys(seasons).map(key =>
                <List.Item key={key}>
                    <List.Icon name='flag checkered' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as={Link} to={`/season/${seasons[key].year}`} >{seasons[key].year}</List.Header>
                        <List.Description as='a'>
                            
                        </List.Description>
                    </List.Content>
                </List.Item>
            )}
        </List>
    </div>
);

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(AdminPage);