import React, { Component } from 'react';
import AuthUserContext from './AuthUserContext';
import ProfileForm from './ProfileForm';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from '../components/withAuthorization';
import { Container, Header, Grid } from 'semantic-ui-react';

class AccountPage extends Component {
	render(){
		return(
			<AuthUserContext.Consumer>
				{authUser => 
					<Container style={{ marginTop: '6em' }}>
						<Header as='h1' color='green'>{authUser.displayName}</Header>
						<Grid columns={3} stackable>
							<Grid.Row>
								<Grid.Column>
									<p>So... I've not sorted out the profile page yet. But the idea is that this is where you will be able to manage your account. Update your password, add profile pics, that kinda shit. However, being that all that shit aint really important, it can wait.</p>
									{/* <Image src={authUser.photoURL} size='medium' circular /> */}
								</Grid.Column>
								<Grid.Column>
									{this.props.season.Players && <ProfileForm user={authUser} season={this.props.season} /> }
								</Grid.Column>
								<Grid.Column>
									{/* <Header as='h3' color='green'>Password shit</Header>
									<PasswordForgotForm />*/}
									<PasswordChangeForm /> 
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Container>
				}
			</AuthUserContext.Consumer>
		);
	}
}
const authCondition = (authUser) => !! authUser;

export default withAuthorization(authCondition)(AccountPage);