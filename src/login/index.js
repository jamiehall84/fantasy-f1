import React, { Component } from "react";
import app from "../base";
import {Redirect} from 'react-router-dom'

import LoginView from "./LoginView";

class LoginContainer extends Component {
  constructor(props){
    super(props);
  }
  ComponentDidMount() {
      if(this.props.authed===true){
        this.props.history.push('/');
      }
  }
  handleLogin = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      const user = await app
        .auth()
        .signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return(
    this.props.authed===true?
    <Redirect to={{pathname: '/login'}} />
     
     :
     <LoginView onSubmit={this.handleLogin} />
    );
  }
}

export default LoginContainer;