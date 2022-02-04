import React from 'react';
import ReactDOM from 'react-dom';
import MainLayout from './src/layouts/Main';
import SocketProvider from './src/components/SocketProvider';
import { BrowserRouter } from 'react-router-dom';
import RoutedComponents from './src/layouts/RoutedComponents';

const app = document.getElementById('rabble-app');
ReactDOM.render(
  <SocketProvider wsUrl={'/socket'} options={{ token: window.userToken }}>
    <BrowserRouter basename="/app">
      <MainLayout>
        <RoutedComponents />
      </MainLayout>
    </BrowserRouter>
  </SocketProvider>,
  app,
);
