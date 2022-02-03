import React from 'react';

const Button = (props: any) => {
  let { color, hoverColor, className, ...others } = props;

  const renderedColor = color ? color : 'bg-slate-200';
  const renderedHoverColor = hoverColor ? hoverColor : 'hover:bg-slate-300';

  return (
    <button
      {...others}
      className={`rounded px-3 py-1 ${renderedColor} ${renderedHoverColor} ${className || ''}`}>
      {others.children}
    </button>
  );
};

const Input = (props: any) => {
  const { loading, className, handler, ...others } = props;

  return (
    <input
      {...others}
      onChange={(e) => handler(e.target.value)}
      className={`rounded border border-solid border-color-slate-500 ${className || ''}`}
    />
  );
};

export { Button, Input };
