import React, {
  KeyboardEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { useParams } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { styled } from '../../stitches.config';
import Feed from './Feed';
import { Participant, Room } from '../shared/interfaces/structs.interfaces';
import { Header } from 'semantic-ui-react';

const Chat = () => {
  const params = useParams();
  const [currentMessage, setCurrentMessage] = useState('');
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<{ name: string; content: string; date: string }[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const chatConnect = useCallback(
    (event, payload) => {
      switch (event) {
        case 'phx_reply':
          console.log('channel connected', event, payload);
          let { room }: { room: Room } = payload.response;
          setTitle(room.title);
          let msgs = room.messages.map((m) => ({
            name: m.participant.nickname,
            content: m.content,
            date: m.updated_at,
          }));
          setMessages(msgs);
          setParticipants(room.participants);
          return;
        case 'message_added':
          console.log('msg', event, payload);
          setMessages((prevState) => [...prevState, { ...payload }]);
      }
    },
    [setMessages],
  );

  const channel = useChannel(`room:${params.roomId}`, chatConnect);

  const addMessage = (content: string) => {
    channel.broadcast('message', { content });
  };

  const renderedMembers = participants
    .slice(0, 8)
    .map((x) => <a title={`${x.nickname}'s user profile`}>@{x.nickname}</a>);

  return (
    <>
      <Chat.Title>
        <Header as={'h2'}>
          {title || 'loading...'}
          <Header.Subheader>
            <StyledUserLink>
              <span>{participants.length} members</span> {renderedMembers}{' '}
              {participants.length > 8 && <a>...</a>}
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
  const inputEl = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState(0);
  const MAX_HEIGHT = 300;
  const LINE_HEIGHT = (x: number) => (x === 2 ? 40 : 28);
  const MIN_HEIGHT = 55;
  const CHAR_WIDTH = 11.7;

  const updateTextBox = (text: string) => {
    const lineWidth = text.length * CHAR_WIDTH;
    const numLines = Math.ceil(lineWidth / inputEl?.current?.clientWidth!);
    const heightValue = numLines * LINE_HEIGHT(numLines);

    setHeight(Math.min(heightValue, MAX_HEIGHT));
    setValue(text);
  };

  const enterMessage = (text: string) => {
    setValue('');
    text.length && addMessage(text);
    setHeight(50);
  };

  const handleInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        return enterMessage(value);
    }
  };

  return (
    <StyledInput
      ref={inputEl}
      style={{ height: `${Math.max(height, MIN_HEIGHT)}px` }}
      value={value}
      onChange={(e) => updateTextBox(e.target.value)}
      onKeyDown={(e) => handleInput(e)}
    />
  );
};

// styles

const StyledBox = styled('div', {
  position: 'relative',
  backgroundColor: 'white',
  overflowY: 'auto',
  height: 'auto',
  minHeight: 'calc(100vh - 40px)',
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

const StyledInput = styled('textarea', {
  position: 'sticky',
  margin: '0 4rem',
  bottom: '2rem',
  border: 'none',
  borderRadius: '1rem',
  padding: '1rem 2rem',
  boxShadow: '$shadow-lg',
  backgroundColor: '$coolGray-300',
  width: '90%',
  fontSize: '1.4em',
  outlineOffset: '0',
  resize: 'none',

  '&:focus': {
    outline: 'solid $blue-800',
  },
});

const StyledUserLink = styled('div', {
  display: 'inline-flex',
  textOverflow: 'ellipsis',

  '& a': {
    margin: '0 0.2rem',
  },

  '& span': {
    whiteSpace: 'nowrap',
  },
});

export default Chat;
