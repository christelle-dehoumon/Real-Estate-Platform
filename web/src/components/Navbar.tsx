"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User, ShieldCheck } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/messages/unread-count`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount);
        }
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user, API_URL]);

  const navLinks = [
    { href: '/search', label: t('nav_buy') },
    { href: '/search?type=rent', label: t('nav_rent') },
    { href: '/about', label: t('nav_about') },
  ];

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    return pathname === base;
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
      ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3'
      : 'bg-white/80 backdrop-blur-md py-5 border-b border-slate-100'
      }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group flex flex-col items-start">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Faso<span className="text-primary group-hover:text-accent transition-colors duration-300">habitat</span>
          </span>
          <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-bold uppercase tracking-widest relative group transition-all duration-300 px-1 py-1 ${active ? 'text-primary' : 'text-muted hover:text-primary'
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-5">

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-primary hover:border-primary transition-all duration-300 flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 bg-white/50"
          >
            <span className={lang === 'fr' ? 'text-primary font-black' : ''}>FR</span>
            <span className="text-muted/30">|</span>
            <span className={lang === 'en' ? 'text-primary font-black' : ''}>EN</span>
          </button>

          {user ? (
            /* Authenticated state */
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group py-1.5 px-4 rounded-full hover:bg-slate-50 relative ${pathname === '/profile' ? 'text-primary bg-slate-50' : 'text-muted hover:text-primary'
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md relative overflow-hidden">
                  <User size={14} className="text-white relative z-10" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <span>{user.name.split(' ')[0]}</span>

                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 left-8 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-full border-2 border-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all duration-500 shadow-sm"
                  title="Administration"
                >
                  <ShieldCheck size={18} />
                </Link>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-red-500 hover:border-red-500 transition-all duration-300 border border-border rounded-full px-5 py-2 bg-white/50"
              >
                <LogOut size={12} />
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            /* Guest state */
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group ${pathname === '/login' ? 'text-primary' : 'text-muted hover:text-foreground'
                  }`}
              >
                {t('nav_login')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </Link>
              <Link
                href="/register"
                className={`text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full transition-all duration-500 relative overflow-hidden group shadow-md hover:shadow-xl ${pathname === '/register'
                  ? 'bg-secondary text-white'
                  : 'bg-primary text-white hover:bg-secondary'
                  }`}
              >
                <span className="relative z-10">{t('nav_register')}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border px-6 py-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-semibold py-2.5 px-3 rounded-xl transition-all ${isActive(link.href)
                ? 'bg-primary/8 text-primary font-bold'
                : 'text-foreground hover:text-primary hover:bg-slate-50'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-bold text-primary border border-primary rounded-xl py-3 hover:bg-primary hover:text-white transition-all relative">
                  Mon profil
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-bold text-accent border border-accent rounded-xl py-3 hover:bg-accent hover:text-white transition-all">
                    Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex-1 text-center text-sm font-bold text-red-500 border border-red-200 rounded-xl py-3 hover:bg-red-500 hover:text-white transition-all">
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-bold text-primary border border-primary rounded-xl py-3 hover:bg-primary hover:text-white transition-all">{t('nav_login')}</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-bold btn-primary rounded-xl py-3">{t('nav_register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
