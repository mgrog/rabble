import React from 'react';
import ReactDOM from 'react-dom';
import MainLayout from './src/layouts/Main';
import SocketProvider from './src/components/SocketProvider';
import { BrowserRouter } from 'react-router-dom';
import RoutedComponents from './src/layouts/RoutedComponents';
import { AppContextProvider } from './src/contexts/AppContext';
import axios from 'axios';

const app = document.getElementById('rabble-app');
ReactDOM.render(<App />, app);

function App() {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = window.csrf_token;

  return (
    <AppContextProvider>
      <SocketProvider wsUrl={'/socket'} options={{ token: window.userToken }}>
        <BrowserRouter basename="/app">
          <MainLayout>
            <RoutedComponents />
          </MainLayout>
        </BrowserRouter>
      </SocketProvider>
    </AppContextProvider>
  );
}
