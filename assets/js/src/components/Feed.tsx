import React from 'react';
import { ChatMessage } from '../shared/interfaces/chat-message.interface';
import { Image } from 'semantic-ui-react';
import { HasChildren } from '../shared/types/HasChildren.type';
import { styled } from '../../stitches.config';

type Props = {
  messages: ChatMessage[];
};

const Feed = ({ messages }: Props) => {
  const renderedEvents = messages.map((x, i) => (
    <Feed.Event key={i}>
      <Feed.Avatar />
      <Feed.Content>
        <Feed.Summary name={x.name} date={x.date} />
        <Feed.Message content={x.content} />
      </Feed.Content>
    </Feed.Event>
  ));
  return <>{renderedEvents}</>;
};

Feed.Event = ({ children }: HasChildren) => {
  return <StyledEvent>{children}</StyledEvent>;
};

Feed.Avatar = () => {
  return (
    <StyledAvatar>
      <Image
        circular
        size="mini"
        src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg"
      />
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
