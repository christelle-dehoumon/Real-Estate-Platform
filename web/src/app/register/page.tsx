"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer', // default role
    phone: '',


  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error, clearError } = useAuth();

  // Clear errors when user types
  useEffect(() => {
    if (error) clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.email, formData.password, formData.name]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData.name, formData.email, formData.password, formData.phone, formData.role);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-24 px-4 relative">

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-border">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
              <UserPlus className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
            <p className="text-sm text-muted mt-1">Rejoignez l&apos;excellence Fasohabitat</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted block">Nom complet</label>
                <input
                  id="register-name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted block">Téléphone</label>
                <input
                  id="register-phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  placeholder="+226 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted block">Email</label>
              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted block">Mot de passe</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-muted/60 italic">Minimum 8 caractères</p>
            </div>

            {/* Role Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted block">Je suis un...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: 'buyer', label: ' Acheteur' },
                  { role: 'owner', label: ' Propriétaire' },
                ].map((opt) => (
                  <button
                    key={opt.role}
                    type="button"
                    className={`py-3.5 px-4 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${formData.role === opt.role
                      ? 'border-primary bg-primary/8 text-primary shadow-sm scale-[1.02]'
                      : 'border-border bg-slate-50 text-muted hover:border-primary/40'
                      }`}
                    onClick={() => setFormData({ ...formData, role: opt.role })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary font-bold hover:text-secondary transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
