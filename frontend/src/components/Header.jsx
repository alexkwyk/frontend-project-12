import { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import AuthContext from '../contexts/index.js';

const Header = () => {
  const auth = useContext(AuthContext);
  const isAuthorized = !!auth.user;
  const handleClick = () => auth.signout();
  return (
    <Navbar bg="white" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
        {isAuthorized && (
          <Button
            onClick={handleClick}
          >
            Выйти
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
