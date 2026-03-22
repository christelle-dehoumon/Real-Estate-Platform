import { Suspense } from 'react';
import ChatPageContent from './ChatPageContent';

export default function ChatPageContent() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
