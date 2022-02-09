import React, { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import useAxios from 'axios-hooks';
import { Button, Checkbox, Input, List, Segment } from 'semantic-ui-react';
import { Participant } from '../shared/interfaces/structs.interfaces';
import { styled } from '../../stitches.config';
import { AppContext } from '../contexts/AppContext';
// @ts-ignore
import Identicon from 'react-identicons';
import useOutsideClick from '../hooks/useOutsideClick';
import { PanelMode } from './SideMenu';

type Props = {
  mode?: 'create' | 'edit';
  onSubmit: (roomName: string, participants: Participant[]) => void;
  setClosed: Dispatch<SetStateAction<PanelMode>>;
};

const SidePanel = ({ mode = 'create', onSubmit, setClosed }: Props) => {
  const { store } = useContext(AppContext);
  const [roomName, setRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Participant[]>([]);
  const [{ data, loading, error }] = useAxios('/api/participants');
  const ref = useRef(null);
  useOutsideClick(ref, Boolean(mode), () => setClosed(null));

  const participants = data?.data.filter((p: Participant) => p.user_id !== store?.user?.id);

  return (
    <StyledPanel ref={ref}>
      {mode === 'create' && (
        <Input
          fluid
          placeholder="Name the room..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      )}
      <SidePanel.UsersSelect
        loading={loading}
        data={participants}
        selected={selectedUsers}
        setSelected={setSelectedUsers}
      />
      <Button
        primary
        onClick={() => onSubmit(roomName, [store.user!.participant, ...selectedUsers])}>
        {mode === 'create' ? 'Create' : 'Add Friends'}
      </Button>
    </StyledPanel>
  );
};

SidePanel.UsersSelect = ({
  data = [],
  setSelected,
  loading,
}: {
  data: Participant[];
  selected: Participant[];
  setSelected: Dispatch<SetStateAction<Participant[]>>;
  loading: boolean;
}) => {
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
              setSelected((prevState) => changeSelected(prevState, data.checked!, usr))
            }
          />
        </List.Content>
        <Identicon bg="black" size="25" string={usr.nickname}></Identicon>
        <List.Content>{usr.nickname}</List.Content>
      </List.Item>
    );
  });

  return (
    <StyledUserSelect>
      <Input fluid placeholder="Type the username of a friend" />
      <Segment loading={loading}>
        <StyledList>
          <List divided verticalAlign="middle">
            {renderedItems}
          </List>
        </StyledList>
      </Segment>
    </StyledUserSelect>
  );
};

const StyledPanel = styled('div', {
  position: 'absolute',
  left: '100%',
  top: 0,
  marginLeft: '0.5rem',
  padding: '1rem',
  border: 'solid 1px $slate-300',
  borderTopRightRadius: '0.5rem',
  borderBottomRightRadius: '0.5rem',
  width: '20rem',
  backgroundColor: '$slate-200',

  '& input': {
    marginBottom: '0.5rem !important',
  },
});

const StyledUserSelect = styled('div', {
  backgroundColor: 'slate-200',
  marginBottom: '1rem',
});

const StyledList = styled('div', {
  minHeight: '5rem',
  maxHeight: '15rem',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '2px',
});

export default SidePanel;
