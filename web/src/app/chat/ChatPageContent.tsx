
export default function ChatPageContent() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
