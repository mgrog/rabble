import { Socket } from 'phoenix';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import SocketContext from '../contexts/SocketContext';

type MessageCB = (event: any, payload: any) => void;

const useChannel = (channelTopic: string, onMessage: MessageCB) => {
  const socket = useContext(SocketContext);

  const [broadcast, setBroadcast] =
    useState<(eventName: string, payload: object) => void>(mustJoinChannelWarning);

  useEffect(() => joinChannel(socket, channelTopic, onMessage, setBroadcast), [channelTopic]);

  return broadcast;
};

const joinChannel = (
  socket: Socket,
  channelTopic: string,
  onMessage: MessageCB,
  setBroadcast: Dispatch<SetStateAction<(eventName: string, payload: object) => void>>,
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
    .receive('ok', ({ messages }) => console.log('successfully joined channel', messages || ''))
    .receive('error', ({ reason }) => console.error('failed to join channel', reason));

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

export default useChannel;
