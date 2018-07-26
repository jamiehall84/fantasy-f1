import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Container, Segment, Dimmer, Loader} from 'semantic-ui-react';
import PlayerList from '../components/PlayerList'

const INITIAL_STATE = {
    season: null,
    player: null,
    showPlayer: false,
};

class LandingPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }
  viewPlayer = (player) => {
    this.props.viewPlayer(player);
    this.props.history.push(`/player`);
}
closePlayer = () => {
    this.setState(() => ({
        player: null,
        showPlayer: false,
     }))
}


    render() {
        const { season } = this.props;
        return(
            ( season==null ?
                <Segment style={{ minHeight: '100vh' }}>
                    <Dimmer active inverted>
                        <Loader size='large'>Loading Season</Loader>
                    </Dimmer>
                </Segment>
            :
                <div>
                    <Container style={{ marginTop: '7em' }}>
                        <PlayerList season={season} viewPlayer={this.viewPlayer.bind(this)} />
                    </Container>
                   
                </div>
            )
        );
    }
}

export default withRouter(LandingPage);