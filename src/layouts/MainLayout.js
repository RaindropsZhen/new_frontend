import { Navbar, Nav, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import React, { useContext } from 'react';

import AuthContext from '../contexts/AuthContext';


const MainLayout = ({ children }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const onSignIn = () => {
    history.replace("/login");
  }

  const onSignOut = () => {
    auth.signOut();
    history.push("/login");
  }

  const goToPlaces = () => {
    history.push("/places");
  }

  return (
    <div>
      <Navbar bg="light" variant="light" className="mb-4">
        <Navbar.Brand href="/">QR Menu</Navbar.Brand>
        <Nav>
          <Nav.Link onClick={goToPlaces}>我的餐厅</Nav.Link>
        </Nav>

        <Nav className="flex-grow-1 justify-content-end">

        {auth.token ? (
            <Nav.Link onClick={onSignOut}>退出</Nav.Link>
          ) : (
            [
              <Nav.Link key={1} onClick={onSignIn}>登录</Nav.Link>
            ]
          )}
        </Nav>
      </Navbar>
      <Container>
        {children}
      </Container>
    </div>
  )
}

export default MainLayout;
