import React, { useCallback, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { Participant, Room, User } from '../shared/interfaces/structs.interfaces';
import { Button, Icon, Input, Item, Menu } from 'semantic-ui-react';
import { styled } from '../../stitches.config';
import SidePanel from './SidePanel';
import { AppContext } from '../contexts/AppContext';

const SideMenu = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const { store, setStore } = useContext(AppContext);
  const [links, setLinks] = useState<Room[]>([]);

  const addLink = (room: Room) => setLinks((prev) => [...prev, room]);
  const removeLink = (id: number) => setLinks((prev) => prev.filter((x) => x.id === id));

  const togglePanel = (action?: 'open' | 'close') => {
    switch (action) {
      case 'open':
        return setPanelOpen(true);
      case 'close':
        return setPanelOpen(false);
      default:
        return setPanelOpen((prevState) => !prevState);
    }
  };

  const onChannel = useCallback(
    (event, payload) => {
      switch (event) {
        case 'phx_reply':
          console.log('channel connected', event, payload);
          const { user } = payload.response;
          setLinks(user?.rooms);
          return setStore({ user: user });
        case 'joined_room':
          console.log('joined', event, payload);
          addLink(payload.chatroom);
          return;
        case 'left_room':
          console.log(payload);
          return;
      }
    },
    [setStore],
  );

  const channel = useChannel('global:lobby', onChannel);

  const addChat = (roomName: string, participants: Participant[]) => {
    channel.broadcast('create_new', { title: roomName, participants });
  };

  return (
    <Menu vertical compact style={{ height: '100%' }}>
      <SideMenu.Header />
      {panelOpen && <SidePanel onSubmit={addChat} />}
      <SideMenu.Controls togglePanel={togglePanel} />
      <SideMenu.Content
        links={links}
        addMembers={(room: Room) => console.log('add')}
        leaveRoom={(room: Room) => channel.broadcast('leave_room', room)}
      />
    </Menu>
  );
};

SideMenu.Header = () => {
  return <a>Rabble</a>;
};

SideMenu.Controls = ({ togglePanel }: { togglePanel: () => void }) => {
  return (
    <StyledControls>
      <span>Chatrooms</span>
      <Button circular compact basic icon="plus" size="mini" onClick={() => togglePanel()}></Button>
    </StyledControls>
  );
};

type ContentProps = {
  links: Room[];
  addMembers: (room: Room) => void;
  leaveRoom: (room: Room) => void;
};

SideMenu.Content = ({ links, addMembers, leaveRoom }: ContentProps) => {
  const renderedChatrooms = links.map((x) => (
    <Menu.Item as={NavLink} to={`/chatrooms/${x.id}`} id={x.id} key={x.id} name={x.title}>
      <StyledItem>
        <Item>
          <Item.Description>{x.title}</Item.Description>
          <Item.Extra>
            {x.participants.length} members{' '}
            <span className="link" onClick={() => addMembers(x)}>
              add
            </span>{' '}
            <span className="danger" onClick={() => leaveRoom(x)}>
              leave
            </span>
          </Item.Extra>
        </Item>
        <Icon name="group" />
      </StyledItem>
    </Menu.Item>
  ));

  return (
    <>
      <StyledLinksContainer>{renderedChatrooms}</StyledLinksContainer>
      <StyledMenuFilter>
        <Menu.Item>
          <Input icon="search" placeholder="Filter rooms..." />
        </Menu.Item>
      </StyledMenuFilter>
    </>
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

const Dangerlink = styled('a', {
  color: '$red-600',
  float: 'right',
});

export default SideMenu;
