import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/index.js';

const Header = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  const isAuthorized = !!auth.user;
  const handleClick = () => auth.signout();

  return (
    <Navbar bg="white" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">
          {t('header.title')}
        </Navbar.Brand>
        {isAuthorized && (
          <Button
            onClick={handleClick}
          >
            {t('header.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
