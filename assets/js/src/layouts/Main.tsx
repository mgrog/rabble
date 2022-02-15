import { styled } from '../../stitches.config';
import React, { ReactNode, useContext, useEffect } from 'react';
import { Nav } from '../components/Nav';
import { Container } from 'semantic-ui-react';
import { SideMenu } from '../components/SideMenu';

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <Nav />
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
  width: '100vw',
});

const StyledLayout = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
});

const StyledSideContainer = styled('div', {
  width: 232,
  '& .ui[class*="left fixed"].menu': {
    top: '$navbar-spacing',
    height: 'calc(100% - 40px)',
    minWidth: '232px',
    backgroundColor: 'white',
  },
});

const StyledDynamicContent = styled('div', {
  height: '100%',
  backgroundColor: 'white',
  flexGrow: 1,
  margin: '0 2px',
  overflow: 'hidden',
});

export default MainLayout;
