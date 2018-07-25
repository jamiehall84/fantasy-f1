import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import { Link, Redirect } from 'react-router-dom';
import {
    Container,
    Header,
    Button,
    Grid,
    Icon,
    Segment,
    Dimmer,
    Loader,
    Table,
    Modal,
} from 'semantic-ui-react';


const byPropKey = (propertyName, value) => () => ({
[propertyName]: value,
});

class PlayerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            season: null,
            player: null,
        };
    }
    // componentWillMount(){
    //     const { match: { params } } = this.props;

    //     db.getSeason(params.year).then(season =>
    //         this.setState(() => ({
    //             season: season.val(),
    //             player: season.val().Players[params.player]
    //          })
    //         )
    //     );
    // }
    goBack = () => {
        this.props.history.goBack();
    }
    setDriver = (event) => {
        const { match: { params } } = this.props;
        const {season, player} = this.state;
        const driver = season.Drivers[event.target.value];
        if(event.target.name==='Driver1'){
            player.Driver1 = driver;
        }else{
            player.Driver2 = driver;
        }
        
        db.doUpdatePlayerDriver(params.year,params.player, event.target.name, driver)
        .then(() => {
            this.setState(() => ({player: player}));
            console.log('Player Driver has been updated.');
        })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
      
    }
    driver1Points = () => {
        const {player} = this.props;
        var total = 0
        for (let index = 1; index < player.Points.length; index++) {
            const result = player.Points[index];
            total = total + parseInt(result.Driver1.total, 10);
        }
        return total
    }
    driver2Points = () => {
        const {player} = this.props;
        var total = 0
        for (let index = 1; index < player.Points.length; index++) {
            const result = player.Points[index];
            total = total + parseInt(result.Driver2.total, 10);
        }
        return total
    }
    bestRace = () => {
        return this.props.player.Points.filter(t => t!= null).reduce((h, c) => c.Total.total > h.Total.total ? c : h);
    }
    worstRace = () => {
        return this.props.player.Points.filter(t => t!= null).reduce((h, c) => c.Total.total < h.Total.total ? c : h);
    }

    viewRace = (round) => {
        const { season } = this.props;
        const race = season.races[round];
        this.props.viewRace(race);
        this.props.history.push(`/race`);
    }
    render(){
        const { season, player } = this.props;
        const bestRace = this.bestRace();
        const worstRace = this.worstRace();
        return(
            (player == null?
                <Redirect to='/home'/>
                :
                <Container style={{ marginTop: '6em' }}>
                    <Header as='h1' color='green'>{player.Name.firstName} {player.Name.familyName}</Header>
                    <Header as='h2' color='green'>{player.total} Points</Header>
                    <Button icon labelPosition='left' color='green' onClick={this.goBack} style={{marginBottom:'1em'}}>
                        <Icon name='arrow alternate circle left' />
                        Back
                    </Button>
                    <Grid columns={3} divided stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as='h3' color='green'>Driver 1</Header>
                                {player.Driver1.code==null?
                                <form>
                                    <select onChange={(event) => this.setDriver(event)} name='Driver1'>
                                        <option>select driver</option>
                                        {Object.keys(season.Drivers).map(key =>
                                            <option value={key} >{season.Drivers[key].givenName} {season.Drivers[key].familyName}</option>
                                        )}
                                    </select>
                                </form>
                                :
                                <p>{player.Driver1.givenName} {player.Driver1.familyName}: {`${this.driver1Points()} points`}</p>}
                            </Grid.Column>
                            <Grid.Column>
                                <Header as='h3' color='green'>Driver 2</Header>
                                {player.Driver2.code==null?
                                <form>
                                    <select onChange={(event) => this.setDriver(event)} name='Driver2'>
                                        <option>select driver</option>
                                        {Object.keys(season.Drivers).map(key =>
                                            <option value={key} >{season.Drivers[key].givenName} {season.Drivers[key].familyName}</option>
                                        )}
                                    </select>
                                </form>
                                :<p>{player.Driver2.givenName} {player.Driver2.familyName}: {`${this.driver2Points()} points`}</p>}
                            </Grid.Column>
                            <Grid.Column>
                                <Header as='h3' color='green'>Stats</Header>
                                <p><b>Best Race:</b> {bestRace.raceName} ({bestRace.Total.total})</p>
                                <p><b>Worst Race:</b> {worstRace.raceName} ({worstRace.Total.total})</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <RacePoints Points={player.Points} viewRace={this.viewRace.bind(this)} />
            </Container>
            )
        );
    }
}
const RacePoints = ({ Points, viewRace }) => (
    
    <div>
        <Table celled unstackable striped selectable inverted style={{marginTop: '1em'}} >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Race</Table.HeaderCell>
                    <Table.HeaderCell>Result</Table.HeaderCell>
                    <Table.HeaderCell>+/-</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {Object.keys(Points).map(key =>
                <Table.Row key={key} onClick={(round)=> viewRace(Points[key].raceRound)}>
                    <Table.Cell>
                        {Points[key].raceName}
                    </Table.Cell>
                    <Table.Cell>{Points[key].Total.result}</Table.Cell>
                    <Table.Cell>{Points[key].Total.difference}</Table.Cell>
                    <Table.Cell>{Points[key].Total.total}</Table.Cell>
                </Table.Row>
                )}
            </Table.Body>
        </Table>
    </div>
);

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(PlayerPage));