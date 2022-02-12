type PhxStatus = 'ok' | 'error';

interface PhxReply<R> {
  type: 'phx_reply';
  payload: { response: R; status: PhxStatus };
}

interface PhxBroadcast<T, D> {
  type: T;
  payload: { data: D };
}

export { PhxStatus, PhxReply, PhxBroadcast };
