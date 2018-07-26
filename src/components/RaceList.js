import React, { Component } from 'react';
import { Header, Table } from 'semantic-ui-react';
import Moment from 'react-moment';

class RaceList extends Component {
    viewRace = (race) => {
        this.props.viewRace(race);
    }
    render() {
        const { season } = this.props
    return (
        <div>
            <Header as='h2' color='green'>Races this season</Header>
            <Table celled unstackable striped selectable inverted >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Round</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
            
                <Table.Body>
                {Object.keys(season.races).map(key =>
                    <Table.Row key={key} onClick={()=>this.viewRace(season.races[key])}>
                        <Table.Cell>
                            {season.races[key].round}
                        </Table.Cell>
                        <Table.Cell>
                            {season.races[key].raceName}
                        </Table.Cell>
                        <Table.Cell>
                            <Moment format="DD MMM YY">{season.races[key].date}</Moment>
                        </Table.Cell>
                    </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    );
    }

}


export default RaceList;
