import React, { useEffect, useRef } from 'react';
import { HasChildren } from '../shared/types/HasChildren.type';
import { styled } from '../../stitches.config';
// @ts-ignore
import Identicon from 'react-identicons';
import { Message } from '../shared/interfaces/structs.interfaces';

type Props = {
  feedMessages: Message[];
};

const Feed = ({ feedMessages }: Props) => {
  const feedEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedMessages.length) {
      feedEnd!.current?.scrollIntoView();
    }
  }, [feedMessages]);

  const renderedEvents = feedMessages.map((x, i) => (
    <Feed.Event key={i}>
      <Feed.Avatar seed={x.participant.nickname} />
      <Feed.Content>
        <Feed.Summary name={x.participant.nickname} date={x.updated_at} />
        <Feed.Message content={x.content} />
      </Feed.Content>
    </Feed.Event>
  ));
  return (
    <StyledFeed>
      {renderedEvents}
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

// styles

const StyledFeed = styled('div', {
  marginTop: '50px',
  overflowY: 'auto',
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
