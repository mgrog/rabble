type Message = { content: string; updated_at: string; participant: Participant };

type Participant = { id: number; user_id: number; nickname: string };

interface Room {
  id: number;
  title: string;
  participants: Participant[];
  messages: Message[];
}

interface User {
  id: number;
  nickname: string;
  email: string;
  rooms: Room[];
  participant: Participant;
}

export { User, Room, Participant, Message };
