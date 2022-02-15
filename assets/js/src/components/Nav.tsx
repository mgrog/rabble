import useAxios from 'axios-hooks';
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { styled } from '../../stitches.config';

function Nav() {
  const [req, session] = useAxios(
    {
      url: '/session',
      method: 'DELETE',
      withCredentials: true,
    },
    { manual: true },
  );

  const signout = async () => {
    try {
      await session();
    } finally {
      window.location.replace(window.location.origin);
    }
  };

  return (
    <StyledNav>
      <Menu fixed="top">
        <Menu.Header as={Link} to="/">
          <StyledHeader>Rabble</StyledHeader>
        </Menu.Header>
        <Menu.Menu position="right">
          <Menu.Item onClick={() => signout()}>Sign Out</Menu.Item>
        </Menu.Menu>
      </Menu>
    </StyledNav>
  );
}

// styles

const StyledNav = styled('div', {
  marginBottom: 40,
  '& .ui.menu': {
    height: '50px !important',
    paddingLeft: '15px !important',
    zIndex: '102 !important',
  },
});

const StyledHeader = styled('h1', {
  fontFamily: 'Righteous, cursive',
  color: '$gray-900',
  fontSize: '2.8em',
});

export { Nav };
