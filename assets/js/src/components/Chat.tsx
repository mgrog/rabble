import React, { ReactNode, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';
import { styled } from '../../stitches.config';
import { Image } from 'semantic-ui-react';
import { ChatMessage } from '../shared/interfaces/chat-message.interface';
import Feed from './Feed';

const Chat = () => {
  const params = useParams();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatConnect = useCallback(
    (event, payload) => {
      console.log('channel connected', event, payload);
      setMessages([]);
    },
    [setMessages],
  );

  if (params.roomId !== undefined) {
    useChannel(`room:${params.roomId}`, chatConnect);
  }

  const addMessage = (text: string) => {
    return setMessages((prevState) => [
      ...prevState,
      { name: 'Miguel', content: text, date: 'now' },
    ]);
  };

  return (
    <>
      <Chat.Title>Room {params.roomId}</Chat.Title>
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

type MessageProps = {
  name: string;
  date: string;
  content: string;
  children: ReactNode;
};

Chat.Input = ({ value, setValue, addMessage }: any) => (
  <StyledInput
    onChange={(e) => setValue(e.target.value)}
    onKeyDown={(e) => (e.key === 'Enter' ? addMessage(value) : null)}
  />
);

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
});

export default Chat;
