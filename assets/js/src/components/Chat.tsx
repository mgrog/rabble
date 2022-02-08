import React, {
  KeyboardEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { styled } from '../../stitches.config';
import Feed from './Feed';
import { Message } from '../shared/interfaces/structs.interfaces';

const Chat = () => {
  const params = useParams();
  const [currentMessage, setCurrentMessage] = useState('');
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const chatConnect = useCallback(
    (event, payload) => {
      switch (event) {
        case 'phx_reply':
          console.log('channel connected', event, payload);
          const { room } = payload.response;
          setTitle(room.title);
          return setMessages(room?.messages || []);
      }
    },
    [setMessages],
  );

  if (params.roomId !== undefined) {
    useChannel(`room:${params.roomId}`, chatConnect);
  }

  const addMessage = ({ content, user_id, updated_at }: Message) => {
    return setMessages((prevState) => [
      ...prevState,
      { name: 'Miguel', content, updated_at: 'now' },
    ]);
  };

  return (
    <>
      <Chat.Title>{title || 'loading...'}</Chat.Title>
      <Chat.Box>
        <Feed messages={messages}></Feed>
      </Chat.Box>
      <Chat.Input value={currentMessage} setValue={setCurrentMessage} addMessage={addMessage} />
    </>
  );
};

Chat.Box = ({ children }: { children: ReactNode }) => {
  return <StyledBox>{children}</StyledBox>;
};

Chat.Title = ({ children }: { children: ReactNode }) => (
  <StyledTitle>
    <h2>{children}</h2>
  </StyledTitle>
);

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
    const numLines = Math.ceil(lineWidth / inputEl?.current?.clientWidth);
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
  height: '200vh',
  padding: '1rem 2rem',
});

const StyledTitle = styled('div', {
  position: 'sticky',
  top: 14,
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

export default Chat;
