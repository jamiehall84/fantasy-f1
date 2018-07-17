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
    Icon
} from 'semantic-ui-react';
import Moment from 'react-moment';

class Race extends Component {
    constructor(props) {
        super(props);
        this.state = {
            race: null,
        };
    }
    componentWillMount(){
        const { match: { params } } = this.props;

        db.getRace(params.year, params.race).then(race =>
            this.setState(() => ({race: race.val() }))
            
            
        );
    }
    

    render(){
        const { race } = this.state;
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
                            
                            <TabExampleSecondaryPointing race={race} />
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
            <Grid.Row>
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

const panes = [
    { 
        menuItem: 'Points', 
        render: () => 
        <Tab.Pane attached={false}>Points go here</Tab.Pane>
    },
    { 
        menuItem: 'Race', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Race Results</Header>
                {race.QualifyingResults == null?
                <p>There are no results for this race yet.</p>
                :<RaceResults results={race.Results} />
                }
            </Tab.Pane> },
    { 
        menuItem: 'Qualifying', 
        render: ({race}) => 
            <Tab.Pane attached={false}>
                <Header as='h2' color='red' style={{ marginBottom: '1em' }}>Qualifying Results</Header>
                {race.QualifyingResults == null?
                    <p>There are no results for this race yet.</p>
                : <QualifyingResults results={race.QualifyingResults} />}</Tab.Pane> 
    },
  ]
  
  const TabExampleSecondaryPointing = ({race}) => (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} race={race} />
  )

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(Race));