import React, { Component } from 'react';
import { Header, Card, Button } from 'semantic-ui-react';
import Moment from 'react-moment';

class NextRace extends Component {
    constructor(props) {
        super(props);
        const nextRace = this.getNextRace(this.props.season);
        this.state = {
            nextRace: nextRace
        }
    }
    
    getNextRace = (season) => {
        var race= [];
        var now = new Date();
        var closest = Infinity;
        for (let i = 1; i < season.races.length; i++) {
            const r = season.races[i];
            const date = getDate(r.date, r.time);
            if( date >= now && date < closest){
                closest = date;
                race = r;
            }
        }
        race.actualTime = closest;
        return race;
    }
    
    viewRace = () => {
        this.props.viewRace(this.state.nextRace);
    }

    render() {
        const {nextRace} = this.state;
    return (
        
        <div>
            <Card fluid>
                <Card.Content>
                    <Card.Header>Next Race: {nextRace.raceName}</Card.Header>
                    <Card.Meta>
                       <Moment fromNow>{nextRace.actualTime}</Moment>
                    </Card.Meta>
                    <Card.Description>
                        Round {nextRace.round} of the {nextRace.season} season will be at the {nextRace.Circuit.circuitName} in {nextRace.Circuit.Location.locality}.
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button color='green' onClick={this.viewRace}>
                        Take a look
                    </Button>
                </Card.Content>
            </Card>
        </div>
    );
    }

}


export default NextRace;

const getDate = (date, time) =>{
    var d = new Date(date);
    const parts = time.split(':');
    d.setHours(parts[0]);
    d.setMinutes(parts[1]);
    return d
}