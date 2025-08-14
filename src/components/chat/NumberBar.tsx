import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  myNumber: string;
  onSave: (value: string) => void;
}

const sanitizeNumber = (val: string) => {
  let v = val.trim();
  // Keep leading + if present, strip other non-digits
  const hasPlus = v.startsWith('+');
  v = v.replace(/\D/g, '');
  return (hasPlus ? '+' : '') + v;
};

const NumberBar = ({ myNumber, onSave }: Props) => {
  const [value, setValue] = useState(myNumber);
  useEffect(() => setValue(myNumber), [myNumber]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const out = sanitizeNumber(value);
    if (!out) return;
    onSave(out);
  };

  return (
    <form onSubmit={submit} className="mt-2 flex items-center gap-2">
      <label htmlFor="my-number" className="text-sm text-muted-foreground">
        Your number
      </label>
      <Input
        id="my-number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. +14155552671"
        className="max-w-xs"
        inputMode="tel"
      />
      <Button type="submit" variant="outline" size="sm">
        Save
      </Button>
    </form>
  );
};

export default NumberBar;
