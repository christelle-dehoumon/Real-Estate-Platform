"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, Users, AlertTriangle, CheckCircle, XCircle, 
  Trash2, ShieldCheck, Home, Loader2, ArrowLeft, ArrowUpRight,
  Filter, Search, Clock
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/profile');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user?.token}` };
      const [statsRes, usersRes, propsRes, reportsRes] = await Promise.all([
        fetch(`${API_URL}/api/supervision/stats`, { headers }),
        fetch(`${API_URL}/api/supervision/users`, { headers }),
        fetch(`${API_URL}/api/supervision/properties`, { headers }),
        fetch(`${API_URL}/api/supervision/reports`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (propsRes.ok) setProperties(await propsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/supervision/approve/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setProperties(properties.map(p => p._id === id ? { ...p, status: 'approved' } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/supervision/block/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setProperties(properties.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/supervision/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/supervision/report/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setReports(reports.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
            <Loader2 className="animate-spin text-accent relative z-10" size={48} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Configuration du terminal de contrôle...</p>
        </div>
      </div>
    );
  }

  const filteredProperties = properties.filter(p => filter === 'all' ? true : p.status === filter);

  return (
    <main className="min-h-screen pt-40 pb-24 bg-[#0a0c10] text-slate-400 font-sans selection:bg-accent selection:text-white">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/profile')}
              className="group flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Retour au profil
            </button>
            <h1 className="text-5xl lg:text-6xl font-serif italic text-white flex items-center gap-6">
              Control <span className="text-accent">Center</span>
              <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full h-fit self-center">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-accent">Root Access</span>
              </div>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl">
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'stats' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'properties' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Patrimoine
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'users' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Citoyens
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'reports' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Alertes {reports.length > 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[8px]">{reports.length}</span>}
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/[0.07] hover:border-accent/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
                <BarChart3 className="w-10 h-10 text-accent mb-8" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Total Patrimoine</p>
                <h4 className="text-5xl font-serif italic text-white">{stats?.totalProperties || 0}</h4>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">+12.4% vs mois dernier</span>
                  <ArrowUpRight size={14} className="text-slate-600" />
                </div>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/[0.07] hover:border-accent/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
                <Users className="w-10 h-10 text-blue-400 mb-8" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Citoyens Actifs</p>
                <h4 className="text-5xl font-serif italic text-white">{stats?.totalUsers || 0}</h4>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">+5 Nouveaux profils</span>
                  <ArrowUpRight size={14} className="text-slate-600" />
                </div>
              </div>

              <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/[0.07] hover:border-accent/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all" />
                <Clock className="w-10 h-10 text-red-400 mb-8" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">En Attente</p>
                <h4 className="text-5xl font-serif italic text-white">{properties.filter(p => p.status === 'pending').length}</h4>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest">Action Immédiate Requise</span>
                  <ArrowUpRight size={14} className="text-slate-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem]">
                <h3 className="text-2xl font-serif italic text-white mb-8 border-l-2 border-accent pl-6">Analyses Récentes</h3>
                <div className="space-y-6">
                  {reports.slice(0, 3).map(r => (
                    <div key={r._id} className="flex items-center gap-6 p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-red-500/30 transition-all">
                      <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="text-red-500" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white mb-1">{r.property?.title}</p>
                        <p className="text-[9px] uppercase tracking-widest text-slate-500">{r.reason} • Par {r.reporter?.name}</p>
                      </div>
                      <button onClick={() => setActiveTab('reports')} className="text-[8px] px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg uppercase font-black transition-all">Gérer</button>
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-center py-12 text-[10px] uppercase tracking-[0.3em] text-slate-600 italic">Aucune alerte critique</p>}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem]">
                <h3 className="text-2xl font-serif italic text-white mb-8 border-l-2 border-accent pl-6">Système de Santé</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Base de données</span>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">OPERATIONAL</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Passerelle API</span>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">OPERATIONAL</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Serveur de médias</span>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
               <h2 className="text-4xl font-serif italic text-white leading-none border-l-2 border-accent pl-8">Gestion du <span className="text-accent">Patrimoine</span></h2>
               
               <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-xl">
                 <Filter size={14} className="ml-4 text-slate-500" />
                 {['all', 'pending', 'approved', 'rejected'].map(f => (
                   <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                   >
                     {f === 'all' ? 'Tous' : (f === 'pending' ? 'Attente' : (f === 'approved' ? 'En ligne' : 'Rejeté'))}
                   </button>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {filteredProperties.map(p => (
                 <div key={p._id} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-accent/30 transition-all flex flex-col">
                   <div className="relative aspect-video overflow-hidden">
                     <img 
                      src={p.images?.[0] ? (p.images[0].startsWith('/') ? `${API_URL}${p.images[0]}` : p.images[0]) : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                     />
                     <div className={`absolute top-6 right-6 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${
                       p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                       (p.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30')
                     }`}>
                       {p.status}
                     </div>
                   </div>
                   
                   <div className="p-8 flex-1 flex flex-col">
                     <div className="mb-6">
                       <h4 className="text-xl font-serif italic text-white mb-2 truncate group-hover:text-accent transition-colors">{p.title}</h4>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <MapPin size={10} /> {p.location?.city}, {p.location?.address}
                       </p>
                     </div>
                     
                     <div className="space-y-4 mb-8 pt-6 border-t border-white/5">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                          <span className="text-slate-500">Propriétaire</span>
                          <span className="text-white">{p.owner?.name}</span>
                        </div>
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                          <span className="text-slate-500">Prix</span>
                          <span className="text-accent">{new Intl.NumberFormat('fr-FR').format(p.price)} FCFA</span>
                        </div>
                     </div>

                     <div className="mt-auto grid grid-cols-2 gap-4">
                       {p.status === 'pending' && (
                         <button 
                          onClick={() => handleApprove(p._id)}
                          className="flex items-center justify-center gap-3 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-xl transition-all"
                         >
                           <CheckCircle size={14} /> Approuver
                         </button>
                       )}
                       {p.status !== 'rejected' && (
                         <button 
                          onClick={() => handleBlock(p._id)}
                          className={`flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20 rounded-xl transition-all ${p.status === 'pending' ? '' : 'col-span-2'}`}
                         >
                           <XCircle size={14} /> {p.status === 'pending' ? 'Rejeter' : 'Bloquer'}
                         </button>
                       )}
                       {p.status === 'rejected' && (
                         <button 
                          onClick={() => handleApprove(p._id)}
                          className="col-span-2 flex items-center justify-center gap-3 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-xl transition-all"
                         >
                           <CheckCircle size={14} /> Restaurer
                         </button>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h2 className="text-4xl font-serif italic text-white mb-12 border-l-2 border-accent pl-8">Registre des <span className="text-accent">Citoyens</span></h2>
             
             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Citoyen</th>
                      <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Statut</th>
                      <th className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Protection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-8 px-10">
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <div className="absolute inset-0 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                              <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random&color=fff`} className="w-14 h-14 rounded-full border border-white/10 relative z-10" alt="" />
                            </div>
                            <div>
                              <p className="text-lg font-serif italic text-white group-hover:text-accent transition-colors">{u.name}</p>
                              <p className="text-[10px] uppercase tracking-widest text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-10">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            u.role === 'admin' ? 'bg-accent/20 text-accent border-accent/20' : 
                            (u.role === 'owner' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-slate-500/20 text-slate-400 border-slate-500/20')
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-8 px-10 text-right">
                          {u.role !== 'admin' ? (
                            <button 
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div className="flex justify-end pr-4 text-emerald-500">
                              <ShieldCheck size={20} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h2 className="text-4xl font-serif italic text-white mb-12 border-l-2 border-accent pl-8">Alertes & <span className="text-red-500">Signalements</span></h2>
             
             <div className="grid grid-cols-1 gap-6">
               {reports.map(r => (
                 <div key={r._id} className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-white/[0.07] transition-all overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]" />
                   
                   <div className="flex items-center gap-10 relative z-10 flex-1">
                     <div className="w-40 h-28 bg-white/10 rounded-2xl overflow-hidden border border-white/10">
                       <img src={r.property?.images?.[0] ? (r.property.images[0].startsWith('/') ? `${API_URL}${r.property.images[0]}` : r.property.images[0]) : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                     </div>
                     <div>
                       <h4 className="text-2xl font-serif italic text-white mb-2">{r.property?.title || 'Contenu Inaccessible'}</h4>
                       <div className="flex flex-wrap gap-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">Alerte : {r.reason}</span>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pt-1">Reporté par {r.reporter?.name}</span>
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center gap-4 relative z-10">
                     <button 
                      onClick={() => router.push(`/property/${r.property?._id}`)}
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10"
                     >
                       Vérifier
                     </button>
                     <button 
                      onClick={() => handleBlock(r.property?._id)}
                      className="px-8 py-4 bg-red-500 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-2xl transition-all"
                     >
                       Neutraliser
                     </button>
                     <button 
                      onClick={() => handleDeleteReport(r._id)}
                      className="p-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-xl transition-all border border-white/10"
                     >
                       <XCircle size={18} />
                     </button>
                   </div>
                 </div>
               ))}
               {reports.length === 0 && (
                 <div className="py-40 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                    <ShieldCheck size={64} className="text-white/10 mb-8" />
                    <h3 className="text-3xl font-serif italic text-white/20">Système Silencieux</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 mt-4">Aucune menace détectée</p>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>
    </main>
  );
}

function MapPin({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
