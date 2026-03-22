"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Phone, MoreVertical, Image as ImageIcon, Search, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL } from '@/lib/api';
export default function ChatPageContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activePartnerId, setActivePartnerId] = useState<string | null>(searchParams.get('owner'));
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchConversations();
  }, [user]);
  useEffect(() => { if (activePartnerId) { fetchMessages(activePartnerId); } }, [activePartnerId]);
  useEffect(() => { scrollToBottom(); }, [messages]);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const fetchMessages = async (partnerId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/${partnerId}`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setMessagesLoading(false); }
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartnerId) return;
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ receiverId: activePartnerId, content: newMessage, propertyId: searchParams.get('property') || undefined })
      });
      if (res.ok) { const sentMsg = await res.json(); setMessages([...messages, sentMsg]); setNewMessage(''); fetchConversations(); }
    } catch (err) { console.error(err); }
  };
  if (!user) return null;
  const activeConv = conversations.find(c => c.partner?._id === activePartnerId);
  const activePartnerName = activeConv?.partner?.name || "Destinataire";
  return (
    <main className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
      <div className="container mx-auto px-6 h-[85vh] max-w-7xl">
        <div className="bg-white border border-border shadow-2xl overflow-hidden flex h-full rounded-3xl">
          <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-border flex flex-col bg-slate-50/50 ${activePartnerId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-8 border-b border-border space-y-6">
              <h2 className="text-2xl font-serif italic text-foreground">Conciergerie</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>
              : conversations.length > 0 ? conversations.map(conv => (
                <div key={conv.partner?._id} onClick={() => setActivePartnerId(conv.partner?._id)}
                  className={`flex items-center gap-4 p-6 cursor-pointer border-b border-border/50 ${activePartnerId === conv.partner?._id ? 'bg-white' : 'hover:bg-white/50'}`}>
                  <img src={`https://ui-avatars.com/api/?name=${conv.partner?.name}&background=0D8ABC&color=fff`} alt={conv.partner?.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black uppercase tracking-widest truncate">{conv.partner?.name}</h4>
                    <p className="text-[11px] text-muted truncate italic">{conv.lastMessage?.content}</p>
                  </div>
                </div>
              )) : <div className="p-12 text-center"><p className="text-[10px] font-bold uppercase text-muted">Aucune conversation</p></div>}
            </div>
          </div>
          <div className={`flex flex-col flex-1 bg-white ${!activePartnerId ? 'hidden md:flex items-center justify-center p-20 text-center' : 'flex'}`}>
            {activePartnerId ? (
              <>
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setActivePartnerId(null)} className="md:hidden text-accent mr-2"><ArrowLeft size={20} /></button>
                    <h3 className="text-xs font-black uppercase tracking-widest">{activePartnerName}</h3>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                  {messagesLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div>
                  : messages.map((msg, idx) => (
                    <div key={msg._id || idx} className={`flex ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-8 py-5 rounded-2xl max-w-lg ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'bg-accent text-white' : 'bg-white text-foreground border border-border'}`}>
                        <p className="text-sm italic">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-border">
                  <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
                    <input type="text" placeholder="Votre message..." className="flex-1 bg-transparent outline-none text-xs px-2"
                      value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 rounded-xl bg-accent text-white flex justify-center items-center disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-3xl font-serif italic">Votre Conciergerie</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Sélectionnez un contact pour débuter un échange.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
