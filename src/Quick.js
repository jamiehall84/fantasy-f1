import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { db } from './firebase';
import axios from 'axios';
import Login from './login'
import AccountPage from './components/Account';
import PasswordForgetPage from './components/PasswordForget';
import {
    Container,
    Image,
    Menu,
    Icon,
    Segment,
    Sidebar,
    Dimmer,
    Loader,
  } from 'semantic-ui-react';
import * as routes from './constants/routes';
import withAuthentication from './components/withAuthentication';
import Navigation from './components/Navigation';
import AdminPage from './pages/Admin';
import Race from './pages/Race';
import SeasonPage from './pages/Season';
import PlayerPage from './pages/Player';
import LandingPage from './pages/landing';


class App extends React.Component {
    state = { 
        visible: false,
        loading: true,
        season: null,
        race: null,
        player: null,
        driver: null
    };
    componentDidMount(){
        const season = (new Date()).getFullYear();
        db.getSeason(season).then(s =>
            this.setState(() => (
                {
                    season: s.val(),
                    loading:false,
                 }
            ))
        );
    }
    GetSeason = () => {
        const { season } = this.state;
        db.getSeason(season.year).then(s =>
            this.setState(() => (
                {
                    season: s.val(),
                    loading: false,
                }
            ))
        );
    }

    updateSeason = () => {
        this.setState(() => ({loading: true }))
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
            var totalPoints = 0;
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
                        'raceRound': race.round,
                        'Driver1': driver1,
                        'Driver2': driver2,
                        'Total': total
                    }
                    totalPoints = totalPoints + total.total;
                    
                }
            }
            player.total = totalPoints;
            db.doUpdatePlayer(season.year, i, player);
            console.log(player);
        }
        this.GetSeason();
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
            var results = this.processResults(data.Races[0], race.QualifyingResults);
            db.doSetResults(race.season, race.round, results)
            .then(() => {
                console.log(`Results for this race have been added to the database.`);
            }).catch(error => {
                console.log(error.message);
            })
        }
        });
    }

    processResults = (race, QualifyingResults) => {
        const results = race.Results
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            
            result.qualifyingPosition = this.getDriverQualifyingPosition(result.Driver.code, QualifyingResults);
            result.Points = this.calculatePoints(result.qualifyingPosition, result.position, result.positionText);
            result.Player = this.findPlayerByDriverCode(result.Driver.code);
        }
        return results;
    }
    getDriverQualifyingPosition = (driverCode, qualifyingResults) => {
        var result = qualifyingResults.filter(d => {
            return d.Driver.code === driverCode
            });
        return result[0].position;
    }
    findPlayerByDriverCode = (driverCode) => {
    const players = this.state.season.Players;
    var result = players.filter(p => {
        return p.Driver1.code === driverCode || p.Driver2.code === driverCode
        });
    return result[0];
    }

    calculatePoints = (qualifyingPosition, position, positionText) => {
        const result = positionText !== 'R' ? (21 - parseInt(position, 10)) : 0;
        const difference = positionText !== 'R' ? (parseInt(qualifyingPosition,10) - parseInt(position,10)) : (parseInt(qualifyingPosition,10) - 20);
        const total = (result + difference);
        const points = {
            'result': result,
            'difference': difference,
            'total': total,
        };
        return points;
    }

    viewRace = (race) => {
        this.setState({ race: race });
    }
    viewPlayer = (player) => {
        this.setState({ player: player });
    }
    handleButtonClick = () => this.setState({ visible: !this.state.visible })
    handleSidebarHide = () => this.setState({ visible: false })

    render() {
        const { visible, season,race,player,driver, loading } = this.state
        return (
        <Router>
            <div>                
                <Sidebar.Pushable as={Segment} style={{ transform: 'none' }}>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={this.handleSidebarHide}
                        vertical
                        visible={visible}
                        width='thin'
                    >
                    <Navigation onClick={this.handleSidebarHide.bind(this)} />
                    </Sidebar>

                    <Sidebar.Pusher 
                    dimmed={visible}
                    style={{ minHeight: '100vh' }}>
                        <Menu fixed='top' inverted>
                            <Container>
                                <Menu.Item as='a' header>
                                <Image size='mini' src='/icon.png' style={{ marginRight: '1.5em' }} />
                                Fantasy F1
                                </Menu.Item>
                                <Menu.Item as='a' onClick={this.handleButtonClick}>
                                    <Icon name='bars' />
                                </Menu.Item>
                            </Container>
                        </Menu>
                        {loading?
                            <Segment
                            style={{ minHeight: '100vh' }}>
                                <Dimmer active inverted>
                                    <Loader size='large'>Loading Season</Loader>
                                </Dimmer>
                            </Segment>
                        :
                        <div>
                            <Route exact path={routes.LANDING} component={()=> <LandingPage season={season} viewRace={this.viewRace.bind(this)} />} />
                            <Route exact path={routes.SIGN_IN} component={()=> <Login />} />
                            <Route exact path={routes.HOME} component={()=> <SeasonPage season={season} updateSeason={this.updateSeason.bind(this)} viewRace={this.viewRace.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />} />
                            <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
                            <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
                            <Route exact path={routes.ADMIN} component={() => <AdminPage />} />
                            <Route exact path={routes.SEASON} component={() => <SeasonPage season={season} updateSeason={this.updateSeason.bind(this)} viewRace={this.viewRace.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />} />
                            <Route exact path={routes.RACE} component={()=> <Race season={season} race={race} />}  />
                            <Route exact path={routes.PLAYER} component={()=> <PlayerPage season={season} player={player} viewRace={this.viewRace.bind(this)} />} />
                        </div>
                        }
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                
                
        

            
            </div>
        </Router>
        )
    }
}
export default withAuthentication(App)