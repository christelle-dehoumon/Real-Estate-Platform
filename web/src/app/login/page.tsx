"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();

  // Clear errors when user types
  useEffect(() => {
    if (error) clearError();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-background pt-16">

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary/10 to-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-border">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
              <LogIn className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Bienvenue</h1>
            <p className="text-sm text-muted mt-1">Connectez-vous à votre compte</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted block">Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted block">Mot de passe</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex justify-between items-center text-xs font-semibold">
              <label className="flex items-center gap-2 text-muted cursor-pointer hover:text-foreground transition-colors">
                <input type="checkbox" className="rounded border-border accent-primary" />
                Se souvenir de moi
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-secondary transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary font-bold hover:text-secondary transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
