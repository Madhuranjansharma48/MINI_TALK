import { Message } from '@/types/chat';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

const StatusIcon = ({ status }: { status: Message['status'] }) => {
  if (status === 'sent') return <Check className="text-muted-foreground" />;
  if (status === 'delivered') return <CheckCheck className="text-muted-foreground" />;
  if (status === 'read') return <CheckCheck className="text-brand" />;
  return null;
};

const MessageBubble = memo(function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'outbound';
  return (
    <div
      className={cn(
        'bubble px-3 py-2 text-sm inline-flex flex-col',
        isOutbound
          ? 'self-end bg-brand text-brand-foreground'
          : 'self-start bg-secondary text-secondary-foreground'
      )}
    >
      <p className="whitespace-pre-wrap break-words">{message.text}</p>
      <div className={cn('mt-1 flex items-center gap-1 text-[10px] opacity-90', isOutbound ? 'text-brand-foreground' : 'text-muted-foreground')}>
        <time>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
        {isOutbound && (
          <span className="ml-1 -mr-0.5 inline-flex">
            <StatusIcon status={message.status} />
          </span>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
