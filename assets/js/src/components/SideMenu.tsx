import React, { ReactNode, useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { Room } from '../shared/interfaces/room.interface';
import { User } from '../shared/interfaces/user.interface';
import CreateRoom from './CreateRoom';
import { Button, Icon, Input, Item, Label, Menu } from 'semantic-ui-react';
import { styled } from '../../stitches.config';

const SideMenu = () => {
  const [links, setLinks] = useState<Room[]>([]);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const addLink = (room: Room) => setLinks((prev) => [...prev, room]);
  const removeLink = (id: number) => setLinks((prev) => prev.filter((x) => x.id === id));

  const onChannel = useCallback(
    (event, payload) => {
      switch (event) {
        case 'phx_reply':
          console.log('channel connected', event, payload);
          const rooms = payload.response?.user.rooms;
          return rooms && setLinks(rooms);
        case 'rooms:new':
          console.log('new', event, payload);
          setCreatingRoom(false);
          const newRoom = payload.chatroom;
          return addLink(newRoom);
      }
    },
    [setLinks],
  );

  const { broadcast, loading, error } = useChannel('account', onChannel);

  console.log(loading, error);

  const addChat = (roomName: string, users: User[]) => {
    broadcast('create_new', { title: roomName, users });
  };

  const renderedChatrooms = links.map((x) => (
    <Menu.Item as={NavLink} to={`/chatrooms/${x.id}`} id={x.id} key={x.id} name={x.title}>
      <StyledItem>
        <Item>
          <Item.Description>{x.title}</Item.Description>
          <Item.Extra>members </Item.Extra>
        </Item>
        <Icon name="group" />
      </StyledItem>
    </Menu.Item>
  ));

  return (
    <Menu vertical compact style={{ height: '100%' }}>
      <SideMenu.Header />
      <SideMenu.Controls addChatroom={() => setCreatingRoom(true)} />
      <StyledLinksContainer>{renderedChatrooms}</StyledLinksContainer>
      <StyledMenuFilter>
        <Menu.Item>
          <Input icon="search" placeholder="Filter rooms..." />
        </Menu.Item>
      </StyledMenuFilter>
    </Menu>
  );
};

SideMenu.Header = () => {
  return <a>Rabble</a>;
};

SideMenu.Controls = ({ addChatroom }: { addChatroom: () => void }) => {
  return (
    <StyledControls>
      <span>Chatrooms</span>
      <Button circular compact basic icon="plus" size="mini" onClick={addChatroom}></Button>
    </StyledControls>
  );
};

// styles

const StyledControls = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.2em 1em',

  '& span': {
    marginRight: '10px',
    fontWeight: '600',
  },

  '& button': {
    marginRight: '-0.2em !important',
  },
});

const StyledItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& .item': {
    padding: '0 !important',
  },
});

const StyledLinksContainer = styled('div', {
  maxHeight: 'calc(100vh - 142px)',
  overflowY: 'auto',
});

const StyledMenuFilter = styled('div', {
  position: 'sticky',
  top: 'calc(100vh - 71px)',
});

export default SideMenu;
