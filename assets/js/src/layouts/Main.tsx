import React, { ReactNode } from 'react';
import Menu from '../components/Menu';

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen bg-slate-200">
      <div className="flex h-full">
        <Menu />
        <div className="flex-grow container h-full ml-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
