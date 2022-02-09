import React, { useCallback, useContext, useState, MouseEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { Participant, Room, User } from '../shared/interfaces/structs.interfaces';
import { Button, Icon, Input, Item, Menu } from 'semantic-ui-react';
import { styled } from '../../stitches.config';
import SidePanel from './SidePanel';
import { AppContext } from '../contexts/AppContext';

type PanelMode = 'create' | 'edit' | null;

const SideMenu = () => {
  const navigate = useNavigate();
  const [panelState, setPanelState] = useState<PanelMode>(null);
  const { store, setStore } = useContext(AppContext);
  const [links, setLinks] = useState<Room[]>([]);

  const togglePanel = (action: PanelMode) => {
    setPanelState(action);
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
          return;
      }
    },
    [setStore],
  );

  const channel = useChannel('global:lobby', onChannel);

  const addLink = (room: Room) => setLinks((prev) => [...prev, room]);
  const removeLink = (id: number) => setLinks((prev) => prev.filter((x) => x.id === id));

  const editRoom = (e: MouseEvent, room: Room) => {
    e.preventDefault();
    setPanelState('edit');
  };

  const leaveRoom = (e: MouseEvent, room: Room) => {
    e.preventDefault();
    navigate('/');
    channel.broadcast('leave_room', room);
  };

  const addChat = (roomName: string, participants: Participant[]) => {
    channel.broadcast('create_new', { title: roomName, participants });
  };

  return (
    <Menu vertical compact style={{ height: '100%' }}>
      <SideMenu.Header />
      {panelState && <SidePanel mode={panelState} onSubmit={addChat} setClosed={setPanelState} />}
      <SideMenu.Controls togglePanel={togglePanel} />
      <SideMenu.Content
        links={links}
        editRoom={editRoom}
        leaveRoom={(e, room: Room) => leaveRoom(e, room)}
      />
    </Menu>
  );
};

SideMenu.Header = () => {
  return <a>Rabble</a>;
};

SideMenu.Controls = ({ togglePanel }: { togglePanel: (action: PanelMode) => void }) => {
  return (
    <StyledControls>
      <span>Chatrooms</span>
      <Button
        circular
        compact
        basic
        icon="plus"
        size="mini"
        onClick={() => togglePanel('create')}></Button>
    </StyledControls>
  );
};

type ContentProps = {
  links: Room[];
  editRoom: (e: MouseEvent, room: Room) => void;
  leaveRoom: (e: MouseEvent, room: Room) => void;
};

SideMenu.Content = ({ links, editRoom, leaveRoom }: ContentProps) => {
  const renderedChatrooms = links.map((x) => (
    <Menu.Item as={NavLink} to={`/chatrooms/${x.id}`} id={x.id} key={x.id} name={x.title}>
      <StyledItem>
        <Item>
          <Item.Description>{x.title}</Item.Description>
          <Item.Extra>
            {x.participants.length} members{' '}
            <span className="link" onClick={(e) => editRoom(e, x)}>
              edit
            </span>{' '}
            <span className="danger" onClick={(e) => leaveRoom(e, x)}>
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

export { SideMenu, PanelMode };
