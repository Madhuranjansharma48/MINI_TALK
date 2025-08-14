import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Composer = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  return (
    <form onSubmit={submit} className="p-3 border-t flex items-center gap-2">
      <Input
        aria-label="Message"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="hero">
        Send
      </Button>
    </form>
  );
};

export default Composer;
