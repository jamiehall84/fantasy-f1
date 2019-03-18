import React, { Component } from 'react';
import {
    Table,
    Label,
    Icon,
    Card,
  } from 'semantic-ui-react';
import AddPlayerForm from './AddPlayerForm';
import * as helper from '../constants/helper';

class PlayerList extends Component {
    constructor(props) {
        super(props);
        const player = this.props.user != null ? helper.WhoAmI(this.props.season,this.props.user) : this.props.player;
        this.state = {
            player: player,
        };
    }
    addPlayer = () => {
    this.props.addPlayer();
  }
  sortPlayers = (a,b) => {
    if (parseInt(a.total,10) < parseInt(b.total,10)){
        return 1;
    }
    if (parseInt(a.total,10) > parseInt(b.total,10)){
        return -1;
    }
    return 0;
  }
  render() {
      const {season} = this.props;
      const { player } = this.state;
    return (
        <div>
        {season.Players === undefined ? (
            <div>
                <p>There are not any players yet for this season.</p>
                <AddPlayerForm season={season} addPlayer={this.addPlayer.bind(this)} />
            </div>
        ) : (
            <div>
                {(season.Players === null || season.Players.length) < 10 && this.props.addPlayer !== null &&
                    <AddPlayerForm season={season} addPlayer={this.addPlayer.bind(this)} /> }
                {season.Players !== null &&
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{season.year} League Standings</Card.Header>
                        <Card.Meta>
                        The league standings for this season so far are below. Tap on a player to see more info.
                        </Card.Meta>
                    </Card.Content>
                    <Table celled unstackable striped selectable inverted>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Pos</Table.HeaderCell>
                            <Table.HeaderCell>Player</Table.HeaderCell>
                            <Table.HeaderCell>Driver 1</Table.HeaderCell>
                            <Table.HeaderCell>Driver 2</Table.HeaderCell>
                            <Table.HeaderCell>Pts</Table.HeaderCell>
                            <Table.HeaderCell collapsing></Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                    
                        <Table.Body>
                        {Object.keys(season.Players.sort(this.sortPlayers)).map(key =>
                            <Table.Row key={key}  onClick={(player)=> this.props.viewPlayer(season.Players[key])} style={ season.Players[key] === player ? {'backgroundColor': '#16ab39'} : null }>
                                <Table.Cell >
                                    
                                    {parseInt(key,10) === 0 ?
                                        <Label ribbon color='yellow'>{parseInt(key,10)+1}</Label>
                                    : 
                                        parseInt(key,10)+1
                                    }
                                    
                                </Table.Cell>
                                <Table.Cell>
                                    {/* <Link to={`/player/${season.year}/${key}`}>{season.Players[key].Name.displayName}</Link> */}
                                    {season.Players[key].Name.displayName}
                                </Table.Cell>
                                <Table.Cell>
                                    {season.Players[key].Driver1.code}
                                </Table.Cell>
                                <Table.Cell>
                                    {season.Players[key].Driver2.code}
                                </Table.Cell>
                                <Table.Cell>{season.Players[key].total}</Table.Cell>
                                <Table.Cell textAlign='right' collapsing><Icon name='chevron right' /></Table.Cell>
                            </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Card>}
            </div>
        )}
        </div>
        
    );
  }

}


export default PlayerList;