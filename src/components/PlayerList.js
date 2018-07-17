import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Header,
    Card,
    Image,
    Button,
  } from 'semantic-ui-react';
import AddPlayerForm from './AddPlayerForm';

class PlayerList extends Component {
  constructor(props) {
    super(props);
  }
  addPlayer = () => {
      debugger;
    this.props.addPlayer();
  }
  
  render() {
      const {season} = this.props;
    return (
        <div>
            <Header as='h2' color='red'>Players</Header>
            {season.Players.length < 10?
            <AddPlayerForm season={season} addPlayer={this.addPlayer.bind(this)} />
            : null }
            {season.Players!=null?
            <Card.Group stackable itemsPerRow={3}>
                {Object.keys(season.Players).map(key =>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/images/avatar/large/steve.jpg' />
                            <Card.Header>{season.Players[key].Name.displayName}</Card.Header>
                            <Card.Meta>{season.Players[key].email}</Card.Meta>
                            <Card.Description>
                                Description goes here. Maybe points summary and driver info. 
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                            <Button basic color='red' as={Link} to={`/player/${season.year}/${key}`}>
                                View
                            </Button>
                            {/* <Button basic color='red'>
                                Decline
                            </Button> */}
                            </div>
                        </Card.Content>
                    </Card>
                )}
            </Card.Group>
            : null}
        </div>
    );
  }

}


export default PlayerList;