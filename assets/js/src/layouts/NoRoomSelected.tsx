import React from 'react';
import { styled } from '../../stitches.config';
import { Header } from 'semantic-ui-react';

function NoRoomSelected() {
  return (
    <StyledPage>
      <Header as="h1" textAlign="center">
        It's Empty in Here...
        <Header.Subheader>Select a chatroom!</Header.Subheader>
      </Header>
    </StyledPage>
  );
}

const StyledPage = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
});

export default NoRoomSelected;
