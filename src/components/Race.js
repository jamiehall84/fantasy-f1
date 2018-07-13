import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import withAuthorization from '../components/withAuthorization';
import { db } from '../firebase';
import {
    Container,
    Header,
} from 'semantic-ui-react';
import Moment from 'react-moment';

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
const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(Race));