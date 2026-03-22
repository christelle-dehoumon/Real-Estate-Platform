"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

export default function ChatPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activePartnerId, setActivePartnerId] = useState<string | null>(searchParams.get('owner'));
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activePartnerId) fetchMessages(activePartnerId);
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/${partnerId}`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartnerId) return;
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ receiverId: activePartnerId, content: newMessage })
      });
      if (res.ok) {
        const sentMsg = await res.json();
        setMessages([...messages, sentMsg]);
        setNewMessage('');
      }
    } catch (err) { console.error(err); }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
      <div className="container mx-auto px-6 h-[85vh] max-w-7xl">
        <div className="bg-white border shadow-2xl overflow-hidden flex h-full rounded-3xl">
          <div className={`w-full md:w-1/3 border-r flex flex-col ${activePartnerId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b"><h2 className="text-xl font-bold">Messages</h2></div>
            <div className="flex-1 overflow-y-auto">
              {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
              : conversations.length > 0 ? conversations.map(conv => (
                <div key={conv.partner?._id} onClick={() => setActivePartnerId(conv.partner?._id)}
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 border-b">
                  <img src={`https://ui-avatars.com/api/?name=${conv.partner?.name}&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{conv.partner?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.content}</p>
                  </div>
                </div>
              )) : <p className="p-6 text-sm text-gray-400">Aucune conversation</p>}
            </div>
          </div>
          <div className={`flex flex-col flex-1 ${!activePartnerId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
            {activePartnerId ? (
              <>
                <div className="p-4 border-b flex items-center gap-3">
                  <button onClick={() => setActivePartnerId(null)} className="md:hidden"><ArrowLeft size={20} /></button>
                  <p className="font-bold">{conversations.find(c => c.partner?._id === activePartnerId)?.partner?.name || 'Conversation'}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-2 rounded-xl max-w-xs text-sm ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    placeholder="Votre message..." className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none" />
                  <button type="submit" disabled={!newMessage.trim()} className="bg-blue-500 text-white rounded-xl px-4 py-2 disabled:opacity-50">
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : <p className="text-gray-400">Sélectionnez une conversation</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
