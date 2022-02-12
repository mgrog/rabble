import React, {
  KeyboardEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { styled } from '../../stitches.config';
import Feed from './Feed';
import { Message, Participant, Room } from '../shared/interfaces/structs.interfaces';
import { Header } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';
import { PhxBroadcast, PhxReply } from '../shared/interfaces/phx-response.types';

const Chat = () => {
  const params = useParams();
  const [currentMessage, setCurrentMessage] = useState('');
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  type ChatResponse = PhxReply<{ room: Room }> | PhxBroadcast<'message_added', Message>;

  const chatConnect = useCallback(
    (dispatch: ChatResponse) => {
      console.log(dispatch);
      switch (dispatch.type) {
        case 'phx_reply':
          let { room } = dispatch.payload.response;
          setTitle(room.title);
          setMessages(room.messages);
          setParticipants(room.participants);
          return;
        case 'message_added':
          setMessages((prevState) => [...prevState, { ...dispatch.payload.data }]);
      }
    },
    [setMessages],
  );

  const channel = useChannel(`room:${params.roomId}`, { onMessage: chatConnect });

  const addMessage = (content: string) => {
    channel.broadcast('message', { content });
  };

  const renderedMembers = participants.slice(0, 8).map((x) => (
    <b key={x.id} title={`${x.nickname}'s user profile`}>
      @{x.nickname}
    </b>
  ));

  return (
    <>
      <Chat.Title>
        <Header as={'h2'}>
          {title || 'loading...'}
          <Header.Subheader>
            <StyledUserLink>
              <span>{participants.length} members</span> {renderedMembers}{' '}
              {participants.length > 8 && <b>...</b>}
            </StyledUserLink>
          </Header.Subheader>
        </Header>
      </Chat.Title>
      <Chat.Box>
        <Feed feedMessages={messages}></Feed>
      </Chat.Box>
      <Chat.Input value={currentMessage} setValue={setCurrentMessage} addMessage={addMessage} />
    </>
  );
};

Chat.Box = ({ children }: { children: ReactNode }) => {
  return <StyledBox>{children}</StyledBox>;
};

Chat.Title = ({ children }: { children: ReactNode }) => <StyledTitle>{children}</StyledTitle>;

type InputProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  addMessage: (text: string) => void;
};

Chat.Input = ({ value, setValue, addMessage }: InputProps) => {
  const updateTextBox = (text: string) => {
    setValue(text);
  };

  const enterMessage = (text: string) => {
    setValue('');
    text.length && addMessage(text);
  };

  const handleInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        return enterMessage(value);
    }
  };

  return (
    <StyledInput>
      <TextareaAutosize
        minRows={1}
        maxRows={8}
        value={value}
        onChange={(e) => updateTextBox(e.target.value)}
        onKeyDown={(e) => handleInput(e)}
      />
    </StyledInput>
  );
};

// styles

const StyledBox = styled('div', {
  position: 'relative',
  backgroundColor: 'white',
  minHeight: 'calc(100vh - 50px)',
  height: 'auto',
  padding: '0 2rem',
});

const StyledTitle = styled('div', {
  position: 'sticky',
  top: '$navbar-spacing',
  zIndex: 2,
  backgroundColor: 'white',
  padding: '1rem 2rem',
  width: '100%',
  borderBottom: 'solid 1px $slate-300',
});

const StyledInput = styled('div', {
  position: 'sticky',
  bottom: '1.2rem',

  '& textarea': {
    margin: '0 4rem',
    border: 'none',
    borderRadius: '1rem',
    padding: '1rem 2rem',
    boxShadow: '$shadow-lg',
    backgroundColor: '$coolGray-300',
    width: '90%',
    fontSize: '1.4em',
    outlineOffset: '0',
    resize: 'none',
    fontFamily: 'inherit',

    '&:focus': {
      outline: 'solid $blue-800',
    },
  },
});

const StyledUserLink = styled('div', {
  display: 'inline-flex',
  textOverflow: 'ellipsis',

  '& b': {
    margin: '0 0.2rem',
    cursor: 'default',
    whiteSpace: 'nowrap',
  },
});

export default Chat;
