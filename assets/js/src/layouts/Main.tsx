import { styled } from '../../stitches.config';
import React, { ReactNode, useContext, useEffect } from 'react';
import { Nav } from '../components/Nav';
import { Container } from 'semantic-ui-react';
import { SideMenu } from '../components/SideMenu';

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <Nav></Nav>
      <StyledLayout>
        <StyledSideContainer>
          <SideMenu />
        </StyledSideContainer>
        <StyledDynamicContent>{children}</StyledDynamicContent>
      </StyledLayout>
    </Page>
  );
}

const Page = styled('div', {
  display: 'flex',
  minHeight: '100vh',
  height: '100%',
  width: '100%',
});

const StyledLayout = styled('div', {
  display: 'flex',
  width: '100%',
});

const StyledSideContainer = styled('div', {
  '& .ui[class*="left fixed"].menu': {
    top: '$navbar-spacing',
    height: 'calc(100% - 40px)',
    minWidth: '232px',
    backgroundColor: 'white',
  },
});

const StyledDynamicContent = styled('div', {
  margin: '0 4px 0 235px',
  width: 'calc(100% - 235px)',
  height: '100%',
  backgroundColor: 'white',
});

export default MainLayout;
