import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from '../components/AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {
    Container,
    Header,
    Button,
    Grid,
    Responsive,
    Tab,
    Icon,
    Table,
    Label,
} from 'semantic-ui-react';
import Moment from 'react-moment';
import axios from 'axios';

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
        const { match: { params } } = this.props;
        db.getSeason(params.year).then(s =>
            this.setState(() => ({
                season: s.val(),
                race: s.val().races[params.race],
                loading: false,
            }))
        );
    }
    render(){
        const { season, race } = this.state;
        return(
          <AuthUserContext.Consumer>
              {authUser => 
                    <Container text style={{ marginTop: '6em' }}>
                    {race!= null?
                        <div>
                            <Header as='h1' color='red'>{race.raceName}</Header>
                            <Grid columns={3} divided stackable>
                                <Grid.Row>
                                    <Grid.Column>
                                        <p><b>Country:</b> {race.Circuit.Location.country}</p>
                                        <p><b>Locality:</b> {race.Circuit.Location.locality}</p>
                                        <p><b>Circuit:</b> {race.Circuit.circuitName}</p>
                                        <p><b>Date:</b> <Moment format="DD MMM YY">{race.date}</Moment></p>
                                        <p><b>Time:</b> {race.time }</p>
                                        <Button icon labelPosition='left'color='red' as={Link} to={`/season/${race.season}`} style={{marginTop:'1em'}}>
                                        <Icon name='arrow alternate circle left' />
                                        Back to Race List
                                    </Button>
                                    </Grid.Column>
                                <Grid.Column>
                                </Grid.Column>
                                <Grid.Column>
                                </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <TabExampleSecondaryPointing race={race} season={season} />
                        </div>
                    :
                        <div>
                            <Header as='h1'>Loading</Header>
                        </div>
                    }
                    </Container>
              }
          </AuthUserContext.Consumer>
        );
    }
}

const QualifyingResults = ({ results }) => (
    
    <div>
        <Grid divided='vertically'>
            <Grid.Row color='black'>
                <Responsive as={Grid.Column} mobile={1} tablet={1} computer={1}>
                    #
                </Responsive>
                <Responsive as={Grid.Column} mobile={5} tablet={5} computer={3}>
                    
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={3}>
                    
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={2} computer={2}>
                    Q1
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={2} computer={2}>
                    Q2
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={2} computer={2}>
                    Q3
                </Responsive>
            </Grid.Row>
            {Object.keys(results).map(key =>
            
            <Grid.Row key={key} color={parseInt(key,10) % 2 === 0? 'grey' : null}>
                <Responsive as={Grid.Column} mobile={1} tablet={1} computer={1}>{results[key].position}</Responsive>
                <Responsive as={Grid.Column} mobile={5} tablet={5} computer={3}>{results[key].Driver.givenName} {results[key].Driver.familyName}</Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={3}>{results[key].Constructor.name}</Responsive>
                <Responsive as={Grid.Column}  mobile={3} tablet={3} computer={2}>{results[key].Q1}</Responsive>
                <Responsive as={Grid.Column}  mobile={3} tablet={3} computer={2}>{results[key].Q2}</Responsive>
                <Responsive as={Grid.Column}  mobile={3} tablet={3} computer={2}>{results[key].Q3}</Responsive>
            </Grid.Row>
            )}
        </Grid>
    </div>
);

const RaceResults = ({ results }) => (
    
    <div>
        
        <Grid  divided='vertically'>
            <Grid.Row color='black'>
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>
                    #
                </Responsive>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>
                    Driver
                </Responsive>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>
                    Constructor
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} computer={3} >
                    Grid
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} computer={3} >
                    Status
                </Responsive>
            </Grid.Row>
            {Object.keys(results).map(key =>
            <Grid.Row key={key} color={parseInt(key, 10) % 2 === 0? 'grey' : null} >
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>{results[key].position}</Responsive>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>{results[key].Driver.givenName} {results[key].Driver.familyName}</Responsive>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>{results[key].Constructor.name}</Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} >{results[key].grid}</Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} >{results[key].status}</Responsive>
            </Grid.Row>
            )}
        </Grid>
    </div>
);
const RacePoints = ({ Results }) => (
    
    <div>
        
        <Grid  divided='vertically'>
            <Grid.Row color='black'>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>
                    Driver
                </Responsive>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>
                    Player
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} computer={3} >
                    Result
                </Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} computer={3} >
                    Difference
                </Responsive>
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>
                    Total
                </Responsive>
            </Grid.Row>
            {Object.keys(Results).map(key =>
            (Results[key] !== null?
            <Grid.Row key={key} color={parseInt(key, 10) % 2 === 0? 'grey' : null} >
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>{Results[key].Driver.code}</Responsive>
                <Responsive as={Grid.Column} mobile={4} tablet={4} computer={3}>{Results[key].Player.Name.displayName}</Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} computer={3}>{Results[key].Points.result}</Responsive>
                <Responsive as={Grid.Column} mobile={3} tablet={3} omputer={3}>{Results[key].Points.difference}</Responsive>
                <Responsive as={Grid.Column} mobile={2} tablet={2} omputer={1}>{Results[key].Points.total}</Responsive>
            </Grid.Row>
            : null)
            )}
        </Grid>
    </div>
);
const PlayerPoints = ({ Players, Round, Season }) => (
    
    <div>
        <Table celled>
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
                        <Label ribbon>{parseInt(key,10)+1}</Label>
                        </Table.Cell>
                        <Table.Cell>
                            <Link to={`/player/${Season}/${key}`}>{Players[key].Name.displayName}</Link>
                        </Table.Cell>
                        <Table.Cell>{Players[key].Points[Round].Total.total}</Table.Cell>
                    </Table.Row>
                    )}
                </Table.Body>
            </Table>
    </div>
);

const panes = [
    { 
        menuItem: 'Points By Player', 
        render: ({season, race}) => 
        <Tab.Pane attached={false}>
            <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Race Points</Header>
            {race.Results == null?
            <p>The points have not yet been calculated for this race.
            </p>
            :<PlayerPoints Players={season.Players} Round={race.round} Season={race.season} />}
        </Tab.Pane>
    },
    { 
        menuItem: 'Points by Driver', 
        render: ({race}) => 
        <Tab.Pane attached={false}>
            <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Race Points</Header>
            {race.Results == null?
            <p>The points have not yet been calculated for this race.
            </p>
            :<RacePoints Results={race.Results} />}
        </Tab.Pane>
    },
    { 
        menuItem: 'Race Results', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Race Results</Header>
                {race.QualifyingResults == null?
                <p>There are no results for this race yet.</p>
                :<RaceResults results={race.Results} />
                }
            </Tab.Pane> },
    { 
        menuItem: 'Qualifying Results', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Qualifying Results</Header>
                {race.QualifyingResults == null?
                    <p>There are no results for this race yet.</p>
                : <QualifyingResults results={race.QualifyingResults} />}</Tab.Pane> 
    },
  ]
  
  const TabExampleSecondaryPointing = ({season, race}) => (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} race={race} season={season} />
  )

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(Race));