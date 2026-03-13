"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Phone, MoreVertical, Image as ImageIcon, Search, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL } from '@/lib/api';

export default function ChatPage() {
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
    if (!user) {
      router.push('/login');
      return;
    }
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activePartnerId) {
      fetchMessages(activePartnerId);
    }
  }, [activePartnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);

      // If we have an activePartnerId from URL, make sure they are in the list or handle it
      if (activePartnerId && !data.find((c: any) => c.partner?._id === activePartnerId)) {
        // We could fetch the user details to show them in the sidebar even if no messages yet
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/${partnerId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);

      // Mark messages as read
      await fetch(`${API_URL}/api/messages/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ otherUserId: partnerId })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartnerId) return;

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          receiverId: activePartnerId,
          content: newMessage,
          propertyId: searchParams.get('property') || undefined
        })
      });

      if (res.ok) {
        const sentMsg = await res.json();
        setMessages([...messages, sentMsg]);
        setNewMessage('');
        fetchConversations(); // Update sidebar
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const activeConv = conversations.find(c => c.partner?._id === activePartnerId);
  const activePartnerName = activeConv?.partner?.name || "Destinataire";

  return (
    <main className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
      <div className="container mx-auto px-6 h-[85vh] max-w-7xl">
        <div className="bg-white border border-border shadow-2xl overflow-hidden flex h-full rounded-3xl">

          {/* Sidebar */}
          <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-border flex flex-col bg-slate-50/50 ${activePartnerId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-8 border-b border-border space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic text-foreground">Conciergerie</h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-accent" />
                </div>
              ) : conversations.length > 0 ? (
                conversations.map(conv => (
                  <div
                    key={conv.partner?._id}
                    onClick={() => setActivePartnerId(conv.partner?._id)}
                    className={`flex items-center gap-4 p-6 cursor-pointer transition-all border-b border-border/50 ${activePartnerId === conv.partner?._id ? 'bg-white shadow-md z-10 scale-[1.02]' : 'hover:bg-white/50'}`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${conv.partner?.name}&background=0D8ABC&color=fff`}
                        alt={conv.partner?.name}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[10px] font-black uppercase tracking-widest truncate ${activePartnerId === conv.partner?._id ? 'text-accent' : 'text-foreground/60'}`}>{conv.partner?.name}</h4>
                      <p className="text-[11px] text-muted font-medium truncate mt-1 italic font-serif">{conv.lastMessage?.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Aucune conversation</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex flex-col flex-1 bg-white ${!activePartnerId ? 'hidden md:flex items-center justify-center p-20 text-center' : 'flex'}`}>
            {activePartnerId ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-white z-10">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setActivePartnerId(null)} className="md:hidden text-accent mr-2 p-2">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${activePartnerName}&background=0D8ABC&color=fff`}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{activePartnerName}</h3>
                      <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-0.5">Contact Privilégié</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 flex justify-center items-center text-muted hover:text-accent transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="w-10 h-10 flex justify-center items-center text-muted hover:text-accent transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8 bg-slate-50/30 custom-scrollbar">
                  {messagesLoading ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="animate-spin text-accent" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, idx) => (
                      <div key={msg._id || idx} className={`flex ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                        <div className="space-y-2 max-w-lg group">
                          <div className={`px-8 py-5 rounded-2xl shadow-sm border ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'bg-accent text-white border-accent rounded-tr-none' : 'bg-white text-foreground border-border rounded-tl-none'}`}>
                            <p className="text-sm font-serif italic leading-relaxed">{msg.content}</p>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest text-muted opacity-0 group-hover:opacity-100 transition-opacity block ${msg.sender === user?._id || msg.sender?._id === user?._id ? 'text-right mr-2' : 'ml-2'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <ImageIcon size={48} className="text-muted" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Démarrez une nouvelle conversation exclusive</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-border">
                  <div className="flex items-center gap-6 bg-slate-100 p-2 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/10 transition-all duration-500 border border-transparent focus-within:border-accent/20">
                    <button type="button" className="w-12 h-12 flex justify-center items-center text-muted hover:text-accent transition-colors ml-2">
                      <ImageIcon size={20} />
                    </button>
                    <input
                      type="text"
                      placeholder="Rédiger votre message confidentiel..."
                      className="flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted px-2"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 rounded-xl bg-accent text-white flex justify-center items-center shadow-lg hover:bg-slate-900 transition-all duration-500 transform hover:scale-105 active:scale-95 mr-2 group disabled:opacity-50 disabled:scale-100 disabled:hover:bg-accent">
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in zoom-in duration-1000">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border shadow-inner">
                  <Search className="text-accent/40" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif italic text-foreground mb-4">Votre Conciergerie</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted max-w-sm mx-auto leading-loose">
                    Sélectionnez un contact pour débuter un échange privilégié concernant votre futur patrimoine.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
