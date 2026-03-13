"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Heart, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

interface Property {
  _id: string;
  title: string;
  price: number;
  transactionType: 'buy' | 'rent' | 'sell';
  propertyType: string;
  location: {
    city: string;
    address: string;
  };
  features: {
    area: number;
    bedrooms: number;
  };
  images: string[];
}

export default function SearchPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ city: '', type: 'all', propertyType: 'all', maxPrice: '' });
  const [activeFilters, setActiveFilters] = useState({ city: '', type: 'all', propertyType: 'all', maxPrice: '' });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [activeFilters, user]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (activeFilters.city) query.append('city', activeFilters.city);
      if (activeFilters.type !== 'all') query.append('transactionType', activeFilters.type === 'buy' ? 'sell' : 'rent');
      if (activeFilters.propertyType !== 'all') query.append('propertyType', activeFilters.propertyType);
      if (activeFilters.maxPrice) query.append('maxPrice', activeFilters.maxPrice);

      const res = await fetch(`${API_URL}/api/properties?${query.toString()}`, {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {}
      });
      if (!res.ok) throw new Error('Erreur lors de la récupération des biens');
      const data = await res.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.map((f: any) => f.property?._id).filter(Boolean));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Veuillez vous connecter pour gérer vos favoris");
      return;
    }

    const isFav = favorites.includes(id);

    try {
      if (isFav) {
        // Remove
        const res = await fetch(`${API_URL}/api/favorites/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          setFavorites(prev => prev.filter(fid => fid !== id));
        }
      } else {
        // Add
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ propertyId: id })
        });
        if (res.ok) {
          setFavorites(prev => [...prev, id]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setActiveFilters(filters);
    const resultsSection = document.getElementById('property-grid');
    if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesPropertyType = activeFilters.propertyType === 'all' || property.propertyType === activeFilters.propertyType;
      const matchesPrice = !activeFilters.maxPrice || property.price <= parseInt(activeFilters.maxPrice);
      return matchesPropertyType && matchesPrice;
    });
  }, [properties, activeFilters]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(price) + ' FCFA';
  };

  const selectClass = "w-full appearance-none px-4 py-4 bg-white border border-border rounded-xl text-sm font-semibold text-foreground outline-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <main className="min-h-screen bg-background">

      {/* ─── Hero Header ─── */}
      <section className="bg-slate-50 pt-32 pb-16 px-6 border-b border-border">
        <div className="container mx-auto max-w-7xl text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
            <span className="text-primary text-xs font-black uppercase tracking-widest">{t('search_hero_badge')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            {t('search_hero_title')}{' '}
            <span className="italic text-accent font-extrabold">{t('search_hero_rare')}</span>
          </h1>
          <p className="text-muted max-w-lg mx-auto text-sm md:text-base">
            Trouvez votre bien idéal parmi nos propriétés d&apos;exception au Burkina Faso.
          </p>
        </div>
      </section>

      {/* ─── Search Bar ─── */}
      <section className="sticky top-16 z-30 bg-white border-b border-border shadow-sm px-6 py-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* City */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="text"
                placeholder={t('search_placeholder_city')}
                className="w-full pl-10 pr-4 py-4 bg-white border border-border rounded-xl text-sm font-medium text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>

            {/* Type Transaction */}
            <div className="relative">
              <select
                className={selectClass}
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">{t('search_type_transaction')}</option>
                <option value="buy">{t('search_type_buy')}</option>
                <option value="rent">{t('search_type_rent')}</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted" size={16} />
            </div>

            {/* Property Type */}
            <div className="relative">
              <select
                className={selectClass}
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              >
                <option value="all">{t('search_property_type')}</option>
                <option value="villa">{t('search_property_villa')}</option>
                <option value="apartment">{t('search_property_apartment')}</option>
                <option value="land">{t('search_property_land')}</option>
                <option value="office">{t('search_property_office')}</option>
                <option value="conference">{t('search_property_conference')}</option>
                <option value="hotel">{t('search_property_hotel')}</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted" size={16} />
            </div>

            {/* Max Price */}
            <div className="relative">
              <input
                type="number"
                placeholder={t('search_placeholder_price')}
                className="w-full px-4 py-4 bg-white border border-border rounded-xl text-sm font-medium text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-16"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted">FCFA</span>
            </div>

            {/* Search btn */}
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center justify-center gap-2 rounded-xl font-bold text-sm uppercase tracking-widest py-4"
            >
              <Search size={16} />
              {t('search_button')}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Results ─── */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">

          {/* Results count */}
          <div id="property-grid" className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-muted" />
              <span className="text-sm text-muted font-semibold">
                {t('search_results_prefix')}{' '}
                <span className="text-primary font-black">{filteredProperties.length}</span>{' '}
                {t('search_results_suffix')}
              </span>
            </div>
          </div>

          {/* Loading/Error State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-muted font-bold uppercase tracking-widest text-xs">Recherche en cours...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center space-y-4 mb-12">
              <p className="text-red-600 font-bold">{error}</p>
              <button onClick={fetchProperties} className="btn-primary px-6 py-2 rounded-xl text-xs uppercase tracking-widest">Réessayer</button>
            </div>
          )}

          {/* Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${loading ? 'opacity-20 pointer-events-none' : ''}`}>
            {filteredProperties.map((property) => (
              <div key={property._id} className="group bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300">
                <Link href={`/property/${property._id}`} className="block">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={property.images?.[0]?.startsWith('/') ? `${API_URL}${property.images[0]}` : (property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {property.transactionType === 'sell' ? t('search_type_buy') : t('search_type_rent')}
                      </span>
                      <span className="bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {t(`search_property_${property.propertyType}`)}
                      </span>
                    </div>
                    {/* Favorite */}
                    <button
                      onClick={(e) => toggleFavorite(e, property._id)}
                      className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${favorites.includes(property._id)
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-white/90 backdrop-blur-sm text-muted hover:text-red-500'
                        }`}
                    >
                      <Heart size={16} fill={favorites.includes(property._id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1 text-xs text-muted font-semibold">
                      <MapPin size={12} className="text-primary" />
                      {property.location?.city}
                      {property.features?.area && <span className="ml-auto">{property.features.area} m² • {property.features.bedrooms} p.</span>}
                    </div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug h-12 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <p className="text-primary font-black text-sm">
                        {formatPrice(property.price)}
                        {property.transactionType === 'rent' && (
                          <span className="text-[10px] text-muted font-semibold ml-1">/ mois</span>
                        )}
                      </p>
                      <span className="text-[10px] font-bold text-primary flex items-center gap-1 opacity-100 transition-opacity">
                        {t('search_details')}
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {filteredProperties.length === 0 && !loading && (
              <div className="col-span-full py-24 text-center space-y-4">
                <p className="text-4xl">🔍</p>
                <p className="text-xl font-bold text-foreground">{t('search_no_results')}</p>
                <p className="text-sm text-muted">Essayez d&apos;autres filtres pour affiner votre recherche.</p>
                <button
                  onClick={() => {
                    setFilters({ city: '', type: 'all', propertyType: 'all', maxPrice: '' });
                    setActiveFilters({ city: '', type: 'all', propertyType: 'all', maxPrice: '' });
                  }}
                  className="btn-primary px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest mt-4"
                >
                  {t('search_reset')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
