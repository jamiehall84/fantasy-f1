import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as helper from '../constants/helper';
import { Button, Card } from 'semantic-ui-react'

class PlayerProgressGraph extends Component {
    constructor(props) {
        super(props);
        const player = this.props.user != null ? helper.WhoAmI(this.props.season,this.props.user) : this.props.player;
        this.state = {
            season: null,
            player: player,
        };
    }
    graphData = () => {
        const { player } = this.state;
        if(player == null){return null;}
        const Points = player.Points;
        var data=[];
        var d1 = 0;
        var d2 = 0;
        for (let index = 1; index < Points.length; index++) {
            const P = Points[index];
            d1 = d1 + parseInt(P.Driver1.total,10);
            d2 = d2 + parseInt(P.Driver2.total,10);
            data.push({
                name: P.raceName,
                [P.Driver1.code]: d1,
                [P.Driver2.code]: d2,
                Total: d1+d2,
            });
        }
        return data;
    }

    render(){
        const { player } = this.state;
        const data = this.graphData();
        return(
            <Card fluid>
                <Card.Content>
                    <Card.Header>Your Progress</Card.Header>
                    <Card.Meta>How have your drivers progressed so far this season?</Card.Meta>
                    <Card.Description>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart width={600} height={300} data={data}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="0"/>
                                <Tooltip/>
                                <Legend />
                                <Line type="monotone" dataKey="Total" stroke="#666" activeDot={{r: 8}} />
                                <Line type="monotone" dataKey={player.Driver1.code} stroke="#21ba45"/>
                                <Line type="monotone" dataKey={player.Driver2.code} stroke="#fbbd08" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Description>
                </Card.Content>
            </Card>
            
        );
    }
}

export default PlayerProgressGraph;