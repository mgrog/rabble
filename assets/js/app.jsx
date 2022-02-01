import React from 'react';
import ReactDOM from 'react-dom';
import MainLayout from './src/layouts/Main';
import Chat from './src/components/Chat';
import SocketProvider from './src/components/SocketProvider';

const app = document.getElementById('rabble-app');
ReactDOM.render(
  <React.StrictMode>
    <MainLayout>
      <Chat>
        <Chat.Content />
      </Chat>
    </MainLayout>
  </React.StrictMode>,
  app,
);
