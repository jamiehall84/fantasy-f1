import React, { Component } from 'react';
import AuthUserContext from './AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import { Link, withRouter } from 'react-router-dom';
import {
    Container,
    Header,
    List,
    Segment,
    Dimmer,
    Loader
  } from 'semantic-ui-react'

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
    
      render(){
          const { season } = this.state;
          return(
            <AuthUserContext.Consumer>
                {authUser => 
                    (season==null?
                        <Segment>
                            <Dimmer active inverted>
                                <Loader size='large'>Loading Season</Loader>
                            </Dimmer>
                        </Segment>
                    :
                
                    <Container text style={{ marginTop: '7em' }}>
                        <Header as='h1' color='red'>{season.year}</Header>
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