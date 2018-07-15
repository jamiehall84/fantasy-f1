import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Header,
    List,
    Button,
  } from 'semantic-ui-react'

const QualifyingResults = ({ results }) => (
    
    <div>
        <h2>Qualifying Results</h2>
        <List divided relaxed>
            {Object.keys(results).map(key =>
                <List.Item key={key}>
                    <List.Icon name='flag checkered' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as={Link} to={`/race/2018/${key}`}>{results[key].position}</List.Header>
                        <List.Description as='a'>{results[key].Driver.givenName} {results[key].Driver.familyName}</List.Description>
                    </List.Content>
                </List.Item>
            )}
        </List>
    </div>
);

export default QualifyingResults;