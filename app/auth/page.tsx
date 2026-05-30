'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingMagicLink, setLoadingMagicLink] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
    
    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoadingGoogle(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' })
      return
    }

    setLoadingMagicLink(true)
    setMessage(null)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic link!' })
    }
    setLoadingMagicLink(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      {/* Auth Card matching the landing page aesthetic */}
      <div className="glass-panel-heavy rounded-xl p-8 w-full max-w-[384px] flex flex-col gap-6 relative glow-accent">
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue to-violet-accent rounded-t-xl opacity-80"></div>
        
        <div className="text-center mb-2">
          <h1 className="font-headline-lg text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="font-body-md text-sm text-on-surface-variant">Sign in to your Adverto account</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-label-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loadingGoogle || loadingMagicLink}
          className="w-full bg-white text-[#0A0A0A] font-label-sm font-bold py-3 rounded-lg hover:scale-105 transition-transform duration-200 glow-accent-hover flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          {loadingGoogle ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Gmail
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#222]"></div>
          <span className="text-xs text-on-surface-variant font-label-sm uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#222]"></div>
        </div>
        
        <form onSubmit={handleMagicLinkLogin} className="flex flex-col gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">mail</span>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border border-[#222222] rounded-lg py-3 pl-10 pr-4 font-label-sm text-sm text-white placeholder-outline-variant focus:border-white focus:ring-0 transition-colors"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loadingGoogle || loadingMagicLink || !email}
            className="w-full bg-[#161616] border border-[#333] text-white font-label-sm font-bold py-3 rounded-lg hover:bg-[#222] transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:bg-[#161616]"
          >
            {loadingMagicLink ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px] text-outline-variant group-hover:text-white transition-colors">auto_awesome</span>
            )}
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  )
}
