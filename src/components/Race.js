import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import {
    Container,
    Header,
    Button,
    Grid,
    Responsive
} from 'semantic-ui-react';
import Moment from 'react-moment';
import axios from 'axios';
// import QualifyingResults from './QualifyingResults';


const byPropKey = (propertyName, value) => () => ({
[propertyName]: value,
});

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
    getQualifying = () => {
        var race = this.state.race;
        axios.get(`http://ergast.com/api/f1/2018/${race.round}/qualifying.json`)
          .then( res => {
            const data = res.data.MRData.RaceTable.Races[0].QualifyingResults;
            db.doSetQualifying(race.season, race.round, data)
            .then(() => {
                console.log(`Qualifying for this race have been added to the database.`);
                race.QualifyingResults = data;
                this.setState(() => ({race: race }));
            }).catch(error => {
                console.log(error.message);
            })
          });
      }

      getResults = () => {
        var race = this.state.race;
        axios.get(`http://ergast.com/api/f1/2018/${race.round}/results.json`)
          .then( res => {
            const data = res.data.MRData.RaceTable.Races[0].Results;
            db.doSetResults(race.season, race.round, data)
            .then(() => {
                console.log(`Results for this race have been added to the database.`);
                race.Results = data;
                this.setState(() => ({race: race }));
            }).catch(error => {
                console.log(error.message);
            })
          });
      }

    render(){
        const { race } = this.state;
        return(
          <AuthUserContext.Consumer>
              {authUser => 
                
                    <Container text style={{ marginTop: '7em' }}>
                    {race!= null?
                        <div>
                            <Header as='h1'>{race.raceName}</Header>
                            <p>Country: {race.country}</p>
                            <p>Locality: {race.locality}</p>
                            <p>Circuit: {race.circuit}</p>
                            <p>Date: <Moment format="DD MMM YY">{race.date}</Moment></p>
                            <p>Time: {race.time }</p>
                            {race.QualifyingResults == null?
                            <Button onClick={this.getQualifying}>Get Qualifying</Button>
                            : <QualifyingResults results={race.QualifyingResults} />}

                            {race.Results == null?
                            <Button onClick={this.getResults}>Get Race Results</Button>
                            : <RaceResults results={race.Results} />}
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
        <h2>Qualifying Results</h2>
        <Grid divided='vertically'>
            <Grid.Row>
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>
                    #
                </Responsive>
                <Responsive as={Grid.Column} mobile={8} tablet={8} computer={3}>
                    Driver
                </Responsive>
                <Responsive as={Grid.Column} mobile={5} tablet={5} computer={3}>
                    Constructor
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>
                    Q1
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>
                    Q2
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer}computer={2}>
                    Q3
                </Responsive>
            </Grid.Row>
            {Object.keys(results).map(key =>
            <Grid.Row key={key}>
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>{results[key].position}</Responsive>
                <Responsive as={Grid.Column} mobile={8} tablet={8} computer={3}>{results[key].Driver.givenName} {results[key].Driver.familyName}</Responsive>
                <Responsive as={Grid.Column} mobile={5} tablet={5} computer={3}>{results[key].Constructor.name}</Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>{results[key].Q1}</Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>{results[key].Q2}</Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>{results[key].Q3}</Responsive>
            </Grid.Row>
            )}
        </Grid>
    </div>
);

const RaceResults = ({ results }) => (
    
    <div>
        <h2>Race Results</h2>
        <Grid  divided='vertically'>
            <Grid.Row>
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>
                    #
                </Responsive>
                <Responsive as={Grid.Column} mobile={8} tablet={8} computer={3}>
                    Driver
                </Responsive>
                <Responsive as={Grid.Column} mobile={5} tablet={5} computer={3}>
                    Constructor
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>
                    OTHER
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}>
                    OTHER
                </Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer}computer={2}>
                    OTHER
                </Responsive>
            </Grid.Row>
            {Object.keys(results).map(key =>
            <Grid.Row key={key}>
                <Responsive as={Grid.Column} mobile={2} tablet={2} computer={1}>{results[key].position}</Responsive>
                <Responsive as={Grid.Column} mobile={8} tablet={8} computer={3}>{results[key].Driver.givenName} {results[key].Driver.familyName}</Responsive>
                <Responsive as={Grid.Column} mobile={5} tablet={5} computer={3}>{results[key].Constructor.name}</Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}></Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}></Responsive>
                <Responsive as={Grid.Column} {...Responsive.onlyComputer} computer={2}></Responsive>
            </Grid.Row>
            )}
        </Grid>
    </div>
);

const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(Race));