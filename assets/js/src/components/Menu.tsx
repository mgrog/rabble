import React, { ReactNode } from 'react';

const Menu = () => {
  const links = ['lobby', 'one', 'two', 'three'];
  const renderedLinks = links.map((x, i) => <Menu.Link key={i} content={x}></Menu.Link>);
  return (
    <div className="bg-white h-full flex flex-col border-solid border-r border-slate-400">
      <Menu.Header />
      <Menu.Controls />
      {renderedLinks}
    </div>
  );
};

Menu.Header = () => {
  return <button className="p-8">Rabble</button>;
};

type LinkProps = {
  content: string;
};

Menu.Controls = () => {
  return (
    <div className="flex items-center justify-between h-8">
      <span className="text-xs cursor-default uppercase px-2">Chatrooms</span>
      <button className="text-xl px-2" style={{ marginBottom: '3px' }}>
        +
      </button>
    </div>
  );
};

Menu.Link = ({ content }: LinkProps) => {
  return (
    <button className="px-2 py-3 text-left border-solid border-t last:border-b border-slate-200 hover:bg-slate-100">
      {content}
    </button>
  );
};

export default Menu;
