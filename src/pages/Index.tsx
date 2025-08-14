import ChatLayout from '@/components/chat/ChatLayout';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Structured data for SEO
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'WhatsApp Web Clone – Real-time Chat UI',
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Web',
      url: '/',
      description:
        'Modern WhatsApp-like web chat UI with message statuses, responsive layout, and micro-interactions.',
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <ChatLayout />;
};

export default Index;
