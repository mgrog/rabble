import { styled } from '../../stitches.config';
import React, { ReactNode, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { SideMenu } from '../components/SideMenu';

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <StyledLayout>
        <StyledSideContainer>
          <SideMenu />
        </StyledSideContainer>
        <Container fluid>
          <StyledDynamicContent>{children}</StyledDynamicContent>
        </Container>
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
  position: 'sticky',
  top: '14px',
  height: '100vh',
  zIndex: 500,
});

const StyledDynamicContent = styled('div', {
  margin: '0 1.5em',
  height: '100%',
  backgroundColor: 'white',
  border: '$semantic-border',
  boxShadow: '$semantic-shadow',
  borderRadius: '$semantic-border-radius',
  padding: '0.5rem',
});

export default MainLayout;
