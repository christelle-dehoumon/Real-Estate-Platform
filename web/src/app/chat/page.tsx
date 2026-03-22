import { Suspense } from 'react';
import ChatPageContent from './ChatPageContent';

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
