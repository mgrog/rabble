import useAxios from 'axios-hooks';
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
// @ts-ignore
import Identicon from 'react-identicons';
import { Button, Checkbox, Header, Input, List, Segment } from 'semantic-ui-react';
import { styled } from '../../stitches.config';
import { AppContext } from '../contexts/AppContext';
import useOutsideClick from '../hooks/useOutsideClick';
import { Participant, Room } from '../shared/interfaces/structs.interfaces';
import { ChatDataDispatch } from './SideMenu';

type Props = {
  toEdit?: Room;
  onSubmit: ({
    dispatch,
    participants,
  }: {
    dispatch: ChatDataDispatch;
    participants: Participant[];
  }) => void;
  setClosed: () => void;
  actionLoading: boolean;
};

const SidePanel = ({ toEdit, onSubmit, setClosed, actionLoading }: Props) => {
  const { store } = useContext(AppContext);
  const [roomName, setRoomName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Participant[]>([]);
  const [{ data, loading, error }] = useAxios('/api/participants');
  const ref = useRef(null);
  useOutsideClick(ref, () => setClosed());

  useEffect(() => {
    let usrs = (toEdit && toEdit.participants) || [];
    setSelectedUsers(usrs);
  }, [toEdit, setSelectedUsers]);

  const selectOptions = data?.data.filter((p: Participant) => p.user_id !== store?.user?.id);

  const dispatchAction: ChatDataDispatch = toEdit
    ? { action: 'edit', data: toEdit }
    : { action: 'create', data: roomName };

  return (
    <StyledPanel ref={ref}>
      {!toEdit ? (
        <Input
          fluid
          placeholder="Name the room..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      ) : (
        <Header as="h3">Edit {toEdit.title}</Header>
      )}
      <SidePanel.UsersSelect
        loading={loading}
        all={selectOptions}
        selected={selectedUsers}
        setSelected={setSelectedUsers}
      />
      <Button
        primary
        loading={actionLoading}
        onClick={() =>
          onSubmit({
            dispatch: dispatchAction,
            participants: [...selectedUsers],
          })
        }>
        {!toEdit ? 'Create' : 'Save Changes'}
      </Button>
    </StyledPanel>
  );
};

type UserSelectProps = {
  all: Participant[];
  selected: Participant[];
  setSelected: Dispatch<SetStateAction<Participant[]>>;
  loading: boolean;
};

SidePanel.UsersSelect = ({ all, selected, setSelected, loading }: UserSelectProps) => {
  const [filteredUsers, setFilteredUsers] = useState<Participant[]>([]);

  useEffect(() => filter(''), [all]);

  const filter = (text: string) => {
    let filtered = all?.filter(
      (x) => !text || x.nickname.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  const changeSelected = (prevState: Participant[], value: boolean, user: Participant) => {
    let newState = [];
    if (value === true) {
      newState = [...prevState, user];
    } else {
      newState = prevState.filter((u) => u.id !== user.id);
    }
    return newState;
  };

  let map = selected?.reduce((accum: any, x: Participant) => ((accum[x.id] = true), accum), {});

  const renderedItems = filteredUsers?.map((p) => {
    return (
      <List.Item key={p.id}>
        <List.Content floated="right">
          <Checkbox
            checked={map[p.id] || false}
            onChange={(_e, data) =>
              setSelected((prevState) => changeSelected(prevState, data.checked!, p))
            }
          />
        </List.Content>
        <Identicon bg="black" size="25" string={p.nickname}></Identicon>
        <List.Content>{p.nickname}</List.Content>
      </List.Item>
    );
  });

  return (
    <StyledUserSelect>
      <Input
        fluid
        placeholder="Type the username of a friend"
        onChange={(e) => filter(e.target.value)}
      />
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
