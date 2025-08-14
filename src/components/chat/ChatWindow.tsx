import { Conversation, Message } from '@/types/chat';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import Composer from './Composer';

interface Props {
  conversation?: Conversation;
  messages: Message[];
  onSend: (text: string) => void;
}

const ChatWindow = ({ conversation, messages, onSend }: Props) => {
  if (!conversation) return null;
  return (
    <div className="flex flex-col">
      <ChatHeader conversation={conversation} />
      <MessageList messages={messages} />
      <Composer onSend={onSend} />
    </div>
  );
};

export default ChatWindow;
