import { Socket } from 'phoenix';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/SocketContext';

type MessageCB = (event: any, payload: any) => void;
const defaultCB = (_e: any, _pl: any) => undefined;

const useChannel = (channelTopic: string, onMessage: MessageCB = defaultCB) => {
  const socket = useContext(SocketContext);

  const [broadcast, setBroadcast] =
    useState<(eventName: string, payload: object) => void>(mustJoinChannelWarning);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    () => joinChannel(socket, channelTopic, onMessage, setBroadcast, setLoading, setError),
    [channelTopic],
  );

  return { broadcast, loading, error };
};

const joinChannel = (
  socket: Socket,
  channelTopic: string,
  onMessage: MessageCB,
  setBroadcast: Dispatch<SetStateAction<(eventName: string, payload: object) => void>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>,
) => {
  const channel = socket.channel(channelTopic, { client: 'browser' });

  channel.onMessage = (event, payload) => {
    if (event != null && !event.startsWith('chan_reply_')) {
      onMessage(event, payload);
    }

    return payload;
  };

  channel
    .join()
    .receive('ok', () => {
      setLoading(false);
    })
    .receive('error', ({ reason }) => {
      console.error('failed to join channel', reason);
      setError(reason);
    });

  setBroadcast(
    (_oldstate: any) => (eventName: string, payload: object) => channel.push(eventName, payload),
  );

  return () => {
    channel.leave();
  };
};

const mustJoinChannelWarning = (_oldstate: any) => (_eventName: string, _payload: object) =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`,
  );

export { useChannel, MessageCB };
