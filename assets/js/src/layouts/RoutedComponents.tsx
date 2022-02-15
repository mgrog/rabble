import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Chat } from '../components/Chat';
import NoRoomSelected from './NoRoomSelected';

function RoutedComponents() {
  return (
    <Routes>
      <Route path="/" element={<NoRoomSelected />} />
      <Route path="chatrooms" element={<Outlet />}>
        <Route path=":roomId" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default RoutedComponents;
