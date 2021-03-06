import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Moment from 'react-moment';
import PlayerRaceSummary from './PlayerRaceSummary';
import * as helper from '../constants/helper';
class PreviousRace extends Component {
    constructor(props) {
        super(props);
        const player = helper.WhoAmI(this.props.season, this.props.user);
        const previousRace = this.getPreviousRace(this.props.season);
        const driver1Result = this.findDriverResult(previousRace, player.Driver1.code);
        const driver2Result = this.findDriverResult(previousRace, player.Driver2.code);

        this.state = {
            player: player,
            previousRace: previousRace,
            driver1Result: driver1Result,
            driver2Result: driver2Result
        }
    }
    
    findDriverResult = (race,driverCode) => {
        if(race.Results== null){return null}
        return race.Results.find(p => {
            return p.Driver.code === driverCode
            });
        }
    getPreviousRace = (season) => {
        var race= [];
        var now = new Date();
        var closest = new Date(season.year);
        for (let i = 1; i < season.races.length; i++) {
            const r = season.races[i];
            const date = getDate(r.date, r.time);
            if( date <= now && date > closest){
                closest = date;
                race = r;
            }
        }
        race.actualTime = closest;
        return race;
    }
    
    viewRace = () => {
        this.props.viewRace(this.state.previousRace);
    }

    render() {
        const { previousRace } = this.state;
    return (
        
        <div>   
            <Card fluid>
                <Card.Content>
                    <Card.Header>Previous Race: {previousRace.raceName}</Card.Header>
                    <Card.Meta>
                       <Moment fromNow>{previousRace.actualTime}</Moment>
                    </Card.Meta>
                    <Card.Description>
                        {previousRace.Results==null?
                        <p>Results have not been processed yet.</p>
                        :<div>
                            The last race was at the {previousRace.Circuit.circuitName} in {previousRace.Circuit.Location.locality}. 
                            <PlayerRaceSummary season={this.props.season} user={this.props.user} race={previousRace} />
                        </div>
                        }
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


export default PreviousRace;

const getDate = (date, time) =>{
    var d = new Date(date);
    const parts = time.split(':');
    d.setHours(parts[0]);
    d.setMinutes(parts[1]);
    return d
}