import React, { useCallback, useContext, useState, MouseEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { Participant, Room, User } from '../shared/interfaces/structs.interfaces';
import { Button, Icon, Input, Item, Menu } from 'semantic-ui-react';
import { styled } from '../../stitches.config';
import SidePanel from './SidePanel';
import { AppContext } from '../contexts/AppContext';
import { PhxBroadcast, PhxReply } from '../shared/interfaces/phx-response.types';

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
  | PhxBroadcast<'joined_room' | 'left_room' | 'deleted_room', Room>;

const SideMenu = () => {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const { setStore } = useContext(AppContext);
  const [links, setLinks] = useState<Room[]>([]);
  const [roomToEdit, setRoomToEdit] = useState<Room | undefined>();

  const onChannel = useCallback(
    (dispatch: AccountResponse) => {
      console.log(dispatch);
      switch (dispatch.type) {
        case 'phx_reply':
          const { response } = dispatch.payload;
          if (dispatch.payload.status === 'ok') {
            const { user } = response;
            setLinks(user.rooms);
            return setStore({ user: user });
          } else {
            return;
          }
        case 'joined_room':
        case 'left_room':
          updateLink(dispatch.payload.data);
          return;
        case 'deleted_room':
          removeLink(dispatch.payload.data.id);
          return;
      }
    },
    [setStore],
  );

  const channel = useChannel('global:lobby', {
    onMessage: onChannel,
    setState: () => setPanelOpen(false),
  });

  const updateLink = (room: Room) =>
    setLinks((prev) => prev.filter((x) => x.id !== room.id).concat([room]));

  const removeLink = (id: number) => setLinks((prev) => prev.filter((x) => x.id !== id));

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
    <Menu vertical compact secondary fixed="left">
      {panelOpen && (
        <SidePanel
          toEdit={roomToEdit}
          onSubmit={saveChat}
          setClosed={() => setPanelOpen(false)}
          actionLoading={channel.loading}
        />
      )}
      <SideMenu.Controls openCreatePanel={() => openRoomPanel()} />
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
  const renderedChatrooms = links?.map((x) => (
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
            <Input icon="search" placeholder="Filter rooms..." />
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
  marginTop: '0.5rem',
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
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
  },
});

const StyledLinksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 142px)',
  overflowY: 'auto',
});

const StyledMenuFilter = styled('div', {
  position: 'absolute',
  bottom: 0,
  marginBottom: '1rem',
  width: '100%',
});

const Dangerlink = styled('a', {
  color: '$red-600',
  float: 'right',
});

export { SideMenu, ChatDataDispatch };
