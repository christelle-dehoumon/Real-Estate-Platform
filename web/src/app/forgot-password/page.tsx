"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center pt-20 bg-slate-50">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md p-10 bg-white shadow-2xl m-4 border-t-4 border-accent">
        <Link href="/login" className="flex items-center gap-2 text-primary/40 hover:text-accent transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Retour à la connexion</span>
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-accent" size={40} />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif italic text-primary">Lien envoyé</h2>
              <p className="text-primary/60 text-sm leading-relaxed">
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe sous peu.
              </p>
            </div>
            <Link href="/login" className="block w-full py-5 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-accent">
              Terminé
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif italic text-primary mb-3">Récupération</h2>
              <div className="w-12 h-0.5 bg-accent mx-auto mb-4" />
              <p className="text-primary/60 text-[10px] uppercase tracking-widest font-black">Saisissez votre email confidentiel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 block">Email Professionnel</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    className="w-full px-0 py-4 bg-transparent border-b border-primary/10 text-primary placeholder-primary/20 focus:outline-none focus:border-accent transition-all font-serif italic text-lg"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/10" size={18} />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-5 bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-accent hover:shadow-xl shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Réinitialiser le mot de passe</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
