"use client";

import { Shield, Sparkles, MapPin, Users, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  const stats = [
    { label: t('about_stats_items'), value: '1,200+', icon: <MapPin size={20} className="text-primary" /> },
    { label: t('about_stats_sales'), value: '450 M FCFA', icon: <TrendingUp size={20} className="text-primary" /> },
    { label: t('about_stats_clients'), value: '98%', icon: <Users size={20} className="text-primary" /> },
    { label: t('about_stats_experts'), value: '25', icon: <Award size={20} className="text-primary" /> },
  ];

  const engagements = [
    { title: t('about_engagement_v1_title'), text: t('about_engagement_v1_desc') },
    { title: t('about_engagement_v2_title'), text: t('about_engagement_v2_desc') },
    { title: t('about_engagement_v3_title'), text: t('about_engagement_v3_desc') },
  ];

  return (
    <main className="min-h-screen bg-background">

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src="/about_hero.png"
            alt="Luxury Home"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6 py-20">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md">
            <span className="text-primary text-xs font-black uppercase tracking-widest">{t('about_hero_badge')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight drop-shadow-sm">
            {t('about_hero_title')}
          </h1>
          <p className="text-muted text-sm md:text-base uppercase tracking-widest font-semibold">
            {t('about_hero_subtitle')}
          </p>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card card-shadow rounded-2xl p-6 text-center space-y-3 group hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Philosophy ─── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-primary">{t('about_philosophy_badge')}</span>
                <h2 className="text-4xl font-bold text-foreground leading-tight">{t('about_philosophy_title')}</h2>
              </div>
              <p className="text-lg text-muted leading-relaxed">
                {t('about_philosophy_desc')}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { icon: <Shield size={20} className="text-primary" />, title: t('about_feature_discretion'), desc: t('about_feature_discretion_desc') },
                  { icon: <Sparkles size={20} className="text-primary" />, title: t('about_feature_rarity'), desc: t('about_feature_rarity_desc') },
                ].map((feature, i) => (
                  <div key={i} className="space-y-3 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">{feature.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/about_philosophy.png"
                  alt="Architecture Detail"
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Engagements ─── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary">{t('about_engagement_badge')}</span>
            <h2 className="text-4xl font-bold text-foreground">{t('about_engagement_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagements.map((item, idx) => (
              <div key={idx} className="glass-card card-shadow card-shadow-hover rounded-2xl p-8 space-y-5 group transition-all duration-300 hover:border-primary/20 border border-transparent">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
                  <span className="text-white font-black text-lg">0{idx + 1}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
