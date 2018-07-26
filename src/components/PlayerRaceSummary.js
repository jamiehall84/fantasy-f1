import React, { Component } from 'react';
const ordinal = require('ordinal-js');
class PlayerRaceSummary extends Component {
    constructor(props) {
        super(props);
        const player = this.whoAmI(this.props.season);
        const driver1Result = this.findDriverResult(this.props.race, player.Driver1.code);
        const driver2Result = this.findDriverResult(this.props.race, player.Driver2.code);
        this.state = {
            player: player,
            driver1Result: driver1Result,
            driver2Result: driver2Result,
        }
    }
    whoAmI = (season) => {
        return season.Players.find(p => {
            return p.uid === this.props.user.uid
            });
    }
    findDriverResult = (race,driverCode) => {
        return race.Results.find(p => {
            return p.Driver.code === driverCode
            });
        }
    render() {
        const { race } = this.props;
        const { player,  driver1Result, driver2Result } = this.state;
    return (
        
        <div>
            {/* DRIVER 1 */}
            <p>{driver1Result.Driver.givenName} {driver1Result.Driver.familyName} qualified {ordinal.toOrdinal(parseInt(driver1Result.qualifyingPosition,10))} 
            {driver1Result.positionText!='r'? ` and finished ${ordinal.toOrdinal(parseInt(driver1Result.position,10))}, ` : `but didn't manage to finish,`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver1.total, 10) > 1 && `giving you an addtional ${player.Points[parseInt(race.round, 10)].Driver1.total} points.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver1.total, 10) == 1 && `gaining you an extra point for the league.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver1.total, 10) == 0 && `and so didn't gain you any points.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver1.total, 10) < 0 && `which means you lost ${Math.abs(parseInt(player.Points[parseInt(race.round, 10)].Driver1.total, 10))} points.`}</p>
            {/* DRIVER 2 */}
            <p>Your second driver, {driver2Result.Driver.givenName} {driver2Result.Driver.familyName}, qualified {ordinal.toOrdinal(parseInt(driver2Result.qualifyingPosition,10))}
            {driver2Result.positionText!='r'? ` and finished ${ordinal.toOrdinal(parseInt(driver2Result.position,10))}, ` : `but did not finish,`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver2.total, 10) > 1 && `giving you a cheeky ${player.Points[parseInt(race.round, 10)].Driver2.total} point boost.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver2.total, 10) == 1 && `tooping up your league points by 1.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver2.total, 10) == 0 && `and so didn't gain you any points.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Driver2.total, 10) < 0 && `which means you lost ${Math.abs(parseInt(player.Points[parseInt(race.round, 10)].Driver2.total, 10))} points.`}</p>
            {/* Overall */}
            <p>Overall you {parseInt(player.Points[parseInt(race.round, 10)].Total.total, 10) > 1 && `earned yourself a tidy ${player.Points[parseInt(race.round, 10)].Total.total} points.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Total.total, 10) == 1 && `managed to scrape a point... so it's not all bad.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Total.total, 10) == 0 && `didn't gain or loose any points... it would be worse.`}
            {parseInt(player.Points[parseInt(race.round, 10)].Total.total, 10) < 0 && `your points dropped by ${Math.abs(parseInt(player.Points[parseInt(race.round, 10)].Total.total, 10))}... unlucky.`}
            </p>
        </div>
    );
    }

}


export default PlayerRaceSummary;
