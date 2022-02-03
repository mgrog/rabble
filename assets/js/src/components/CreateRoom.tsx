import React, { useState } from 'react';
import { User } from '../shared/interfaces/user.interface';
import { Input, Button } from './Elements';

type Props = {
  position?: 'right';
  loading?: boolean;
  onClose: (roomName: string, users: User[]) => void;
};

const CreateRoom = ({ loading = false, position = 'right', onClose }: Props) => {
  const pos = () => {
    switch (position) {
      case 'right':
        return 'left-full top-0 ml-2';
    }
  };

  const [roomName, setRoomName] = useState('');

  return (
    <div
      className={`border border-solid border-slate-400 bg-white p-4 rounded-lg absolute ${pos()}`}>
      <Input placeholder="Name the room..." value={roomName} handler={setRoomName} />
      <CreateRoom.UsersSelect />
      <Button
        className={'text-white'}
        color={'bg-blue-500'}
        hoverColor={'hover:bg-blue-600'}
        onClick={() => onClose(roomName, [])}>
        Create
      </Button>
    </div>
  );
};

CreateRoom.UsersSelect = () => {
  return <div>Select Users</div>;
};

export default CreateRoom;
