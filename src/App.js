import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import './homepage-layout';
import HomeContainer from './home';
import LoginContainer from './login'
import AuthRoute from './PrivateRoute'
import app from './base'
require('dotenv').config()

const Page = ({ title }) => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>{title}</h2>
    </div>
    <p className="App-intro">This is the {title} page.</p>
    <p><Link to="/">Home</Link></p>
    <p><Link to="/about">About</Link></p>
    <p><Link to="/settings">Settings</Link></p>
  </div>
);

const About = (props) => (
  <Page title="About"/>
);

const Settings = (props) => (
  <Page title="Settings"/>
);

class App extends Component {
  state = { 
    loading: true, 
    authenticated: false, 
    user: null 
  };
  componentWillMount() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }
  logout(history){
    app.auth().signOut().then(function() {
      console.log('Signed Out');
      history.push("/login");
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }
  render() {
    return (
   <Router>
        <Redirect path="/" to="/login" />
        <Route path="/login" component={LoginContainer}/>
        <Route path="/about" component={About}/>
        <Route path="/settings" component={Settings}/>
        <AuthRoute path="/home" component={Settings} authed={this.state.authenticated} user={this.state.user}/>
    </Router>
    );
  }
}

export default App;