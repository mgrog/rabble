import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import useAxios from 'axios-hooks';
import { Button, Checkbox, Input, List, Image } from 'semantic-ui-react';
import { Participant, User } from '../shared/interfaces/structs.interfaces';
import { styled } from '../../stitches.config';
import { AppContext } from '../contexts/AppContext';

type Props = {
  mode?: 'create' | 'add';
  onSubmit: (roomName: string, participants: Participant[]) => void;
};

const SidePanel = ({ mode = 'create', onSubmit }: Props) => {
  const { store } = useContext(AppContext);
  const [roomName, setRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Participant[]>([]);
  const [{ data, loading, error }] = useAxios('/api/participants');

  const participants = data?.data.filter((p: Participant) => p.user_id !== store.user.id);
  console.log(store.user);

  return (
    <StyledPanel>
      <Input
        fluid
        placeholder="Name the room..."
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <SidePanel.UsersSelect
        data={participants}
        selected={selectedUsers}
        setSelected={setSelectedUsers}
      />
      <Button
        primary
        onClick={() => onSubmit(roomName, [store.user.participant, ...selectedUsers])}>
        Create
      </Button>
    </StyledPanel>
  );
};

SidePanel.UsersSelect = ({
  data = [],
  selected,
  setSelected,
}: {
  data: Participant[];
  selected: Participant[];
  setSelected: Dispatch<SetStateAction<Participant[]>>;
}) => {
  console.log(selected);

  const changeSelected = (prevState: Participant[], value: boolean, user: Participant) => {
    if (value === true) {
      return [...prevState, user];
    } else {
      return prevState.filter((u) => u.id === user.id);
    }
  };

  const renderedItems = data.map((usr, i) => {
    return (
      <List.Item key={i}>
        <List.Content floated="right">
          <Checkbox
            onChange={(_e, data) =>
              setSelected((prevState) => changeSelected(prevState, data.checked, usr))
            }
          />
        </List.Content>
        <Image avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
        <List.Content>{usr.nickname}</List.Content>
      </List.Item>
    );
  });

  return (
    <StyledUserSelect>
      <Input fluid placeholder="Type the username of a friend" />
      <List divided verticalAlign="middle">
        {renderedItems}
      </List>
    </StyledUserSelect>
  );
};

const StyledPanel = styled('div', {
  position: 'absolute',
  left: '100%',
  top: 0,
  marginLeft: '0.5rem',
  backgroundColor: 'White',
  padding: '1rem',
  border: 'solid 1px $slate-300',
  borderTopRightRadius: '0.5rem',
  borderBottomRightRadius: '0.5rem',
  width: '20rem',
});

const StyledUserSelect = styled('div', {
  backgroundColor: 'slate-200',
});

export default SidePanel;
