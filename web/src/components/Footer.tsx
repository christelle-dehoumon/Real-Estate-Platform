"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-slate-400">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight text-white">
                Faso<span className="text-primary">habitat</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              La référence du luxe immobilier au Burkina Faso. Des résidences d&apos;exception pour une clientèle exigeante.
            </p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-primary transition-colors duration-300"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors duration-300"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors duration-300"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white underline decoration-primary/40 underline-offset-[12px]">Collections</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/search" className="hover:text-white transition-colors">Villas de Prestige</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Appartements Exclusifs</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Terrains Titrés</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Bureaux & Commerces</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white underline decoration-primary/40 underline-offset-[12px]">Société</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">Notre Héritage</Link></li>
              <li><Link href="/publish" className="hover:text-white transition-colors">Publier une Annonce</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">F.A.Q.</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Politique de Confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white underline decoration-primary/40 underline-offset-[12px]">Conciergerie</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>Ouaga 2000, Zone d&apos;Excellence, Ouagadougou, Burkina Faso</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:+22600000000" className="hover:text-white transition-colors">+226 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:contact@fasohabitat.com" className="hover:text-white transition-colors">contact@fasohabitat.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest">
            © 2024 Fasohabitat. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Conditions Générales</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
