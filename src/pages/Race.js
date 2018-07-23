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

const QualifyingResults = ({ Results }) => (
    
    <div>
        <Table celled unstackable striped selectable >
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
                            <Label ribbon color='yellow'>{Results[key].position}</Label>
                        : 
                        Results[key].position
                        }
                    </Table.Cell>
                    <Table.Cell>{Results[key].Driver.givenName} {Results[key].Driver.familyName}</Table.Cell>
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
    
    <div>
        <Table celled unstackable striped selectable >
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
            {Object.keys(Results).map(key =>
                <Table.Row key={key}>
                    <Table.Cell>
                        {parseInt(key,10) === 0 ?
                            <Label ribbon color='yellow'>{Results[key].position}</Label>
                        : 
                        Results[key].position
                        }
                    </Table.Cell>
                    <Table.Cell>{Results[key].Driver.givenName} {Results[key].Driver.familyName}</Table.Cell>
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
    
    <div>
        <Table celled unstackable striped selectable >
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
                            <Label ribbon color='yellow'>{parseInt(key,10)+1}</Label>
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
const PlayerPoints = ({ Players, Round, Season }) => (
    
    <div>
        <Table celled unstackable striped selectable >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Pos</Table.HeaderCell>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell>Pts</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
            
                <Table.Body>
                {Object.keys(Players.sort(sortPlayers)).map(key =>
                    <Table.Row key={key}>
                        <Table.Cell>
                            {parseInt(key,10) === 0 ?
                                <Label ribbon color='yellow'>{parseInt(key,10)+1}</Label>
                            : 
                                parseInt(key,10)+1
                            }
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
                :<RaceResults Results={race.Results} />
                }
            </Tab.Pane> },
    { 
        menuItem: 'Qualifying Results', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Qualifying Results</Header>
                {race.QualifyingResults == null?
                    <p>There are no results for this race yet.</p>
                : <QualifyingResults Results={race.QualifyingResults} />}</Tab.Pane> 
    },
  ]
  
  const TabExampleSecondaryPointing = ({season, race}) => (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} race={race} season={season} />
  )

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(Race));