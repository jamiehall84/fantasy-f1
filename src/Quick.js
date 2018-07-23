import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Login from './login'
import Dashboard from './pages/dashboard'
import AccountPage from './components/Account';
import PasswordForgetPage from './components/PasswordForget';
import {
    Container,
    Image,
    Menu,
    Icon,
    Segment,
    Sidebar
  } from 'semantic-ui-react';
import * as routes from './constants/routes';
import withAuthentication from './components/withAuthentication';
import Navigation from './components/Navigation';
import AdminPage from './pages/Admin';
import Race from './pages/Race';
import SeasonPage from './pages/Season';
import PlayerPage from './pages/Player';
import LandingPage from './pages/landing';


class App extends React.Component {
    state = { 
        visible: false
    };
    
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
                    <Navigation onClick={this.handleSidebarHide.bind(this)} />
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
                        <Route exact path={routes.LANDING} component={()=> <LandingPage />} />
                        <Route exact path={routes.SIGN_IN} component={()=> <Login />} />
                        <Route exact path={routes.HOME} component={()=><Dashboard />} />
                        <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
                        <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
                        <Route exact path={routes.ADMIN} component={() => <AdminPage />} />
                        <Route exact path={routes.SEASON} component={() => <SeasonPage />} />
                        <Route exact path={routes.RACE} component={Race} />
                        <Route exact path={routes.PLAYER} component={PlayerPage} />
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                
                
        

            
            </div>
        </Router>
        )
    }
}
export default withAuthentication(App)