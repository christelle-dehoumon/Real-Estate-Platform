"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useJsApiLoader } from '@react-google-maps/api';
import { Upload, MapPin, ShieldCheck, ChevronRight, Trash2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

const AMENITIES = [
  { id: 'pool', fr: 'Piscine', en: 'Pool' },
  { id: 'garage', fr: 'Garage', en: 'Garage' },
  { id: 'garden', fr: 'Jardin', en: 'Garden' },
  { id: 'ac', fr: 'Climatisation', en: 'Air Conditioning' },
  { id: 'generator', fr: 'Groupe Électrogène', en: 'Generator' },
  { id: 'borehole', fr: 'Forage', en: 'Borehole' },
  { id: 'security', fr: 'Sécurité 24/7', en: '24/7 Security' },
  { id: 'kitchen', fr: 'Cuisine Équipée', en: 'Equipped Kitchen' },
  { id: 'balcony', fr: 'Balcon', en: 'Balcony' },
  { id: 'terrace', fr: 'Terrasse', en: 'Terrace' }
];

const mapContainerStyle = {
  width: '100%',
  height: '450px',
};

const defaultCenter = {
  lat: 12.3714,
  lng: -1.5197
};

export default function PublishPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<'rent' | 'sell'>('rent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    surface: '',
    bedrooms: '1',
    bathrooms: '1',
    description: '',
    city: '',
    address: '',
    propertyType: 'villa'
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [deedFile, setDeedFile] = useState<File | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const idCardRef = useRef<HTMLInputElement>(null);
  const deedRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setPhotos([...photos, ...selected]);

      const previews = selected.map(file => URL.createObjectURL(file));
      setPhotosPreviews([...photosPreviews, ...previews]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('transactionType', transactionType);
      formDataToSend.append('propertyType', formData.propertyType);

      formDataToSend.append('location', JSON.stringify({
        city: formData.city,
        address: formData.address
      }));

      formDataToSend.append('features', JSON.stringify({
        area: Number(formData.surface),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms)
      }));

      formDataToSend.append('amenities', JSON.stringify(selectedAmenities));

      // Append files
      photos.forEach(file => {
        formDataToSend.append('images', file);
      });

      if (idCardFile) formDataToSend.append('idCard', idCardFile);
      if (deedFile) formDataToSend.append('titleDeedOrLease', deedFile);

      const res = await fetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la publication');

      setSuccess(true);
      setTimeout(() => router.push('/profile'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col gap-4 mb-16 text-center lg:text-left">
          <div className="inline-block px-4 py-1.5 border border-accent/30 rounded-full bg-accent/10 backdrop-blur-sm mx-auto lg:mx-0 w-fit">
            <span className="text-accent text-[8px] font-bold uppercase tracking-[0.3em]">{t('pub_new_coll')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic text-foreground leading-tight">{t('pub_title')}</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted font-black">{t('pub_subtitle')}</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-2xl text-center mb-12 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-bold mb-2">Annonce publiée avec succès !</h3>
            <p>Elle sera validée par nos experts sous 24h. Redirection vers votre profil...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl mb-12 flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg">⚠️</div>
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-20">
          {/* Section 1: Type & Base Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-muted">{t('pub_nature')}</h2>
              <p className="text-xs text-muted leading-relaxed font-medium italic font-serif">{t('pub_nature_desc')}</p>

              <div className="flex flex-col gap-4 pt-4">
                <button
                  type="button"
                  className={`py-5 px-8 border text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-xl ${transactionType === 'rent' ? 'bg-accent text-white border-accent shadow-md' : 'bg-white border-border text-muted hover:border-accent/40'}`}
                  onClick={() => setTransactionType('rent')}
                >
                  {t('pub_rent_label')}
                </button>
                <button
                  type="button"
                  className={`py-5 px-8 border text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-xl ${transactionType === 'sell' ? 'bg-accent text-white border-accent shadow-md' : 'bg-white border-border text-muted hover:border-accent/40'}`}
                  onClick={() => setTransactionType('sell')}
                >
                  {t('pub_sell_label')}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-12 border border-border space-y-12 rounded-2xl shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted border-b border-border pb-6">{t('pub_reg_info')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-accent block">{t('pub_label_title')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-xl font-serif italic placeholder-muted focus:outline-none focus:border-accent transition-all"
                    placeholder={t('pub_placeholder_title')}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('pub_label_price')} ({transactionType === 'rent' ? `FCFA/${lang === 'fr' ? 'mois' : 'month'}` : 'FCFA'})</label>
                  <input
                    type="number"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg placeholder-muted focus:outline-none focus:border-accent transition-all"
                    placeholder={t('pub_placeholder_price')}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('search_property_type')}</label>
                  <select
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="villa">{t('search_property_villa')}</option>
                    <option value="apartment">{t('search_property_apartment')}</option>
                    <option value="land">{t('search_property_land')}</option>
                    <option value="office">{t('search_property_office')}</option>
                    <option value="hotel">{t('search_property_hotel')}</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('pub_label_surface')} ({t('prop_area')})</label>
                  <input
                    type="number"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg placeholder-muted focus:outline-none focus:border-accent transition-all"
                    placeholder={t('pub_placeholder_surface')}
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('pub_label_rooms')}</label>
                  <input
                    type="number"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg placeholder-muted focus:outline-none focus:border-accent transition-all"
                    placeholder="Ex: 5"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Salles de bain</label>
                  <input
                    type="number"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg placeholder-muted focus:outline-none focus:border-accent transition-all"
                    placeholder="Ex: 2"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 space-y-6 pt-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Équipements & Prestations</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {AMENITIES.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-[9px] font-bold uppercase transition-all ${selectedAmenities.includes(amenity.id)
                          ? 'border-accent bg-accent/5 text-accent'
                          : 'border-border bg-slate-50 text-muted hover:border-accent/30'
                          }`}
                      >
                        <CheckCircle size={12} className={selectedAmenities.includes(amenity.id) ? 'opacity-100' : 'opacity-20'} />
                        {lang === 'fr' ? amenity.fr : amenity.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('pub_narrative')}</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground placeholder-muted focus:outline-none focus:border-accent transition-all font-serif italic text-lg leading-relaxed"
                    placeholder={t('pub_narrative_placeholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Localization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-muted">{t('pub_geo')}</h2>
              <p className="text-xs text-muted leading-relaxed font-medium italic font-serif">{t('pub_geo_desc')}</p>

              <div className="pt-6">
                <div className="flex items-center gap-4 p-5 bg-accent/5 border border-accent/20 rounded-xl">
                  <MapPin className="text-accent" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{t('pub_certify')}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10">
              <div className="border border-border shadow-md overflow-hidden hover:grayscale-0 transition-all duration-1000 group relative rounded-2xl">
                <iframe
                  width="100%"
                  height="450"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=-5.5,9.0,2.5,15.5&layer=mapnik&marker=12.3714,1.5242`}
                  className="grayscale hover:grayscale-0 transition-all duration-1000"
                ></iframe>
                <div className="absolute bottom-6 left-6 z-20 bg-white p-4 border border-border shadow-sm rounded-lg">
                  <p className="text-[8px] font-black uppercase tracking-widest text-accent">{t('pub_certify')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Ville</label>
                  <input
                    type="text"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg placeholder-muted focus:outline-none focus:border-accent transition-all font-serif italic"
                    placeholder="Ex: Ouagadougou"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">{t('pub_postal')}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-border text-foreground text-lg placeholder-muted focus:outline-none focus:border-accent transition-all font-serif italic"
                    placeholder={t('pub_postal_placeholder')}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-muted">{t('pub_trust')}</h2>
              <p className="text-xs text-muted leading-relaxed font-medium italic font-serif">{t('pub_trust_desc')}</p>

              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-4 p-5 border border-border italic font-serif text-muted text-sm bg-white rounded-xl shadow-sm">
                  <ShieldCheck className="text-accent/80" size={20} />
                  {t('pub_expert_val')}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-20">
              <div className="bg-white p-12 border border-border space-y-12 rounded-2xl shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted border-b border-border pb-6">{t('pub_auth')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className={`group cursor-pointer ${idCardFile ? 'border-accent' : ''}`} onClick={() => idCardRef.current?.click()}>
                    <div className={`aspect-video border border-border bg-slate-50 flex flex-col items-center justify-center gap-6 group-hover:bg-slate-100 group-hover:border-accent/40 transition-all duration-700 rounded-xl ${idCardFile ? 'bg-accent/5 border-accent/40' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:bg-accent/20 transition-all border border-border ${idCardFile ? 'bg-accent text-white' : 'bg-white'}`}>
                        <Upload size={20} className={idCardFile ? 'text-white' : 'text-muted group-hover:text-accent'} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted group-hover:text-foreground">
                        {idCardFile ? idCardFile.name : t('pub_id_card')}
                      </span>
                      <input type="file" ref={idCardRef} className="hidden" onChange={(e) => setIdCardFile(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                  <div className={`group cursor-pointer ${deedFile ? 'border-accent' : ''}`} onClick={() => deedRef.current?.click()}>
                    <div className={`aspect-video border border-border bg-slate-50 flex flex-col items-center justify-center gap-6 group-hover:bg-slate-100 group-hover:border-accent/40 transition-all duration-700 rounded-xl ${deedFile ? 'bg-accent/5 border-accent/40' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:bg-accent/20 transition-all border border-border ${deedFile ? 'bg-accent text-white' : 'bg-white'}`}>
                        <Upload size={20} className={deedFile ? 'text-white' : 'text-muted group-hover:text-accent'} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted group-hover:text-foreground text-center px-4">
                        {deedFile ? deedFile.name : (transactionType === 'rent' ? t('pub_mandate') : t('pub_title_deed'))}
                      </span>
                      <input type="file" ref={deedRef} className="hidden" onChange={(e) => setDeedFile(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-border pb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">{t('pub_photo_title')}</h3>
                  <span className="text-[9px] font-bold text-accent tracking-widest uppercase">{t('pub_photo_max')}</span>
                </div>
                {photosPreviews.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photosPreviews.map((prev, idx) => (
                      <div key={idx} className="aspect-square relative rounded-xl overflow-hidden shadow-md group">
                        <img src={prev} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotos(photos.filter((_, i) => i !== idx));
                            setPhotosPreviews(photosPreviews.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center text-muted hover:border-accent hover:text-accent transition-all rounded-xl"
                    >
                      <Upload size={24} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full h-80 border-2 border-dashed border-border bg-white flex flex-col items-center justify-center gap-6 hover:border-accent/40 hover:bg-slate-50 transition-all duration-700 group cursor-pointer relative overflow-hidden rounded-2xl"
                  >
                    <Upload size={40} className="text-muted group-hover:text-accent transition-all transform group-hover:-translate-y-2" />
                    <div className="text-center space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted group-hover:text-foreground transition-colors">{t('pub_photo_drop')}</span>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-widest">{t('pub_photo_formats')}</p>
                    </div>
                  </div>
                )}
                <input type="file" multiple ref={photoInputRef} className="hidden" onChange={handlePhotoChange} />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-20 border-t border-border flex flex-col sm:flex-row justify-end items-center gap-12">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-muted hover:text-accent transition-colors duration-500"
            >
              {t('pub_abandon')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group relative px-16 py-7 bg-accent text-white text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-700 hover:shadow-xl rounded-xl min-w-[300px] overflow-hidden disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {loading ? 'Homologation en cours...' : (
                  <>
                    {t('pub_submit')} <ChevronRight size={18} />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 opacity-10" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
