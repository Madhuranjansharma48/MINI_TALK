export type MessageStatus = 'sent' | 'delivered' | 'read' | 'unknown';

export type Message = {
  id: string;
  msg_id: string;
  meta_msg_id?: string;
  wa_id: string; // conversation owner
  from: string;
  to: string;
  text: string;
  type: 'text';
  direction: 'inbound' | 'outbound';
  status: MessageStatus;
  timestamp: string; // ISO
};

export type Conversation = {
  wa_id: string; // phone id (conversation owner)
  contact: string; // display name or number
  last_message: string;
  last_time: string; // ISO
  unread_count: number;
};
