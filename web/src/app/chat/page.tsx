"use client";
import dynamic from 'next/dynamic';

const ChatPageContent = dynamic(() => import('./ChatPageContent'), {
  ssr: false,
  loading: () => <div>Chargement...</div>
});

export default function ChatPage() {
  return <ChatPageContent />;
}
