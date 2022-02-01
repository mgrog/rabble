import { Socket } from 'phoenix';
import { createContext } from 'react';

const SocketContext = createContext({} as Socket);
export default SocketContext;
