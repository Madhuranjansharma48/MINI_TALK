import { useMemo, useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '@/types/chat';
import { conversations as seedConversations, initialMessages } from '@/data/mock';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import NumberBar from './NumberBar';

const ChatLayout = () => {
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [selected, setSelected] = useState<string>(seedConversations[0]?.wa_id || '');
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [myNumber, setMyNumber] = useState<string>(() => localStorage.getItem('my-number') || '919876543210');

  useEffect(() => {
    localStorage.setItem('my-number', myNumber);
  }, [myNumber]);

  // Auto-select first conversation if none
  useEffect(() => {
    if (!selected && conversations.length) setSelected(conversations[0].wa_id);
  }, [selected, conversations]);

  const activeMessages = useMemo(() => messages[selected] || [], [messages, selected]);
  const activeConversation = useMemo(
    () => conversations.find((c) => c.wa_id === selected),
    [conversations, selected]
  );

  // Signature moment: reactive subtle light overlay following cursor (performance-friendly)
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const handleSend = (text: string) => {
    if (!text.trim() || !selected) return;
    const newMsg: Message = {
      id: crypto.randomUUID(),
      msg_id: `wamid.${Date.now()}`,
      wa_id: myNumber,
      from: myNumber,
      to: selected,
      text,
      type: 'text',
      direction: 'outbound',
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] || []), newMsg],
    }));

    // Update conversation preview
    setConversations((prev) =>
      prev.map((c) =>
        c.wa_id === selected
          ? { ...c, last_message: text, last_time: new Date().toISOString() }
          : c
      )
    );

    // Simulate status updates
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selected]: (prev[selected] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' } : m
        ),
      }));
    }, 800);
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selected]: (prev[selected] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: 'read' } : m
        ),
      }));
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-6">
        <h1 className="sr-only">WhatsApp Web Clone – Real-time Chat UI</h1>
        <NumberBar myNumber={myNumber} onSave={setMyNumber} />
      </header>
      <main className="container">
        <section aria-label="Chat" className="grid md:grid-cols-[380px_1fr] gap-4 md:gap-6">
          <aside className="rounded-lg border bg-card">
            <Sidebar
              conversations={conversations}
              selected={selected}
              onSelect={setSelected}
            />
          </aside>
          <article className="relative rounded-lg border bg-card overflow-hidden">
            <div
              ref={overlayRef}
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  'radial-gradient(300px 200px at var(--x, 50%) var(--y, 50%), hsl(var(--brand) / 0.08), transparent 70%)',
              }}
              aria-hidden
            />
            <ChatWindow
              conversation={activeConversation}
              messages={activeMessages}
              onSend={handleSend}
            />
          </article>
        </section>
      </main>
    </div>
  );
};

export default ChatLayout;
