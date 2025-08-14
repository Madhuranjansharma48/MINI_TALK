import { Conversation } from '@/types/chat';

const ChatHeader = ({ conversation }: { conversation?: Conversation }) => {
  if (!conversation) return null;
  return (
    <div className="px-4 py-3 border-b flex items-center gap-3 bg-card/60">
      <div className="size-10 shrink-0 rounded-full bg-brand/10 text-sm grid place-items-center font-medium text-brand">
        {conversation.contact.substring(0, 2)}
      </div>
      <div className="min-w-0">
        <h2 className="font-semibold leading-tight truncate">{conversation.contact}</h2>
        <p className="text-xs text-muted-foreground">last seen today</p>
      </div>
    </div>
  );
};

export default ChatHeader;
