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
            player: null,
        };
    }
    componentWillMount(){
        const { match: { params } } = this.props;

        db.doGetPlayer(params.year, params.player).then(player =>
            this.setState(() => ({player: player.val() }))
        );
    }
    setDriver = (event) => {
        const { match: { params } } = this.props;
        const {player} = this.state;
        if(event.target.name==='Driver1'){
            player.Driver1 = event.target.value;
        }else{
            player.Driver2 = event.target.value;
        }
        db.doUpdatePlayerDriver(params.year,params.player, event.target.name, event.target.value)
        .then(() => {
            this.setState(() => ({player: player}));
            console.log('Player Driver has been updated.');
        })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
      
    }
    

    render(){
        const { player } = this.state;
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
                                            <select onChange={event => this.setDriver} name='Driver1'>
                                                <option>select driver</option>
                                            </select>
                                        </form>
                                        :null}
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h3' color='red'>Driver 2</Header>
                                        {player.Driver2==null?
                                        <form>
                                            <select><option>select driver</option></select>
                                        </form>
                                        :null}
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