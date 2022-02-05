import React, { useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { User } from '../shared/interfaces/user.interface';

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
    <div className={`${pos()}`}>
      <Input placeholder="Name the room..." value={roomName} handler={setRoomName} />
      <CreateRoom.UsersSelect />
      <Button
        className={'text-white'}
        color={'blue'}
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
