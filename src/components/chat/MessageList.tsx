import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';

const MessageList = ({ messages }: { messages: Message[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <ScrollArea className="h-[55vh] md:h-[66vh] px-2">
      <div className="mx-auto max-w-3xl py-4 flex flex-col gap-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
