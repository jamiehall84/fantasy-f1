import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { db } from '../firebase';
import { Container, Segment, Dimmer, Loader} from 'semantic-ui-react';
import PlayerList from '../components/PlayerList'
import PlayerPage from '../pages/Player'

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
    this.setState(() => ({
        player: player,
        showPlayer: true,
     }))
}
closePlayer = () => {
    this.setState(() => ({
        player: null,
        showPlayer: false,
     }))
}


    render() {
        const { season } = this.props;
        const { showPlayer, player } = this.state;
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
                    {showPlayer && <PlayerPage season={season} player={player} close={this.closePlayer.bind(this)} open={showPlayer} />}
                </div>
            )
        );
    }
}

export default withRouter(LandingPage);