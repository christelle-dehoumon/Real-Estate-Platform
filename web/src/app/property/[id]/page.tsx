"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { MapPin, CheckCircle, MessageSquare, Phone, Flag, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";

export default function PropertyDetails() {
  const params = useParams();
  const id = params.id as string;
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('prop_delete_confirm'))) return;

    try {
      const res = await fetch(`${API_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        router.push('/profile');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const reason = prompt(t('prop_report_reason'));
    if (!reason) return;

    try {
      const res = await fetch(`${API_URL}/api/supervision/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ propertyId: id, reason })
      });
      if (res.ok) {
        alert(t('prop_report_success'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/properties/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Propriété non trouvée");
      const data = await res.json();
      setProperty(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(price) + ' FCFA';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="text-muted font-black uppercase tracking-[0.3em] text-xs">Immersion en cours...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-slate-50 px-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif italic text-foreground">Oups...</h1>
          <p className="text-muted max-w-md mx-auto">{error || "Cette propriété semble s'être évanouie dans les sables du temps."}</p>
        </div>
        <Link href="/search" className="btn-primary px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
          Retour à la Collection
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation Header Overlay */}
      <div className="fixed top-24 left-12 z-30 hidden lg:block">
        <Link href="/search" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('prop_back')}</span>
        </Link>
      </div>

      {/* Hero Gallery */}
      <div className="w-full h-[75vh] relative pt-0">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <img
          src={property.images?.[0]?.startsWith('/') ? `${API_URL}${property.images[0]}` : (property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute z-20 bottom-0 left-0 w-full p-12 lg:p-24 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
          <div className="container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="inline-block px-4 py-1.5 border border-accent/40 rounded-full bg-accent/90 backdrop-blur-md mb-6 shadow-md">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{t('prop_exclusive')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-white tracking-tighter leading-tight mb-6 drop-shadow-lg">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-md">
              <MapPin size={18} className="text-accent" /> {property.location?.city} <span className="text-accent/50">•</span> {property.location?.address}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-24 py-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-20">

            {/* Elegant Stats */}
            <div className="grid grid-cols-3 py-10 border-y border-border bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="text-center group border-r border-border">
                <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-2 group-hover:text-accent transition-colors">{t('prop_price_direct')}</p>
                <p className="text-xl md:text-2xl font-light text-foreground">{formatPrice(property.price)}</p>
              </div>
              <div className="text-center group border-r border-border">
                <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-2 group-hover:text-accent transition-colors">{t('prop_surface')}</p>
                <p className="text-2xl md:text-3xl font-light text-foreground">{property.features?.area} {t('prop_area')}</p>
              </div>
              <div className="text-center group">
                <p className="text-muted text-[8px] font-black uppercase tracking-widest mb-2 group-hover:text-accent transition-colors">{t('prop_config')}</p>
                <p className="text-2xl md:text-3xl font-light text-foreground">{property.features?.bedrooms} {t('prop_rooms')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-accent/50" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted">{t('prop_experience')}</h2>
              </div>
              <p className="text-xl text-foreground font-light leading-relaxed font-serif italic max-w-3xl whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Features/Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-accent/50" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted">{t('prop_prestations')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
                  {property.amenities.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-5 text-muted-foreground text-sm font-medium border-b border-border pb-6 group">
                      <CheckCircle className="text-accent opacity-80 group-hover:opacity-100 transition-opacity" size={20} />
                      <span className="group-hover:text-foreground transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {property.images && property.images.length > 1 && (
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-accent/50" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted">{t('prop_immersiv')}</h2>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {property.images.slice(1).map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-[4/3] overflow-hidden group shadow-lg rounded-2xl">
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                      <img
                        src={img.startsWith('/') ? `${API_URL}${img}` : img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localization Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-accent/50" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted">Localisation</h2>
              </div>
              <div className="border border-border shadow-md overflow-hidden hover:grayscale-0 transition-all duration-1000 group relative rounded-3xl">
                <iframe
                  width="100%"
                  height="450"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?width=100%25&height=400&hl=fr&q=${encodeURIComponent(property.location?.address + ", " + property.location?.city + ", Burkina Faso")}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                  className="grayscale hover:grayscale-0 transition-all duration-1000"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Sticky Luxury Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28 bg-white border border-border p-12 shadow-xl space-y-12 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
              <div className="text-center space-y-6">
                <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted">{t('prop_conciergerie')}</h3>
                <div className="relative inline-block">
                  <img
                    src={`https://ui-avatars.com/api/?name=${property.owner?.name || 'Agent'}&background=0D8ABC&color=fff`}
                    alt={property.owner?.name}
                    className="w-28 h-28 rounded-full object-cover shadow-sm mx-auto border-4 border-white"
                  />
                  <div className="absolute bottom-1 right-1 w-7 h-7 bg-accent rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-serif italic text-foreground">{property.owner?.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mt-1">{t('prop_broker')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/chat?owner=${property.owner?._id}&property=${property._id}`}>
                  <button className="w-full flex justify-center items-center gap-4 bg-accent text-white py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-900 transition-all duration-500 shadow-md rounded-xl">
                    <MessageSquare size={18} />
                    {t('prop_chat')}
                  </button>
                </Link>
                <button
                  onClick={() => window.location.href = `tel:${property.owner?.phone || '+226'}`}
                  className="w-full flex justify-center items-center gap-4 border border-border bg-white text-muted py-6 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-50 hover:text-foreground transition-all duration-500 rounded-xl"
                >
                  <Phone size={18} className="text-accent" />
                  {t('prop_expert')}
                </button>
              </div>

              <div className="pt-8 border-t border-border flex flex-col gap-6">
                {user?._id === property.owner?._id && (
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                    {t('prop_delete')}
                  </button>
                )}
                <button
                  onClick={handleReport}
                  className="w-full flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-muted hover:text-red-500 transition-colors"
                >
                  <Flag size={12} />
                  {t('prop_report')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
