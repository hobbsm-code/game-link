import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Dropdown } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';


import Auth from '../utils/auth';

// fetch the user info from the database
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const { data } = useQuery(GET_ME);

  const user = data?.me || {};



  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noopener noreferrer">
            Enable CORS for your browser
          </a>
          <Navbar.Brand as={Link} to='/'>

          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="navbar-dropdown">
                  Menu
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to='/'>Search For Games</Dropdown.Item>
                  {Auth.loggedIn() ? (<>
                    <Dropdown.Item as={Link} to='/saved'>See Your Games</Dropdown.Item>
                    <Dropdown.Item as={Link} to='/leaderboard'>Leaderboard</Dropdown.Item>

                  </>) : null}



                </Dropdown.Menu>
              </Dropdown>

              {/* <Nav.Link as={Link} to='/'>
                Search For Games
              </Nav.Link> */}

              {Auth.loggedIn() ? (
                <>
                  <Nav.Link disabled>Welcome {user.username}!</Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
