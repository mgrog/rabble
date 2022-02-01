import React, { ReactNode, useEffect } from 'react';
import { Socket } from 'phoenix';

import SocketContext from '../contexts/SocketContext';

type Props = {
  wsUrl: string;
  options: object;
  children: ReactNode;
} & typeof defaultProps;

const defaultProps = {
  options: {},
};

const SocketProvider = ({ wsUrl, options, children }: Props) => {
  const socket = new Socket(wsUrl, { params: options });
  useEffect(() => {
    socket.connect();
  }, [options, wsUrl]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
