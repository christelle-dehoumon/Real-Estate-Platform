"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Home as HomeIcon, TrendingUp, Shield } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { icon: <HomeIcon size={22} className="text-primary" />, value: '1,200+', label: 'Biens' },
    { icon: <TrendingUp size={22} className="text-primary" />, value: '450M', label: 'FCFA vendus' },
    { icon: <Shield size={22} className="text-primary" />, value: '98%', label: 'Satisfaction' },
  ];

  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/properties?limit=3`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProperties(data.slice(0, 3));
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="min-h-screen bg-background">

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/97 via-white/80 to-white/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-16 pt-28 pb-20">
          <div className="max-w-2xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/8 border border-primary/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">{t('home_hero_badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
              {t('home_hero_title1')}{' '}
              <span className="gradient-text font-extrabold italic">{t('home_hero_title2')}</span>
              <br />
              {t('home_hero_title3')}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted leading-relaxed max-w-xl border-l-4 border-primary/30 pl-5">
              {t('home_hero_desc')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/search"
                className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest"
              >
                <Search size={16} />
                {t('home_btn_explore')}
              </Link>
              <Link
                href="/publish"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-primary text-primary text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
              >
                {t('home_btn_publish')}
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl">
                  {s.icon}
                  <div>
                    <p className="text-sm font-black text-foreground">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Découvrir</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Pourquoi Fasohabitat</span>
            <h2 className="text-4xl font-bold text-foreground">
              La plateforme <span className="gradient-text">de référence</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">De la recherche à la signature, nous vous accompagnons à chaque étape de votre projet immobilier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '🏡', title: 'Villas & Résidences', desc: "Des biens d'exception à Ouagadougou, Bobo-Dioulasso et Banfora." },
              { emoji: '🔍', title: 'Recherche Intelligente', desc: 'Filtrez par ville, budget, type de bien pour trouver en quelques clics.' },
              { emoji: '🤝', title: 'Experts Locaux', desc: 'Une équipe de 25 experts immobiliers à votre disposition.' },
            ].map((f, i) => (
              <div key={i} className="glass-card card-shadow card-shadow-hover rounded-2xl p-8 text-center space-y-4 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/8 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                  {f.emoji}
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Properties ─── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Coup de coeur</span>
              <h2 className="text-3xl font-bold text-foreground">Biens en vedette</h2>
            </div>
            <Link href="/search" className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1">
              Voir tout →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((p, i) => (
              <Link href={`/property/${p._id}`} key={p._id} className="group block bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={p.images?.[0]?.startsWith('/') ? `${API_URL}${p.images[0]}` : (p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {p.transactionType === 'rent' ? 'Location' : 'Vente'}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-xs text-muted">📍 {p.location?.city} • {p.features?.bedrooms || 0} pièces</p>
                  <p className="text-primary font-black text-lg">{new Intl.NumberFormat().format(p.price)} FCFA</p>
                </div>
              </Link>
            ))}
            {featuredProperties.length === 0 && (
              <div className="col-span-3 text-center py-20 text-muted">Chargement des biens exclusifs...</div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 bg-white border-t border-border">
        <div className="container mx-auto px-6 lg:px-16 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">Prêt à trouver votre bien idéal ?</h2>
          <p className="text-muted max-w-xl mx-auto">Rejoignez des centaines de familles qui ont trouvé leur maison avec Fasohabitat.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn-primary text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-primary transition-all shadow-md">
              Rechercher un bien
            </Link>
            <Link href="/register" className="border-2 border-border text-foreground font-black text-sm uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
