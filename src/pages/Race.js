import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { Redirect } from 'react-router-dom';
import {
    Container,
    Header,
    Button,
    Grid,
    Tab,
    Icon,
    Table,
    Label,
} from 'semantic-ui-react';
import Moment from 'react-moment';
import PlayerRaceSummary from '../components/PlayerRaceSummary';

class Race extends Component {
    constructor(props) {
        super(props);
        this.state = {
            race: null,
            points: null,
            loading: true,
        };
    }
    componentWillMount(){
        const { season, race } = this.props;
            this.setState(() => ({
                season: season,
                race: race,
                loading: false,
            }))
    }
    goBack = () => {
        this.props.history.goBack();
    }
    render(){
        const { season, race } = this.state;
        return(
          <AuthUserContext.Consumer>
              {authUser => 
                    <Container style={{ marginTop: '6em' }}>
                    {race!= null?
                        <div>
                            <Header as='h1' color='green'>Round {race.round}: {race.raceName}</Header>
                            <Grid columns={3} divided stackable>
                                <Grid.Row>
                                    <Grid.Column>
                                        <p><b>Country:</b> {race.Circuit.Location.country}</p>
                                        <p><b>Locality:</b> {race.Circuit.Location.locality}</p>
                                        <p><b>Circuit:</b> {race.Circuit.circuitName}</p>
                                        <p><b>Date:</b> <Moment format="DD MMM YY">{race.date}</Moment></p>
                                        <p><b>Time:</b> {race.time }</p>
                                        <Button icon labelPosition='left' color='green' onClick={this.goBack} style={{marginTop:'1em'}}>
                                            <Icon name='arrow alternate circle left' />
                                            Back
                                        </Button>
                                    </Grid.Column>
                                <Grid.Column>
                                    <Header as='h3' color='green'>Your race summary</Header>
                                    {race.Results != null?
                                    <PlayerRaceSummary season={season} user={authUser} race={race} />
                                    :<p>Results are not in for this race yet.</p>}
                                </Grid.Column>
                                <Grid.Column>
                                </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <TabExampleSecondaryPointing race={race} season={season} />
                        </div>
                    :
                        <Redirect to='/home'/>
                    }
                    </Container>
              }
          </AuthUserContext.Consumer>
        );
    }
}

const QualifyingResults = ({ Results }) => (
    
    <div style={{ 'overflowX': 'auto' }}>
        <Table celled unstackable striped selectable inverted >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Pos</Table.HeaderCell>
                    <Table.HeaderCell>Driver</Table.HeaderCell>
                    <Table.HeaderCell>Constructor</Table.HeaderCell>
                    <Table.HeaderCell>Q1</Table.HeaderCell>
                    <Table.HeaderCell>Q2</Table.HeaderCell>
                    <Table.HeaderCell>Q3</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {Object.keys(Results).map(key =>
                <Table.Row key={key}>
                    <Table.Cell>
                        {parseInt(key,10) === 0 ?
                            <Label ribbon color='green'>{Results[key].position}</Label>
                        : 
                        Results[key].position
                        }
                    </Table.Cell>
                    <Table.Cell>{Results[key].Driver.code}</Table.Cell>
                    <Table.Cell>{Results[key].Constructor.name}</Table.Cell>
                    <Table.Cell>{Results[key].Q1}</Table.Cell>
                    <Table.Cell>{Results[key].Q2}</Table.Cell>
                    <Table.Cell>{Results[key].Q3}</Table.Cell>
                </Table.Row>
            )}
            </Table.Body>
        </Table>
    </div>
);

const RaceResults = ({ Results }) => (
    
    <div style={{ 'overflowX': 'auto' }}>
        <Table celled unstackable striped selectable inverted>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Pos</Table.HeaderCell>
                    <Table.HeaderCell>Driver</Table.HeaderCell>
                    <Table.HeaderCell>Constructor</Table.HeaderCell>
                    <Table.HeaderCell>Grid</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {Object.keys(Results.sort(sortRaceResults)).map(key =>
                <Table.Row key={key}>
                    <Table.Cell>
                        {parseInt(key,10) === 0 ?
                            <Label ribbon color='green'>{Results[key].position}</Label>
                        : 
                        Results[key].position
                        }
                    </Table.Cell>
                    <Table.Cell>{Results[key].Driver.code}</Table.Cell>
                    <Table.Cell>{Results[key].Constructor.name}</Table.Cell>
                    <Table.Cell>{Results[key].grid}</Table.Cell>
                    <Table.Cell>{Results[key].status}</Table.Cell>
                </Table.Row>
            )}
            </Table.Body>
        </Table>
    </div>
);
const RacePoints = ({ Results }) => (
    
    <div style={{ 'overflowX': 'auto' }}>
        <Table celled unstackable striped selectable inverted>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Pos</Table.HeaderCell>
                    <Table.HeaderCell>Driver</Table.HeaderCell>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell>Result</Table.HeaderCell>
                    <Table.HeaderCell>+/-</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {Object.keys(Results.sort(sortDriverPoints)).map(key =>
                <Table.Row key={key}>
                    <Table.Cell>
                        {parseInt(key,10) === 0 ?
                            <Label ribbon color='green'>{parseInt(key,10)+1}</Label>
                        : 
                            parseInt(key,10)+1
                        }
                    </Table.Cell>
                    <Table.Cell>{Results[key].Driver.code}</Table.Cell>
                    <Table.Cell>{Results[key].Player.Name.displayName}</Table.Cell>
                    <Table.Cell>{Results[key].Points.result}</Table.Cell>
                    <Table.Cell>{Results[key].Points.difference}</Table.Cell>
                    <Table.Cell>{Results[key].Points.total}</Table.Cell>
                </Table.Row>
                )}
            </Table.Body>
        </Table>
    </div>
);
const PlayerPoints = ({ Players }) => (
    
    <div style={{ 'overflowX': 'auto' }}>
        <Table celled unstackable striped selectable inverted >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Pos</Table.HeaderCell>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell>Pts</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
            
                <Table.Body>
                {Object.keys(Players).map(key =>
                    <Table.Row key={key}>
                        <Table.Cell>
                            {parseInt(key,10) === 0 ?
                                <Label ribbon color='green'>{parseInt(key,10)+1}</Label>
                            : 
                                parseInt(key,10)+1
                            }
                        </Table.Cell>
                        <Table.Cell>
                            {Players[key].name}
                        </Table.Cell>
                        <Table.Cell>{Players[key].points}</Table.Cell>
                    </Table.Row>
                    )}
                </Table.Body>
            </Table>
    </div>
);
const GetPLayerPointsObject = (players, round) => {
    var playerPoints = [];
    for (let i = 0; i < players.length; i++) {
        const p = players[i];
        const player = {
            "name" : p.Name.displayName,
            "points" :  p.Points[round].Total.total,
        }
        playerPoints.push(player);
    }
    return playerPoints.sort(sortPlayerPoints)
}
const sortPlayerPoints = (a,b) => {
    if (parseInt(a.points,10) < parseInt(b.points,10)){
        return 1;
    }
    if (parseInt(a.points,10) > parseInt(b.points,10)){
        return -1;
    }
    return 0;
}
const sortRaceResults = (a,b) => {
    if (parseInt(a.position,10) > parseInt(b.position,10)){
        return 1;
    }
    if (parseInt(a.position,10) < parseInt(b.position,10)){
        return -1;
    }
    return 0;
}
const sortPlayers = (a,b) => {
    if (parseInt(a.total,10) < parseInt(b.total,10)){
        return 1;
    }
    if (parseInt(a.total,10) > parseInt(b.total,10)){
        return -1;
    }
    return 0;
  }
  const sortDriverPoints = (a,b) => {
    if (parseInt(a.Points.total,10) < parseInt(b.Points.total,10)){
        return 1;
    }
    if (parseInt(a.Points.total,10) > parseInt(b.Points.total,10)){
        return -1;
    }
    return 0;
  }
const panes = [
    { 
        menuItem: 'Players', 
        render: ({season, race}) => 
        <Tab.Pane attached={false}>
            <Header as='h2' color='green' style={{ marginBottom: '1em' }}>Player Points</Header>
            {race.Results == null?
            <p>The points have not yet been calculated for this race.
            </p>
            :<PlayerPoints Players={GetPLayerPointsObject(season.Players,race.round)} />}
        </Tab.Pane>
    },
    { 
        menuItem: 'Drivers', 
        render: ({race}) => 
        <Tab.Pane attached={false}>
            <Header as='h2' color='green' style={{ marginBottom: '1em' }}>Drivers Points</Header>
            {race.Results == null?
            <p>The points have not yet been calculated for this race.
            </p>
            :<RacePoints Results={race.Results} />}
        </Tab.Pane>
    },
    { 
        menuItem: 'Race', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='green' style={{ marginBottom: '1em' }}>Race Results</Header>
                {race.QualifyingResults == null?
                <p>There are no results for this race yet.</p>
                :<RaceResults Results={race.Results} />
                }
            </Tab.Pane> },
    { 
        menuItem: 'Qualifying', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='green' style={{ marginBottom: '1em' }}>Qualifying Results</Header>
                {race.QualifyingResults == null?
                    <p>There are no qualifying results for this race yet.</p>
                : <QualifyingResults Results={race.QualifyingResults} />}</Tab.Pane> 
    },
  ]
  
  const TabExampleSecondaryPointing = ({season, race}) => (
    <Tab menu={{ secondary: true, pointing: true,size:'small' }} panes={panes} race={race} season={season} />
  )

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(Race));