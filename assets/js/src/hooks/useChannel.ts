import { Socket } from 'phoenix';
import { Dispatch, Reducer, SetStateAction, useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/SocketContext';

interface OnCompleteOptions {
  onMessage?: <D extends { type: any; payload: any }>(dispatch: D) => void;
  setState?: () => void;
}

const useChannel = (channelTopic: string, options: OnCompleteOptions = {}) => {
  const socket = useContext(SocketContext);

  const [broadcast, setBroadcast] =
    useState<(eventName: string, payload: object) => void>(mustJoinChannelWarning);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    () => joinChannel(socket, channelTopic, setBroadcast, setLoading, setError, options),
    [channelTopic],
  );

  return { broadcast, loading, error };
};

const joinChannel = (
  socket: Socket,
  channelTopic: string,
  setBroadcast: Dispatch<SetStateAction<(eventName: string, payload: object) => void>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>,
  options: OnCompleteOptions,
) => {
  const channel = socket.channel(channelTopic, { client: 'browser' });

  channel.onMessage = (event, payload) => {
    if (event != null && !event.startsWith('chan_reply_')) {
      options.onMessage && options.onMessage({ type: event, payload });
      options.setState && options.setState();
      setLoading(false);
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

  setBroadcast((_oldstate: any) => (eventName: string, payload: object) => {
    setLoading(true);
    channel.push(eventName, payload);
  });

  return () => {
    channel.leave();
  };
};

const mustJoinChannelWarning = (_oldstate: any) => (_eventName: string, _payload: object) =>
  console.error(
    `useChannel broadcast function cannot be invoked before the channel has been joined`,
  );

export { useChannel };
