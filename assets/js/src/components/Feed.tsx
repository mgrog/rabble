import React, { useEffect, useRef } from 'react';
// @ts-ignore
import Identicon from 'react-identicons';
import { styled } from '../../stitches.config';
import { Message } from '../shared/interfaces/structs.interfaces';
import { HasChildren } from '../shared/types/HasChildren.type';
import { TypingStatus } from './Chat';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

type Props = {
  feedMessages: Partial<Message>[];
  typingStatus: TypingStatus;
};

const Feed = ({ feedMessages, typingStatus }: Props) => {
  const feedRef = useRef<HTMLDivElement>(null);
  const feedEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      feedMessages.length &&
      feedRef &&
      feedRef!.current!.clientHeight > window.innerHeight - 200
    ) {
      feedEnd!.current!.scrollIntoView();
    }
  }, [feedMessages]);

  const formatDate = (dateStr: string) => {
    let d = parseISO(dateStr);
    if (isToday(d)) {
      return `Today at ${format(d, 'h:mm aaa')}`;
    } else if (isYesterday(d)) {
      return `Yesterday at ${format(d, 'h:mm aaa')}`;
    } else {
      return format(d, 'M/dd/yy h:mm aaa');
    }
  };

  const renderedEvents = feedMessages.map((x, i) => (
    <Feed.Event key={i}>
      {!x.participant && <Feed.UserEvent content={x.content!} />}
      {x.participant && (
        <>
          <Feed.Avatar seed={x.participant.nickname} />
          <Feed.Content>
            <Feed.Summary name={x.participant.nickname} date={formatDate(x.updated_at!)} />
            <Feed.Message content={x.content!} />
          </Feed.Content>
        </>
      )}
    </Feed.Event>
  ));
  return (
    <StyledFeed ref={feedRef}>
      {renderedEvents}
      {Object.keys(typingStatus)
        .filter((k) => typingStatus[k].typing)
        .map((k) => {
          const { nickname } = typingStatus[k];
          return <i key={k} style={{ paddingLeft: '2rem' }}>{`${nickname} is typing...`}</i>;
        })}
      <div ref={feedEnd} id="feedEnd"></div>
    </StyledFeed>
  );
};

Feed.Event = ({ children }: HasChildren) => {
  return <StyledEvent>{children}</StyledEvent>;
};

Feed.Avatar = ({ seed }: { seed: string }) => {
  return (
    <StyledAvatar>
      <Identicon bg="black" size="25" string={seed}></Identicon>
    </StyledAvatar>
  );
};

Feed.Content = ({ children }: HasChildren) => {
  return <StyledContent>{children}</StyledContent>;
};

Feed.Summary = ({ name, date }: { name: string; date: string }) => {
  return (
    <StyledSummary>
      <Name>{name}</Name>
      <Date>{date}</Date>
    </StyledSummary>
  );
};

Feed.Message = ({ content }: { content: string }) => {
  return <Message>{content}</Message>;
};

Feed.UserEvent = ({ content }: { content: string }) => {
  return <p>{content}</p>;
};

// styles

const StyledFeed = styled('div', {
  marginTop: '50px',
  height: 'auto',
  minHeight: 'calc(100vh - 200px)',
  paddingBottom: '8rem',
});

const StyledEvent = styled('div', {
  display: 'flex',
  padding: '2rem',
});

const StyledAvatar = styled('div', {
  marginRight: '1rem',
  flexShrink: 0,
});

const StyledContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const StyledSummary = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const Message = styled('p', {
  fontSize: '1.2em',
});

const Name = styled('a', {
  fontSize: '1.2em',
  marginRight: '1rem',
});

const Date = styled('div', {
  fontSize: '1em',
  color: '$trueGray-400',
});

export default Feed;
