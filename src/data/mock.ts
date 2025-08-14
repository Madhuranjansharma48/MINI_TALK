import { Conversation, Message } from '@/types/chat';

const now = () => new Date();
const iso = (d: Date) => d.toISOString();

const me = '919876543210';

export const conversations: Conversation[] = [
  {
    wa_id: '919999888777',
    contact: '+91 99998 88777',
    last_message: 'See you soon! 👋',
    last_time: iso(new Date(now().getTime() - 2 * 60 * 1000)),
    unread_count: 1,
  },
  {
    wa_id: '14155552671',
    contact: '+1 (415) 555-2671',
    last_message: 'Invoice sent. Let me know.',
    last_time: iso(new Date(now().getTime() - 60 * 60 * 1000)),
    unread_count: 0,
  },
];

export const initialMessages: Record<string, Message[]> = {
  '919999888777': [
    {
      id: '1',
      msg_id: 'wamid.1',
      wa_id: me,
      from: '919999888777',
      to: me,
      text: 'Hey! Are we still on for today?',
      type: 'text',
      direction: 'inbound',
      status: 'read',
      timestamp: iso(new Date(now().getTime() - 3 * 60 * 60 * 1000)),
    },
    {
      id: '2',
      msg_id: 'wamid.2',
      wa_id: me,
      from: me,
      to: '919999888777',
      text: 'Yes, 5pm works great 👍',
      type: 'text',
      direction: 'outbound',
      status: 'delivered',
      timestamp: iso(new Date(now().getTime() - 2.5 * 60 * 60 * 1000)),
    },
    {
      id: '3',
      msg_id: 'wamid.3',
      wa_id: me,
      from: '919999888777',
      to: me,
      text: 'Awesome! See you soon! 👋',
      type: 'text',
      direction: 'inbound',
      status: 'read',
      timestamp: iso(new Date(now().getTime() - 2 * 60 * 1000)),
    },
  ],
  '14155552671': [
    {
      id: '4',
      msg_id: 'wamid.4',
      wa_id: me,
      from: '14155552671',
      to: me,
      text: 'Invoice sent. Let me know if it looks good.',
      type: 'text',
      direction: 'inbound',
      status: 'delivered',
      timestamp: iso(new Date(now().getTime() - 60 * 60 * 1000)),
    },
  ],
};
