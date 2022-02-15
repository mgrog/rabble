type PhxStatus = 'ok' | 'error';

interface PhxReply<R> {
  type: 'phx_reply';
  payload: { response: R; status: PhxStatus };
}

interface PhxBroadcast<T, D> {
  type: T;
  payload: { data: D };
}

interface PhxPresence<T, S> {
  type: T;
  payload: S;
}

type OnlineStatus = {
  id: number;
  nickname: string;
  online_at: number;
  phx_ref: number;
  status: 'online' | 'away';
};

type TypingUpdate = {
  nickname: string;
  typing: boolean;
};

interface PresenceState<T = OnlineStatus> {
  [k: number | string]: {
    metas: T[];
  };
}

interface PresenceDiff<T = OnlineStatus> {
  joins: PresenceState<T>;
  leaves: PresenceState<T>;
}

export {
  PhxStatus,
  PhxReply,
  PhxBroadcast,
  PhxPresence,
  PresenceState,
  PresenceDiff,
  TypingUpdate,
};
