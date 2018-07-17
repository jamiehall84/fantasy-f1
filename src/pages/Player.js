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
    Icon,
    Segment,
    Dimmer,
    Loader    
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
    componentWillMount(){
        const { match: { params } } = this.props;

        db.getSeason(params.year).then(season =>
            this.setState(() => ({
                season: season.val(),
                player: season.val().Players[params.player]
             })
            )
        );
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
    

    render(){
        const { season, player } = this.state;
        return(
          <AuthUserContext.Consumer>
                {authUser => 
                    (player==null?
                        <Segment
                        style={{ minHeight: '100vh' }}>
                            <Dimmer active inverted>
                                <Loader size='large'>Loading Player Info</Loader>
                            </Dimmer>
                        </Segment>
                    :
                        <Container text style={{ marginTop: '6em' }}>
                            <div>
                                <Header as='h1' color='red'>{player.Name.firstName} {player.Name.familyName}</Header>
                                <Grid columns={3} divided stackable>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Button icon labelPosition='left'color='red' as={Link} to={`/season/${this.props.match.params.year}`} style={{marginTop:'1em'}}>
                                            <Icon name='arrow alternate circle left' />
                                            Back to Season
                                        </Button>
                                        </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h3' color='red'>Driver 1</Header>
                                        {player.Driver1==null?
                                        <form>
                                            <select onChange={(event) => this.setDriver(event)} name='Driver1'>
                                                <option>select driver</option>
                                                {Object.keys(season.Drivers).map(key =>
                                                    <option value={key} >{season.Drivers[key].givenName} {season.Drivers[key].familyName}</option>
                                                )}
                                            </select>
                                        </form>
                                        :
                                        <p>{player.Driver1.givenName} {player.Driver1.familyName}</p>}
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h3' color='red'>Driver 2</Header>
                                        {player.Driver2==null?
                                        <form>
                                            <select onChange={(event) => this.setDriver(event)} name='Driver2'>
                                                <option>select driver</option>
                                                {Object.keys(season.Drivers).map(key =>
                                                    <option value={key} >{season.Drivers[key].givenName} {season.Drivers[key].familyName}</option>
                                                )}
                                            </select>
                                        </form>
                                        :<p>{player.Driver2.givenName} {player.Driver2.familyName}</p>}
                                    </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                
                                
                            </div>
                        </Container>
                    )
                }
            </AuthUserContext.Consumer>
        );
    }
}


const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(withRouter(PlayerPage));