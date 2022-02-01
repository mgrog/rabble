import React, { ReactNode } from 'react';

type Chat = {
  children: ReactNode;
};

const Chat = ({ children }: Chat) => {
  return <div className="rounded-xl container h-full bg-white p-3">{children}</div>;
};

Chat.Content = () => {
  return (
    <>
      <h2>Title</h2>
      <p>Content</p>
    </>
  );
};

export default Chat;
