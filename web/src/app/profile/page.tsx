"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Heart, MessageSquare, Settings, LogOut, ChevronRight, ShieldCheck, Users, BarChart3, AlertTriangle, Trash2, Send, Loader2, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

export default function ProfilePage() {
  const { lang, t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('mes_annonces');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'mes_annonces') {
        const res = await fetch(`${API_URL}/api/properties?owner=${user?._id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } else if (activeTab === 'favoris') {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      } else if (activeTab === 'messages') {
        const res = await fetch(`${API_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
        setConversations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${user.token}` },
          body: formData
        });
        if (res.ok) {
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBlockReport = async (id: string, propertyId: string) => {
    try {
      await fetch(`${API_URL}/api/supervision/block/${propertyId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setReports(reports.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFavorite = async (propertyId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setFavorites(favorites.filter(f => f.property?._id !== propertyId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm(t('prop_delete_confirm'))) return;

    try {
      const res = await fetch(`${API_URL}/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setListings(listings.filter(item => item._id !== propertyId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { id: 'mes_annonces', label: t('prof_tab_listings'), icon: MapPin },
    { id: 'favoris', label: t('prof_tab_favs'), icon: Heart },
    { id: 'messages', label: t('prof_tab_msgs'), icon: MessageSquare },
    { id: 'parametres', label: t('prof_tab_settings'), icon: Settings },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'supervision', label: t('sup_tab'), icon: ShieldCheck });
  }

  return (
    <main className="min-h-screen pt-40 pb-24 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-40 space-y-12">
              <div className="flex flex-col items-center text-center space-y-8">
                <div
                  className="relative group cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  <div className="absolute inset-0 border border-accent/40 rounded-full animate-[ping_3s_ease-in-out_infinite] opacity-20" />
                  <img
                    src={user?.photoUrl ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${API_URL}${user.photoUrl}`) : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700 border-2 border-border p-1.5 relative z-10"
                  />
                  <div className="absolute inset-1.5 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif italic text-foreground">{user?.name}</h2>
                  <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-accent">
                      {user?.role === 'admin' ? "Administrateur" : (user?.role === 'owner' ? t('prof_status_owner') : t('prof_status_member'))}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2 pt-8 border-t border-border">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-5 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative group overflow-hidden ${activeTab === item.id ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
                  >
                    {activeTab === item.id && (
                      <div className="absolute inset-0 bg-slate-100 border-l-2 border-accent" />
                    )}
                    <item.icon size={16} className={`relative z-10 transition-colors ${activeTab === item.id ? 'text-accent' : 'text-muted/60 group-hover:text-muted'}`} />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}

                <div className="pt-8">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-5 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-red-500/30 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500"
                  >
                    <LogOut size={16} />
                    {t('prof_logout')}
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="w-full lg:w-3/4">
            <div className="bg-white border border-border min-h-[700px] p-12 shadow-xl relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

              {activeTab === 'mes_annonces' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 pb-8 border-b border-border">
                    <div className="space-y-2">
                      <h3 className="text-4xl font-serif italic text-foreground leading-none">{t('prof_patrimoine')}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">{t('prof_patrimoine_desc')}</p>
                    </div>
                    <a href="/publish" className="group relative px-10 py-5 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 shadow-xl">
                      <span className="relative z-10">{t('prof_inscrire')}</span>
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
                    </a>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-primary" size={40} />
                      <p className="text-muted font-bold uppercase tracking-widest text-xs">Chargement de votre patrimoine...</p>
                    </div>
                  ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {listings.map((item: any) => (
                        <div key={item._id} className="group flex flex-col">
                          <div className="relative aspect-video overflow-hidden mb-6 shadow-2xl">
                            <div className="absolute inset-0 bg-cover bg-center grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${item.images?.[0]?.startsWith('/') ? `${API_URL}${item.images[0]}` : (item.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')})` }} />
                            <div className="absolute top-6 right-6 px-4 py-1.5 bg-accent text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                              {item.status === 'approved' ? t('prof_status_online') : (item.status === 'pending' ? 'En attente' : item.status)}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-2xl font-serif italic text-foreground group-hover:text-accent transition-all duration-500">{item.title}</h4>
                            <div className="flex justify-between items-center pt-6 border-t border-border">
                              <p className="text-xl font-light text-foreground">{new Intl.NumberFormat('fr-FR').format(item.price)} <span className="text-[10px] text-muted font-bold uppercase tracking-widest ml-1">FCFA</span></p>
                              <div className="flex items-center gap-6">
                                <button
                                  onClick={() => handleDeleteProperty(item._id)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                  title="Supprimer l'annonce"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <a href={`/property/${item._id}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-accent transition-all duration-500 flex items-center gap-3">
                                  {t('prof_admin')} <ChevronRight size={14} className="text-accent" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 border border-dashed border-border rounded-2xl">
                      <p className="text-muted italic font-serif">Vous n'avez pas encore d'annonces.</p>
                      <a href="/publish" className="inline-block mt-4 text-accent font-bold uppercase tracking-widest text-[10px]">{t('prof_inscrire')}</a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favoris' && (
                <div className="animate-in fade-in duration-1000 relative z-10 h-full">
                  <div className="space-y-2 pb-8 border-b border-border mb-12">
                    <h3 className="text-4xl font-serif italic text-foreground leading-none">Collections Privées</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Vos propriétés coup de cœur</p>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                  ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {favorites.map((fav: any) => (
                        <div key={fav._id} className="group relative border border-border bg-white p-4 transition-all hover:shadow-2xl rounded-2xl">
                          <div className="relative h-48 overflow-hidden rounded-xl mb-6">
                            <img src={fav.property?.images?.[0]?.startsWith('/') ? `${API_URL}${fav.property.images[0]}` : (fav.property?.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <button
                              onClick={() => handleDeleteFavorite(fav.property?._id)}
                              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                              <Star size={10} fill="currentColor" /> {fav.property?.location?.city}
                            </p>
                            <h4 className="text-lg font-serif italic text-foreground group-hover:text-accent transition-colors truncate">{fav.property?.title}</h4>
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                              <p className="text-sm font-bold text-foreground">{new Intl.NumberFormat('fr-FR').format(fav.property?.price || 0)} FCFA</p>
                              <a href={`/property/${fav.property?._id}`} className="text-[9px] font-black uppercase tracking-widest text-muted hover:text-accent flex items-center gap-2">
                                Explorer <ChevronRight size={12} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-32 border border-dashed border-border rounded-2xl flex flex-col justify-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-border">
                        <Heart size={32} className="text-muted/30" />
                      </div>
                      <h3 className="text-3xl font-serif italic text-foreground mb-4">{t('prof_fav_empty')}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted max-w-sm mx-auto leading-relaxed">
                        {t('prof_fav_empty_desc')}
                      </p>
                      <a href="/search" className="inline-block mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-accent hover:text-white transition-all duration-500">
                        {t('prof_start_explore')} &rarr;
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="animate-in fade-in duration-1000 h-full flex flex-col relative z-10">
                  <div className="space-y-2 pb-8 border-b border-border mb-12">
                    <h3 className="text-4xl font-serif italic text-foreground leading-none">{t('prof_conciergerie')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">{t('prof_msgs_desc')}</p>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="animate-spin text-accent" />
                    </div>
                  ) : conversations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {conversations.map((conv) => (
                        <div
                          key={conv.partner?._id}
                          onClick={() => router.push(`/chat?owner=${conv.partner?._id}`)}
                          className="group flex items-center gap-6 p-6 border border-border bg-white transition-all duration-500 cursor-pointer hover:shadow-2xl hover:border-accent/30 rounded-2xl"
                        >
                          <div className="relative">
                            <img src={`https://ui-avatars.com/api/?name=${conv.partner?.name}&background=0D8ABC&color=fff`} className="w-16 h-16 rounded-full border border-border object-cover" alt="" />
                            {conv.unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">{conv.unreadCount}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-xs font-black uppercase tracking-wider text-foreground truncate">{conv.partner?.name}</h4>
                              <span className="text-[8px] text-muted font-bold uppercase">Actif</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground italic font-serif truncate mt-1">{conv.lastMessage?.content}</p>
                          </div>
                          <ChevronRight className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 border border-dashed border-border rounded-2xl">
                      <MessageSquare size={32} className="text-muted/30 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted">Aucune conversation active</p>
                    </div>
                  )}

                  <div className="mt-12 text-center">
                    <button onClick={() => router.push('/chat')} className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:underline">Accéder à la messagerie complète &rarr;</button>
                  </div>
                </div>
              )}

              {activeTab === 'parametres' && (
                <div className="animate-in fade-in duration-1000 relative z-10">
                  <div className="space-y-2 pb-12 border-b border-border mb-16">
                    <h3 className="text-4xl font-serif italic text-foreground leading-none">{t('prof_tab_settings')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Ajustez vos préférences exclusives</p>
                  </div>
                  <form className="space-y-12 max-w-2xl">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('prof_settings_identity')}</label>
                      <input type="text" defaultValue={user?.name || ''} className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground font-serif italic text-xl focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('prof_settings_email')}</label>
                      <input type="email" defaultValue={user?.email || ''} className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground font-light text-lg focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('prof_settings_phone')}</label>
                      <input type="tel" defaultValue={user?.phone || ''} className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground font-light text-lg focus:outline-none focus:border-accent transition-all" />
                    </div>
                    <div className="pt-8">
                      <button className="px-16 py-6 bg-accent text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-slate-800 transition-all duration-700 shadow-xl relative overflow-hidden group rounded-xl">
                        <span className="relative z-10">{t('prof_settings_button')}</span>
                        <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 opacity-10" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
