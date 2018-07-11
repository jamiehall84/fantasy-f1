import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import HomeContainer from './home';
import LoginContainer from './login'
import Profile from './profile'
import AuthRoute from './PrivateRoute'
import SidebarNav from './sidebar-nav'
import app from './base'
import {
    Container,
    Image,
    Menu,
    Button,
    Header,
    Icon,
    Segment,
    Sidebar
  } from 'semantic-ui-react'


const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={Topic}/>
    <Route exact path={match.path} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

class BasicExample extends React.Component {
    state = { 
        loading: true, 
        authenticated: false, 
        user: null ,
        visible: false
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
        }, function(error) {
        console.error('Sign Out Error', error);
        });
    }
    handleButtonClick = () => this.setState({ visible: !this.state.visible })

    handleSidebarHide = () => this.setState({ visible: false })

    render() {
        const { visible } = this.state
        return (
        <Router>
            <div>

                
                <Sidebar.Pushable as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={this.handleSidebarHide}
                        vertical
                        visible={visible}
                        width='thin'
                    >
                        {this.state.authenticated?
                        <div>
                        <Menu.Item as={Link} to="/" onClick={this.handleButtonClick}>
                            <Icon name='home' />
                            Home
                        </Menu.Item>
                        <Menu.Item as={Link} to="/profile" onClick={this.handleButtonClick}>
                        <Icon name='user' />
                        Profile
                        </Menu.Item>
                        <Menu.Item as='a'onClick={this.logout} onClick={this.handleButtonClick}>
                        <Icon name='log out' />
                        Log out
                        </Menu.Item>
                        </div>
                        : 
                        <div>
                            <Menu.Item as={Link} to="/login" >
                        <Icon name='log out' />
                        Log in
                        </Menu.Item>
                        </div>
                            }
                    </Sidebar>

                    <Sidebar.Pusher 
                    dimmed={visible}
                    style={{ minHeight: '100vh' }}>
                        <Menu fixed='top' inverted>
                            <Container>
                                <Menu.Item as='a' header>
                                <Image size='mini' src='/icon.png' style={{ marginRight: '1.5em' }} />
                                Fantasy F1
                                </Menu.Item>
                                <Menu.Item as='a' onClick={this.handleButtonClick}>
                                    <Icon name='bars' />
                                </Menu.Item>
                            </Container>
                        </Menu>
                        <AuthRoute exact path="/" component={HomeContainer} authed={this.state.authenticated} user={this.state.currentUser}/>
                        <AuthRoute exact path="/profile" component={Profile} authed={this.state.authenticated} user={this.state.currentUser}/>
                        <Route path="/login" component={LoginContainer} authed={this.state.authenticated}/>
                        <Route path="/topics" component={Topics}/>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                
                
        

            
            </div>
        </Router>
        )
    }
}
export default BasicExample