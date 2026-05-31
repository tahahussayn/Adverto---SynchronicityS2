'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'magiclink'>('login')
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    
    if (errorParam) {
      let errorText = decodeURIComponent(errorParam)
      if (errorParam === 'could_not_verify') {
        errorText = 'Invalid or expired magic link. Please request a new one.'
      } else if (errorParam === 'missing_token_or_type') {
        errorText = 'Your magic link is missing the verification token. Please update your Supabase Email Templates to use {{ .TokenHash }}.'
      }
      
      setMessage({ type: 'error', text: errorText })
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.location.href = '/campaigns'
      }
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/campaigns'
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' })
      return
    }
    if (authMode !== 'magiclink' && !password) {
      setMessage({ type: 'error', text: 'Please enter a password.' })
      return
    }

    setLoadingAuth(true)
    setMessage(null)
    
    let result;
    
    if (authMode === 'magiclink') {
      result = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/campaigns`,
        },
      })
    } else if (authMode === 'signup') {
      result = await supabase.auth.signUp({
        email,
        password,
      })
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    }

    const { error } = result;

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      if (authMode === 'magiclink') {
        setMessage({ type: 'success', text: 'Check your email for the magic link!' })
      } else if (authMode === 'signup') {
        setMessage({ type: 'success', text: 'Account created successfully! Check your email to verify your account.' })
      } else {
        // Successful login will be caught by onAuthStateChange listener
        setMessage({ type: 'success', text: 'Successfully logged in. Redirecting...' })
      }
    }
    setLoadingAuth(false)
  }
  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-grid-pattern w-full">
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-glow-abstract rounded-full mix-blend-screen opacity-70"></div>
      </div>
      
      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[440px] px-sm flex flex-col items-center">
        {/* Prominent Logo */}
        <div className="flex items-center justify-center gap-xs mb-lg">
          <img src="/logo.png" alt="Adverto" className="w-12 h-12 object-contain" />
          <h1 className="font-display-lg text-[48px] md:text-display-lg tracking-tighter font-bold">Adverto</h1>
        </div>
        
        {/* Auth Card */}
        <div className="relative w-full">
          <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] z-[-1] opacity-75 blur-[1px]"></div>
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] feature-border-top overflow-hidden">
            <div className="p-margin">
              {/* Header */}
              <div className="text-center mb-md">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {authMode === 'login' && "Welcome back. Sign in below."}
                  {authMode === 'signup' && "Create a new Adverto account."}
                  {authMode === 'magiclink' && "We'll email you a secure link to sign in instantly."}
                </p>
              </div>
              
              {message && (
                <div className={`mb-md p-3 rounded-lg text-sm font-label-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-sm">
                <div>
                  <label className="sr-only" htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-md py-sm font-label-sm text-label-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none input-glow transition-all duration-300"
                    required
                  />
                </div>
                
                {authMode !== 'magiclink' && (
                  <div>
                    <label className="sr-only" htmlFor="password">Password</label>
                    <input 
                      id="password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-md py-sm font-label-sm text-label-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none input-glow transition-all duration-300"
                      required
                    />
                  </div>
                )}
                
                <button 
                  type="submit"
                  disabled={loadingAuth || !email || (authMode !== 'magiclink' && !password)}
                  className="w-full bg-cta-gradient rounded-lg py-sm px-md font-label-sm text-label-sm uppercase tracking-widest font-bold mt-md transition-all duration-300 flex items-center justify-center gap-xs disabled:opacity-50"
                >
                  {loadingAuth ? (
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  ) : (
                    <>
                      {authMode === 'login' && 'Log In'}
                      {authMode === 'signup' && 'Sign Up'}
                      {authMode === 'magiclink' && 'Send Magic Link'}
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
              
              {/* Mode Toggles */}
              <div className="mt-md flex flex-col items-center gap-2 text-xs font-label-sm text-on-surface-variant">
                {authMode === 'login' ? (
                  <>
                    <button type="button" onClick={() => setAuthMode('signup')} className="hover:text-white transition-colors">Don't have an account? Sign Up</button>
                    <button type="button" onClick={() => setAuthMode('magiclink')} className="hover:text-white transition-colors">Use Magic Link instead</button>
                  </>
                ) : authMode === 'signup' ? (
                  <>
                    <button type="button" onClick={() => setAuthMode('login')} className="hover:text-white transition-colors">Already have an account? Log In</button>
                    <button type="button" onClick={() => setAuthMode('magiclink')} className="hover:text-white transition-colors">Use Magic Link instead</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => setAuthMode('login')} className="hover:text-white transition-colors">Log in with Password</button>
                    <button type="button" onClick={() => setAuthMode('signup')} className="hover:text-white transition-colors">Sign up with Password</button>
                  </>
                )}
              </div>
            </div>
            
            {/* Footer Links */}
            <div className="bg-surface-container-lowest/50 backdrop-blur-sm border-t border-outline-variant/30 p-md flex items-center justify-center">
              <a className="font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-base" href="/">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
