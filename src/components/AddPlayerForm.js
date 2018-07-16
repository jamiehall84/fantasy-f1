import React, { Component } from 'react';
import withAuthorization from '../components/withAuthorization';
import { withRouter } from 'react-router-dom';
import { db } from '../firebase';

const INITIAL_STATE = {
    firstName: '',
    familyName: '',
    displayName: '',
    Driver1: '',
    Driver2: '',
    error: null,
  };

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
  });
  
class AddPlayerForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  
  onSubmit = (event) => {
    event.preventDefault();
    const { match: { params } } = this.props;
    const { season } = this.props;
    const {
        firstName,
        familyName,
        displayName,
        Driver1,
        Driver2,
        email,
      } = this.state;

    const {
      addPlayer
    } = this.props;
    const Name = {
        'firstName': firstName,
        'familyName': familyName,
        'displayName': displayName
    };
    const key = season.Players == null? 0 : season.Players.length;
     debugger;  
    db.doCreatePlayer(key,season.year, Name, Driver1, Driver2, email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        addPlayer();
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    
  }

  render() {
    const {
      firstName,
      familyName,
      displayName,
      Driver1,
      Driver2,
      email,
      error,
    } = this.state;
    const isInvalid =
      email === '' ||
      displayName === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={firstName}
          onChange={event => this.setState(byPropKey('firstName', event.target.value))}
          type="text"
          placeholder="First Name"
        />
        <input
          value={familyName}
          onChange={event => this.setState(byPropKey('familyName', event.target.value))}
          type="text"
          placeholder="Surname"
        />
        <input
          value={displayName}
          onChange={event => this.setState(byPropKey('displayName', event.target.value))}
          type="text"
          placeholder="Display Name"
        />
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={Driver1}
          onChange={event => this.setState(byPropKey('Driver1', event.target.value))}
          type="text"
          placeholder="Driver 1"
        />
        <input
          value={Driver2}
          onChange={event => this.setState(byPropKey('Driver2', event.target.value))}
          type="text"
          placeholder="Driver 2"
        />
        <button type="submit" disabled={isInvalid}>
          Add Player
        </button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }

}


export default (withRouter(AddPlayerForm));