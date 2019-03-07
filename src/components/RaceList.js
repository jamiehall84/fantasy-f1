import React, { Component } from 'react';
import { Table, Icon, Card, } from 'semantic-ui-react';
import Moment from 'react-moment';

class RaceList extends Component {
    viewRace = (race) => {
        this.props.viewRace(race);
    }
    render() {
        const { season } = this.props
    return (
        <div>
            <Card fluid>
                <Card.Content>
                    <Card.Header>Races this seaason</Card.Header>
                    <Card.Meta>
                    The races for this season so far are below. Tap on a race to see results and other info.
                    </Card.Meta>
                </Card.Content>
                <Table celled unstackable striped selectable inverted >
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Round</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
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
                            <Table.Cell textAlign='right' collapsing><Icon name='chevron right' /></Table.Cell>
                        </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Card>
        </div>
    );
    }

}


export default RaceList;
