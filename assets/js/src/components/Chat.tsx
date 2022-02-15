import React, {
  Dispatch,
  Fragment,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Header } from 'semantic-ui-react';
import { styled } from '../../stitches.config';
import { AppContext } from '../contexts/AppContext';
import { useChannel } from '../hooks/useChannel';
import useTypingStatus from '../hooks/useTypingStatus';
import {
  PhxBroadcast,
  PhxPresence,
  PhxReply,
  TypingUpdate,
} from '../shared/interfaces/phx-response.types';
import { Message, Participant, Room, User } from '../shared/interfaces/structs.interfaces';
import Feed from './Feed';

type TypingStatus = { [k: string | number]: TypingUpdate };

const Chat = () => {
  const params = useParams();
  const [currentMessage, setCurrentMessage] = useState('');
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Partial<Message>[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [typingStatus, setTypingStatus] = useState<any>({});
  const { store } = useContext(AppContext);

  type ChatResponse =
    | PhxReply<{ room: Room }>
    | PhxBroadcast<'message_added', Message>
    | PhxBroadcast<'user_left', User>
    | PhxBroadcast<'users_edited', Participant[]>
    | PhxPresence<'presence_diff', { [k: string]: TypingUpdate }>;

  const chatConnect = useCallback(
    (dispatch: ChatResponse) => {
      // console.log(dispatch);
      switch (dispatch.type) {
        case 'phx_reply':
          let { room } = dispatch.payload.response;
          setTitle(room.title);
          setMessages(room.messages);
          setParticipants(room.participants);
          return;
        case 'message_added':
          setMessages((prevState) => [...prevState, { ...dispatch.payload.data }]);
          return;
        case 'user_left':
          let u = dispatch.payload.data;
          setMessages((prevState) => [...prevState, { content: `${u.nickname} left` }]);
          return;
        case 'users_edited':
          let newParticipants = dispatch.payload.data;
          setParticipants(newParticipants);
          return;
        case 'presence_diff':
          setTypingStatus((prevState: TypingStatus) => ({ ...prevState, ...dispatch.payload }));
          return;
      }
    },
    [setMessages],
  );

  const channel = useChannel(`room:${params.roomId}`, { onMessage: chatConnect });

  const addMessage = (content: string) => {
    channel.broadcast('message', { content });
  };

  const broadcastTyping = (typing: boolean) => {
    channel.broadcast('status_update', { typing });
  };

  const renderedMembers = participants.slice(0, 8).map((x) => {
    const [presence] = store.presences[x.user_id]?.metas || [null];

    return (
      <Fragment key={x.id}>
        <b title={`${x.nickname}'s user profile`}>@{x.nickname}</b>
        <span>
          {presence ? (
            <StyledStatusIndicator status={presence.status} />
          ) : (
            <StyledStatusIndicator />
          )}
        </span>
      </Fragment>
    );
  });

  return (
    <Chat.Box>
      <Chat.Title>
        <Header as={'h2'}>
          {title || 'loading...'}
          <Header.Subheader>
            <StyledUserLink>
              <span>{participants.length} members</span> {renderedMembers}{' '}
              {participants.length > 8 && <b>...</b>}
            </StyledUserLink>
          </Header.Subheader>
        </Header>
      </Chat.Title>
      <Feed feedMessages={messages} typingStatus={typingStatus}></Feed>
      <Chat.Input
        value={currentMessage}
        setValue={setCurrentMessage}
        addMessage={addMessage}
        broadcastTyping={broadcastTyping}
      />
    </Chat.Box>
  );
};

Chat.Box = ({ children }: { children: ReactNode }) => {
  return <StyledBox>{children}</StyledBox>;
};

Chat.Title = ({ children }: { children: ReactNode }) => <StyledTitle>{children}</StyledTitle>;

type InputProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  addMessage: (text: string) => void;
  broadcastTyping: (typing: boolean) => void;
};

Chat.Input = ({ value, setValue, addMessage, broadcastTyping }: InputProps) => {
  const [stop, setStop] = useState(false);

  const updateTextBox = (text: string) => {
    setValue(text);
  };

  useTypingStatus(value, 3000, broadcastTyping, { stop, setStop });

  const enterMessage = (text: string) => {
    setValue('');
    text.length && addMessage(text);
  };

  const handleInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        setStop(true);
        return enterMessage(value);
    }
  };

  return (
    <StyledInput>
      <TextareaAutosize
        minRows={1}
        maxRows={8}
        value={value}
        onChange={(e) => updateTextBox(e.target.value)}
        onKeyDown={(e) => handleInput(e)}
      />
    </StyledInput>
  );
};

// styles

const StyledBox = styled('div', {
  position: 'relative',
  backgroundColor: 'white',
  height: '100vh',
  overflow: 'hidden auto',
});

const StyledTitle = styled('div', {
  position: 'sticky',
  top: '$navbar-spacing',
  zIndex: 2,
  backgroundColor: 'white',
  padding: '1rem 2rem',
  width: '100%',
  borderBottom: 'solid 1px $slate-300',
});

const StyledInput = styled('div', {
  position: 'sticky',
  bottom: '1.2rem',
  display: 'flex',
  justifyContent: 'center',

  '& textarea': {
    margin: '0 4rem',
    border: 'none',
    borderRadius: '1rem',
    padding: '1rem 2rem',
    boxShadow: '$shadow-lg',
    backgroundColor: '$coolGray-300',
    width: '90%',
    fontSize: '1.4em',
    outlineOffset: '0',
    resize: 'none',
    fontFamily: 'inherit',
    overflow: 'hidden',
  },
});

const StyledUserLink = styled('div', {
  display: 'inline-flex',
  textOverflow: 'ellipsis',

  '& b': {
    margin: '0 0.2rem',
    cursor: 'default',
    whiteSpace: 'nowrap',
  },
});

const StyledStatusIndicator = styled('div', {
  backgroundColor: '$gray-200',
  borderRadius: '50%',
  width: '0.5rem',
  height: '0.5rem',
  variants: {
    status: {
      online: {
        backgroundColor: '$green-400',
      },
      away: {
        backgroundColor: '$amber-400',
      },
    },
  },
});

export { Chat, TypingStatus };
