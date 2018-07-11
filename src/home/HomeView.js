import React from 'react'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Button,
} from 'semantic-ui-react'

const HomeView = () => (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src='/icon.png' style={{ marginRight: '1.5em' }} />
          Fantasy F1
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>
      </Container>
    </Menu>

    <Container text style={{ marginTop: '7em' }}>
    <Image src='/icon.png' style={{ marginTop: '2em' }} />
      <Header as='h1'>Fanstasy F1</Header>
      <p>This is a basic app in an effort to manage the data better.</p>
      <p>
        I'm happy to hear your thoughts on this and any ideas to take it further.
      </p>
    </Container>
  </div>
)

export default HomeView