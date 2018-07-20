import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { db } from '../firebase';
import { Container, Segment, Dimmer, Loader} from 'semantic-ui-react';
import PlayerList from '../components/PlayerList'

const INITIAL_STATE = {
  season: null,
};

class LandingPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }
    componentDidMount(){
        const season = (new Date()).getFullYear();
        db.getSeason(season).then(s =>
            this.setState(() => ({season: s.val() }))
        );
    }

    render() {
        const { season } = this.state;
        return(
            ( season==null ?
                <Segment style={{ minHeight: '100vh' }}>
                    <Dimmer active inverted>
                        <Loader size='large'>Loading Season</Loader>
                    </Dimmer>
                </Segment>
            :
                <Container style={{ marginTop: '7em' }}>
                    <PlayerList season={season} />
                </Container>
            )
        );
    }
}

export default withRouter(LandingPage);