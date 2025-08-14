import { Conversation } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface Props {
  conversations: Conversation[];
  selected?: string;
  onSelect: (wa_id: string) => void;
}

const Sidebar = ({ conversations, selected, onSelect }: Props) => {
  const sorted = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => new Date(b.last_time).getTime() - new Date(a.last_time).getTime()
      ),
    [conversations]
  );

  return (
    <nav aria-label="Conversations" className="h-[70vh] md:h-[78vh]">
      <ScrollArea className="h-full">
        <ul className="divide-y">
          {sorted.map((c) => {
            const isActive = c.wa_id === selected;
            return (
              <li key={c.wa_id}>
                <button
                  onClick={() => onSelect(c.wa_id)}
                  className={cn(
                    'w-full text-left px-4 py-3 flex items-center gap-3 transition-colors',
                    isActive ? 'bg-accent' : 'hover:bg-accent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="size-10 shrink-0 rounded-full bg-brand/10 text-sm grid place-items-center font-medium text-brand">
                    {c.contact.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium">{c.contact}</p>
                      <time className="text-xs text-muted-foreground">
                        {new Date(c.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{c.last_message}</p>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-brand text-brand-foreground text-xs px-2 h-5">
                      {c.unread_count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </nav>
  );
};

export default Sidebar;
