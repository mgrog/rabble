import React, { ReactNode, useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { Room } from '../shared/interfaces/room.interface';
import { User } from '../shared/interfaces/user.interface';
import CreateRoom from './CreateRoom';
import { Button } from 'semantic-ui-react';

const Menu = () => {
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

  const renderedLinks = links.map((x) => (
    <Menu.Link
      id={x.id}
      key={x.id}
      content={x.title}
      removeChatroom={() => broadcast('delete', { id: x.id })}></Menu.Link>
  ));
  return (
    <div>
      <Menu.Header />
      <Menu.Controls addChatroom={() => setCreatingRoom(true)}>
        {creatingRoom && <CreateRoom onClose={addChat} />}
      </Menu.Controls>
      {renderedLinks}
    </div>
  );
};

Menu.Header = () => {
  return <button className="p-8">Rabble</button>;
};

Menu.Controls = ({ addChatroom, children }: { addChatroom: () => void; children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between h-8 relative">
      <span className="text-xs font-bold cursor-default uppercase px-2">Chatrooms</span>
      <Button onClick={addChatroom}>+</Button>
      {children}
    </div>
  );
};

type LinkProps = {
  id: number;
  content: string;
  removeChatroom: () => void;
};

Menu.Link = ({ id, content, removeChatroom }: LinkProps) => {
  return (
    <NavLink
      to={`/chatrooms/${id}`}
      className={`group px-2 py-3 text-left text-sm border-solid border-t last:border-b border-slate-200 hover:bg-slate-100 
      ${({ isActive }) => isActive && 'bg-slate-200'}`}>
      {content}
      <button
        className="float-right text-base text-transparent group-hover:text-inherit pl-4 leading-5"
        onClick={removeChatroom}>
        {'\u2715'}
      </button>
    </NavLink>
  );
};

export default Menu;
