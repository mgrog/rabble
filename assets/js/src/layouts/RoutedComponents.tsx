import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Chat from '../components/Chat';

function RoutedComponents() {
  const noSelection = <div>No Room</div>;

  return (
    <Routes>
      <Route path="/" element={noSelection} />
      <Route path="chatrooms" element={<Outlet />}>
        <Route path=":roomId" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default RoutedComponents;
