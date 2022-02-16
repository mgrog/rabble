import { Presence } from 'phoenix';
import React, { MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Header, Icon, Input, Item, Menu } from 'semantic-ui-react';
import { styled } from '../../stitches.config';
import { AppContext } from '../contexts/AppContext';
import { useChannel } from '../hooks/useChannel';
import {
  PhxBroadcast,
  PhxPresence,
  PhxReply,
  PresenceDiff,
  PresenceState,
} from '../shared/interfaces/phx-response.types';
import { Participant, Room, User } from '../shared/interfaces/structs.interfaces';
import SidePanel from './SidePanel';

type CreateChat = {
  action: 'create';
  data: string;
};

type EditChat = {
  action: 'edit';
  data: Room;
};

type ChatDataDispatch = CreateChat | EditChat;

type AccountResponse =
  | PhxReply<{ user: User }>
  | PhxBroadcast<'joined_room' | 'updated_room' | 'left_room' | 'deleted_room', Room>
  | PhxPresence<'presence_diff', PresenceDiff>
  | PhxPresence<'presence_state', PresenceState>;

const SideMenu = () => {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const { store, storeDispatch } = useContext(AppContext);
  const [links, setLinks] = useState<Room[]>([]);
  const [roomToEdit, setRoomToEdit] = useState<Room | undefined>();

  const onChannel = useCallback(
    (dispatch: AccountResponse) => {
      // console.log(dispatch);
      {
        let presences;
        switch (dispatch.type) {
          case 'phx_reply':
            const { response } = dispatch.payload;
            if (dispatch.payload.status === 'ok') {
              const { user } = response;
              setLinks(user.rooms);
              storeDispatch({ type: 'user', value: user });
            }
            return;
          case 'joined_room':
          case 'left_room':
          case 'updated_room':
            updateLink(dispatch.payload.data);
            return;
          case 'deleted_room':
            removeLink(dispatch.payload.data.id);
            return;
          case 'presence_diff':
            presences = Presence.syncDiff(store.presences, dispatch.payload);
            storeDispatch({ type: 'presences', value: presences });
            return;
          case 'presence_state':
            presences = Presence.syncState(store.presences, dispatch.payload);
            storeDispatch({ type: 'presences', value: presences });
            return;
        }
      }
    },
    [store, storeDispatch],
  );

  const channel = useChannel('global:lobby', {
    onMessage: onChannel,
    setState: () => setPanelOpen(false),
  });

  const updateLink = (room: Room) => {
    setLinks((prev) => [...prev.filter((x) => x.id !== room.id), room]);
  };

  const removeLink = (id: number) => {
    setLinks((prev) => prev.filter((x) => x.id !== id));
  };

  const editRoom = (e: MouseEvent, room: Room) => {
    e.preventDefault();
    openRoomPanel(room);
  };

  const leaveRoom = (e: MouseEvent, room: Room) => {
    e.preventDefault();
    navigate('/');
    channel.broadcast('leave_room', room);
  };

  const saveChat = ({
    dispatch,
    participants,
  }: {
    dispatch: ChatDataDispatch;
    participants: Participant[];
  }) => {
    switch (dispatch.action) {
      case 'create':
        return channel.broadcast('create_new', { title: dispatch.data, participants });
      case 'edit':
        return channel.broadcast(`edit_room`, { room: dispatch.data, participants });
      default:
        'do nothing';
    }
  };

  const openRoomPanel = (room?: Room) => {
    setRoomToEdit(room);
    setPanelOpen(true);
  };

  return (
    <Menu vertical compact fixed="left">
      {panelOpen && (
        <SidePanel
          toEdit={roomToEdit}
          onSubmit={saveChat}
          setClosed={() => setPanelOpen(false)}
          actionLoading={channel.loading}
        />
      )}
      <SideMenu.Controls openCreatePanel={() => openRoomPanel()} />
      {!links?.length && (
        <Header as="h4" textAlign="center">
          No Chatrooms!
          <Header.Subheader>Click the (+) button!</Header.Subheader>
        </Header>
      )}
      <SideMenu.Content
        links={links}
        editRoom={editRoom}
        leaveRoom={(e, room: Room) => leaveRoom(e, room)}
      />
    </Menu>
  );
};

SideMenu.Controls = ({ openCreatePanel }: { openCreatePanel: () => void }) => {
  return (
    <StyledControls>
      <span>Chatrooms</span>
      <Button
        circular
        compact
        basic
        icon="plus"
        size="mini"
        onClick={() => openCreatePanel()}></Button>
    </StyledControls>
  );
};

type ContentProps = {
  links: Room[];
  editRoom: (e: MouseEvent, room: Room) => void;
  leaveRoom: (e: MouseEvent, room: Room) => void;
};

SideMenu.Content = ({ links, editRoom, leaveRoom }: ContentProps) => {
  const [filteredLinks, setFilteredLinks] = useState<Room[]>([]);

  useEffect(() => filter(''), [links]);

  const filter = (text: string) => {
    let filtered = links.filter((x) => !text || x.title.toLowerCase().includes(text.toLowerCase()));
    setFilteredLinks(filtered);
  };

  const renderedChatrooms = filteredLinks?.map((x) => (
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
        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              icon="search"
              placeholder="Filter rooms..."
              onChange={(e) => filter(e.target.value)}
            />
          </Menu.Item>
        </Menu.Menu>
      </StyledMenuFilter>
    </>
  );
};

// styles

const StyledControls = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0',
  padding: '0.5rem 1.2rem',
  borderBottom: '$semantic-border',

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

  '& .description': {
    overflow: 'hidden !important',
    textOverflow: 'ellipsis !important',
    maxWidth: 180,
  },

  '& .item': {
    paddingRight: '0 !important',
  },
});

const StyledLinksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 142px)',
  overflowY: 'auto',

  '& .item:not(a)': {
    paddingLeft: '1.2rem !important',
    paddingTop: '0.8rem !important',
    paddingBottom: '0.8rem !important',

    '&:last-child': {
      borderBottom: '$semantic-border',
    },
  },

  '& a': {
    paddingLeft: '0 !important',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
  },
});

const StyledMenuFilter = styled('div', {
  position: 'absolute',
  bottom: 0,
  marginBottom: '1rem',
  width: '100%',
});

export { SideMenu, ChatDataDispatch };
