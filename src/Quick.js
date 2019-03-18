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
import Dashboard from './pages/dashboard'
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
		driver: null,
		me: null,
	};

	componentDidMount(){
		const year = new Date().getFullYear();
			
		db.getSeason(year).then(s =>
			this.setState({
				year: year,
				season: s.val(),
				loading:false
			})
		);
	}


	SwitchSeasons = (year) => {
		this.setState({year: year}, this.GetSeason);
	}

	GetSeason = () => {
		const { year } = this.state;
		db.getSeason(year)
			.then(season =>
				this.setState({
					season: season.val(),
					loading: false
				})
			)
			.catch(err => console.log(err));
	}
	
	updateSeason = () => {
		this.setState({loading: true });
		const { season } = this.state;
		// Go through each race and check for qualifying & race results.
		for (let i = 1; i < season.races.length; i++) {
			const race = season.races[i];
			const raceDate = new Date(race.date);
			if(raceDate < new Date()){
				if(race.QualifyingResults === undefined){
					this.getQualifying(race);
				}
				if(race.Results === undefined){
					this.getResults(race);
				}
			}
		}
		// Go though each player and update their points
		for(let i=0; i < season.Players.length; i++){
			let player = season.Players[i];
			let totalPoints = 0;
			if(player.Points === undefined){
				player.Points = [];
				player.total = 0;
			}
				
			for(let r = 1; r < season.races.length; r++){
				const race = season.races[r];
				if(race.Results !== undefined){
					let d1 = race.Results.find(x => x.Driver.code === player.Driver1.code );
					let d2 = race.Results.find(x => x.Driver.code === player.Driver2.code );
					let driver1 = {
						'code': d1.Driver.code,
						'grid': d1.grid,
						'position': d1.position,
						'result': d1.Points.result,
						'difference': d1.Points.difference,
						'total': d1.Points.total
					};
					let driver2 = {
						'code': d2.Driver.code,
						'grid': d2.grid,
						'position': d2.position,
						'result': d2.Points.result,
						'difference': d2.Points.difference,
						'total': d2.Points.total
					};
					let total = {
						'result': d1.Points.result + d2.Points.result,
						'difference': d1.Points.difference + d2.Points.difference,
						'total': (d1.Points.result + d2.Points.result) + (d1.Points.difference + d2.Points.difference)
					}
					
					player.Points[r] = {
						'raceName': race.raceName,
						'raceRound': race.round,
						'Driver1': driver1,
						'Driver2': driver2,
						'Total': total
					};
					totalPoints = totalPoints + total.total;
				}
			}
			player.total = totalPoints;
			db.doUpdatePlayer(season.year, i, player);
			console.log(player);
		}
		this.GetSeason();
	}

	getQualifying = async(race) => {
		console.log(`getting qualifying results for race ${race.round} of ${this.state.season.year}`);
		axios.get(`https://ergast.com/api/f1/${this.state.season.year}/${race.round}/qualifying.json`)
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

	getResults = async(race) => {
		console.log(`getting race results for race ${race.round} of ${this.state.season.year}`);
		axios.get(`https://ergast.com/api/f1/${this.state.season.year}/${race.round}/results.json`)
			.then( res => {
				const data = res.data.MRData.RaceTable;
				if(data.Races[0]!=null){
					let results = this.processResults(data.Races[0], race.QualifyingResults);
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
			result.Points = this.calculatePoints(result.qualifyingPosition, result.position, result.status);
			result.Player = this.findPlayerByDriverCode(result.Driver.code);
		}
		return results;
	}
	
	getDriverQualifyingPosition = (driverCode, qualifyingResults) => {
		var result = qualifyingResults.filter(d => { return d.Driver.code === driverCode });
		return result[0].position;
	}
	
	findPlayerByDriverCode = (driverCode) => {
		const players = this.state.season.Players;
		let result = players.filter(p => { return p.Driver1.code === driverCode || p.Driver2.code === driverCode });
		return result[0];
	}

	calculatePoints = (qualifyingPosition, position, status) => {
		const didFinish = status === "Finished" || status.match(/\+\d Lap/);
		const result = didFinish ? (21 - parseInt(position, 10)) : 0;
		const difference = didFinish ? (parseInt(qualifyingPosition,10) - parseInt(position,10)) : (parseInt(qualifyingPosition,10) - 20);
		const total = (result + difference);
		const points = {
			'result': result,
			'difference': difference,
			'total': total
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
		const { visible, season,race,player, loading } = this.state
			
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
							style={{ position: 'fixed' }} >
							<Menu.Item onClick={() => this.SwitchSeasons(2018)} >
									2018
							</Menu.Item>
							<Menu.Item onClick={() => this.SwitchSeasons(2019)} >
									2019
							</Menu.Item>
							<Navigation onClick={this.handleSidebarHide.bind(this)} />
						</Sidebar>

						<Sidebar.Pusher dimmed={visible} style={{ minHeight: '100vh' }} >
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

							{loading ? (
								<Segment style={{ minHeight: '100vh' }}>
									<Dimmer active inverted>
										<Loader size='large'>Loading Season</Loader>
									</Dimmer>
								</Segment>
							) : (
								<div>
									<Route exact path={routes.LANDING} component={()=> <LandingPage season={season} viewRace={this.viewRace.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />} />
									<Route exact path={routes.SIGN_IN} component={()=> <Login />} />
									<Route exact path={routes.HOME} component={()=> <Dashboard season={season} updateSeason={this.updateSeason.bind(this)} viewRace={this.viewRace.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />} />
									<Route exact path={routes.ACCOUNT} component={() => <AccountPage season={season} />} />
									<Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
									<Route exact path={routes.ADMIN} component={() => <AdminPage />} />
									<Route exact path={routes.SEASON} component={() => <SeasonPage season={season} updateSeason={this.updateSeason.bind(this)} viewRace={this.viewRace.bind(this)} viewPlayer={this.viewPlayer.bind(this)} />} />
									<Route exact path={routes.RACE} component={()=> <Race season={season} race={race} />}  />
									<Route exact path={routes.PLAYER} component={()=> <PlayerPage season={season} player={player} viewRace={this.viewRace.bind(this)} />} />
								</div>
							)}
						</Sidebar.Pusher>
					</Sidebar.Pushable>
				</div>
			</Router>
		);
	}
}
export default withAuthentication(App)