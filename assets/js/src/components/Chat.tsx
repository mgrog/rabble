import React, { ReactNode, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChannel } from '../hooks/useChannel';

type Props = {
  children?: ReactNode;
};

const Chat = ({ children }: Props) => {
  const params = useParams();
  const [messages, setMessages] = useState([]);

  const chatConnect = useCallback(
    (event, payload) => {
      console.log('channel connected', event, payload);
      const msgs = payload.response?.messages || [];
      setMessages(msgs);
    },
    [setMessages],
  );

  if (params.roomId !== undefined) {
    useChannel(`room:${params.roomId}`, chatConnect);
  }

  return (
    <Chat.Box>
      <Chat.Title>Room {params.roomId}</Chat.Title>
      <Chat.Content messages={messages} />
      {children}
    </Chat.Box>
  );
};

Chat.Box = ({ children }: Props) => {
  return <div className="rounded-xl container h-full bg-white p-3">{children}</div>;
};

type ChatMessage = {
  id: number;
  name: string;
  content: string;
  insertedAt: string;
};

type ContentProps = {
  messages: ChatMessage[];
} & Props;

Chat.Title = ({ children }: Props) => <h2>{children}</h2>;

Chat.Content = ({ messages }: ContentProps) => {
  const renderedMsgs = messages.map((x) => (
    <Chat.Message key={x.id} name={x.name} time={x.insertedAt} content={x.content}></Chat.Message>
  ));
  return <>{renderedMsgs}</>;
};

type MessageProps = {
  name: string;
  time: string;
  content: string;
};

Chat.Message = ({ name, content, time }: MessageProps) => {
  return (
    <div>
      <div className="flex">
        <h4>{name}</h4>
        <h5>{time}</h5>
      </div>
      <p>{content}</p>;
    </div>
  );
};

export default Chat;
