import Image from "next/image";

export default function Home() {
  return (
    <div className="antialiased min-h-screen flex flex-col selection:bg-electric-blue selection:text-white">
      <header className="bg-background/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-surface-container-highest shadow-sm">
<div className="flex justify-between items-center px-md py-sm max-w-7xl mx-auto">
{/* Brand */}
<div className="font-headline-lg text-headline-lg font-bold text-on-background tracking-tighter cursor-pointer flex items-center gap-2">
<span className="material-symbols-outlined text-electric-blue">bolt</span>
                Adverto
            </div>
{/* Navigation Links */}
<nav className="hidden md:flex items-center gap-lg">
<a className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#how-it-works">How it Works</a>
<a className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#integrations">Integrations</a>
<a className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Pricing</a>
</nav>
{/* Actions */}
<div className="flex items-center gap-md">
<a className="font-label-sm text-label-sm text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 hidden sm:block" href="#">Login</a>
<a className="font-label-sm text-label-sm bg-white text-[#0A0A0A] px-6 py-2 rounded font-bold hover:scale-95 duration-100 transition-transform glow-accent-hover" href="#">Start Free Trial</a>
</div>
</div>
</header>
<main className="flex-grow pt-[100px] bg-grid relative overflow-hidden">
{/* Ambient Background Glow */}
<div className="absolute top-0 left-0 w-full h-full bg-radial-glow pointer-events-none -z-10" style={{background: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)'}}></div>
{/* Section 1: Hero */}
<section className="max-w-7xl mx-auto px-md py-24 flex flex-col items-center text-center relative z-10">
<h1 className="font-display-lg text-display-lg md:text-[80px] max-w-4xl mb-md bg-clip-text text-transparent bg-gradient-to-b from-white to-[#888888]">
                Replace your creative agency.<br />Generate Meta ads on autopilot.
            </h1>
<p className="font-body-md text-body-md md:text-xl text-on-surface-variant max-w-2xl mb-xl">
                Enter a prompt and a product URL. Adverto’s autonomous AI generates, publishes, and optimizes high-converting Meta ads 24/7.
            </p>
{/* Auth Card */}
<div className="glass-panel-heavy rounded-xl p-md w-full max-w-[384px] mx-auto flex flex-col gap-4 relative glow-accent mt-8">
    {/* Top Decoration */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue to-violet-accent rounded-t-xl opacity-80"></div>
    
    <button className="w-full bg-white text-[#0A0A0A] font-label-sm font-bold py-3 rounded-lg hover:scale-105 transition-transform duration-200 glow-accent-hover flex items-center justify-center gap-2 shadow-lg">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Gmail
    </button>
    
    <button className="w-full bg-[#161616] border border-[#333] text-white font-label-sm font-bold py-3 rounded-lg hover:bg-[#222] transition-colors flex items-center justify-center gap-2 group">
        <span className="material-symbols-outlined text-[18px] text-outline-variant group-hover:text-white transition-colors">mail</span>
        Continue with Magic Link
    </button>
</div>
</section>
{/* Section 2: Product Showcase (Dashboard Mockup) */}
<section className="max-w-[1400px] mx-auto px-md py-12 md:py-24">
<div className="glass-panel rounded-xl overflow-hidden border border-[#333333] shadow-2xl relative shadow-[0_0_50px_rgba(14,165,233,0.1)]">
{/* Mac-like Window Controls */}
<div className="bg-[#161616] border-b border-[#222222] px-4 py-2 flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-red-500/80"></div>
<div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
<div className="w-3 h-3 rounded-full bg-green-500/80"></div>
<div className="ml-auto font-label-sm text-label-sm text-outline-variant">adverto-dashboard.ai</div>
</div>
<div className="flex flex-col md:flex-row min-h-[500px]">
{/* Left Sidebar (Thresholds) */}
<div className="w-full md:w-64 bg-[#0e0e0e] border-r border-[#222222] p-md flex flex-col gap-lg">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">tune</span> Target Constraints
                            </div>
<div className="glass-panel p-3 rounded-lg mb-2 flex justify-between items-center">
<span className="font-body-md text-body-md text-white text-sm">Max CPA</span>
<span className="font-label-sm text-label-sm text-white font-bold">$15.00</span>
</div>
<div className="glass-panel p-3 rounded-lg flex justify-between items-center">
<span className="font-body-md text-body-md text-white text-sm">Min ROAS</span>
<span className="font-label-sm text-label-sm text-white font-bold">2.5x</span>
</div>
</div>
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">analytics</span> Real-Time Status
                            </div>
<div className="flex items-center gap-2 mb-2">
<div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
<span className="font-label-sm text-label-sm text-white text-xs">Optimization Active</span>
</div>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_rgba(14,165,233,0.6)] animate-pulse"></div>
<span className="font-label-sm text-label-sm text-white text-xs">Generating Variants</span>
</div>
</div>
</div>
{/* Creative Grid */}
<div className="flex-grow p-md bg-[#111111] p-lg">
<div className="columns-1 md:columns-2 lg:columns-3 gap-md space-y-md">
{/* Card 1: Static Image */}
<div className="glass-panel rounded-lg overflow-hidden relative break-inside-avoid">
<img alt="Product Shot" className="w-full h-auto object-cover border-b border-[#222222]" data-alt="A highly detailed, ultra-realistic product photography shot of a sleek, modern running shoe floating in a dark void. The shoe is illuminated by dramatic, high-contrast studio lighting with cool blue and crisp white accents, highlighting the textured fabric and aerodynamic design. The overall aesthetic is premium, high-tech, and perfectly matches a dark-mode, minimalist design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5c2diGHisdg7GTY2cGCncjtdsvbdVdBBXxigJmI0E4WEHB-maAyRwn0JalgxtCgwmsMJNiQaZe03ZQ6Y4L8eH9xE7j8Lhft7cRkKRUY2YQSEE22BZaTXT5tmdC-sbdh1hUrqXTCUvDFhIalB9CvZzGvYT7yQEhKlP92JO8P8XAml40v9Vkq8CKlSfKxj8T1zLe-e9hQKao_S1QFGkpfc5wjBUCjiFKyin_hAh2Cg6CLYNGKC3er170pG9-Amtuy8Xsd3gn4wXOH0" />
<div className="p-3">
<h3 className="font-label-sm text-label-sm font-bold text-white mb-1">Variant A: Speed</h3>
<p className="font-body-md text-body-md text-xs text-on-surface-variant mb-3 line-clamp-2">"Unlock your next PR with aerodynamic foam technology."</p>
<div className="inline-flex items-center gap-1 bg-[#0A0A0A] border border-green-900/50 text-green-400 px-2 py-1 rounded text-[10px] font-label-sm uppercase tracking-wider">
<span className="material-symbols-outlined text-[12px]">check_circle</span> Approved
                                    </div>
</div>
</div>
{/* Card 2: Lifestyle / Carousel */}
<div className="glass-panel rounded-lg overflow-hidden relative break-inside-avoid">
<div className="relative">
<img alt="Lifestyle Shot" className="w-full h-auto object-cover border-b border-[#222222]" data-alt="A dynamic, low-key lighting photograph of a marathon runner in mid-stride on an urban street at night. The scene is lit by ambient neon streetlights in subtle cyan and violet tones, creating a moody, intense atmosphere. The focus is sharp on the runner's footwear, while the background exhibits a smooth, cinematic motion blur. The style aligns with a dark, high-performance tech brand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKxgWKkzvuFRfNJ5es9AjL_wV6fVe5d5M7nqQiuZSykQeXu1XRQWLjhvJHZld6RiThrBptvcGJiNiuIFXrp4vDewMrw65MrQr_6xc-BebEEoNc_prjP_XNkYF-sNI1pGqZuMDoyvmLdRzv10Gw-82J8BCJaACnHwHYqPZjQe3hJiir5aDZHHRplFMPco0ZbV8ilQJ3YCXXVsi8IkILfgy4ndKfu-lji_aW8XtT20nVpytZVaHv3M34vZmNh_Kzsk0215wAP-DgV7E" />
<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
<div className="w-1.5 h-1.5 rounded-full bg-white"></div>
<div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
<div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
</div>
</div>
<div className="p-3">
<h3 className="font-label-sm text-label-sm font-bold text-white mb-1">Variant B: Lifestyle</h3>
<p className="font-body-md text-body-md text-xs text-on-surface-variant mb-3 line-clamp-2">"Built for the streets. Tested by champions."</p>
<div className="inline-flex items-center gap-1 bg-[#0A0A0A] border border-yellow-900/50 text-yellow-500 px-2 py-1 rounded text-[10px] font-label-sm uppercase tracking-wider">
<span className="material-symbols-outlined text-[12px]">hourglass_top</span> Pending
                                    </div>
</div>
</div>
{/* Card 3: Video Mockup */}
<div className="glass-panel rounded-lg overflow-hidden relative break-inside-avoid">
<div className="relative aspect-[9/16] bg-[#0A0A0A] border-b border-[#222222] flex items-center justify-center overflow-hidden group">
<img alt="Video Background" className="absolute inset-0 w-full h-full object-cover opacity-60" data-alt="A close-up, dramatic vertical shot of a person unboxing a premium pair of sneakers. The lighting is cinematic and dark, with a single soft overhead light illuminating the product box. The background is completely black, ensuring a high-end, minimalist focus on the action. The aesthetic is clean, modern, and suitable for a dark-mode UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLEUpEeVthO2wZZlhbsQuGf1qrWx144bPt2X66Hw0giWCOG4bzQEHGcvj3rQ7VjMImzyP-KDaohZLP4S-ofe0C7I14FODAvMIZOrWSriyxin5q_4Nqf1v9MI_3Um3TOwVy3aMbaR7enkue8yURdEcbEvTRYiRtLzqZB078dj2oifvKfy0KDK4x4s9B6qgVWvS4Xy7yhO-6pGLpYXwIXiI-hZh5GqekxtiI-BZJajDahyRMGMRA3h054XqxfOMCETtGd6mptRYbLso" />
<div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center z-10 group-hover:scale-110 transition-transform cursor-pointer">
<span className="material-symbols-outlined text-white text-2xl ml-1">play_arrow</span>
</div>
</div>
<div className="p-3">
<h3 className="font-label-sm text-label-sm font-bold text-white mb-1">Variant C: UGC Reel</h3>
<p className="font-body-md text-body-md text-xs text-on-surface-variant mb-3 line-clamp-2">AI-generated unboxing voiceover with animated captions.</p>
<div className="inline-flex items-center gap-1 bg-[#0A0A0A] border border-yellow-900/50 text-yellow-500 px-2 py-1 rounded text-[10px] font-label-sm uppercase tracking-wider">
<span className="material-symbols-outlined text-[12px]">hourglass_top</span> Pending
                                    </div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Section 4: Visual Workflow Pipeline */}
<section className="max-w-7xl mx-auto px-md py-24" id="how-it-works"><div className="text-center mb-16">
    <h2 className="font-headline-lg text-headline-lg font-bold text-white mb-4">The Adverto Pipeline</h2>
    <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">From input to published ad in minutes, orchestrated by intelligent agents.</p>
</div>

<div className="relative w-full overflow-x-auto pb-12">
    <div className="min-w-[1000px] flex items-center justify-between relative px-12 py-16">
        {/* Enhanced Connecting Lines SVG */}
        <svg className="absolute top-1/2 left-0 w-full h-[300px] -translate-y-1/2 pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary, #c9c6c5)"></stop>
                    <stop offset="100%" stopColor="var(--secondary, #c6c6c7)"></stop>
                </linearGradient>
            </defs>
            {/* Main paths with circuit-like feel */}
            <path className="flow-path" d="M 80 150 L 220 150" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 320 150 C 380 150, 380 62, 440 62" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 320 150 L 440 150" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 320 150 C 380 150, 380 238, 440 238" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 600 62 C 660 62, 660 150, 720 150" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 600 150 L 720 150" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 600 238 C 660 238, 660 150, 720 150" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
            <path className="flow-path" d="M 820 150 L 920 150" fill="none" stroke="url(#flow-gradient)" strokeWidth="1.5"></path>
        </svg>

        {/* Stage 1 */}
        <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="font-label-sm text-[10px] text-primary/60 uppercase tracking-widest mb-1">Step 01</span>
            <div className="w-20 h-20 rounded-2xl bg-surface-container/40 backdrop-blur-md border border-surface-bright/20 flex items-center justify-center shadow-[0_0_20px_rgba(201,198,197,0.1)]">
                <span className="material-symbols-outlined text-white text-3xl">edit_document</span>
            </div>
            <span className="font-headline-sm text-base text-white font-semibold">Brief &amp; URL</span>
        </div>

        {/* Stage 2: Orchestration */}
        <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="font-label-sm text-[10px] text-electric-blue/60 uppercase tracking-widest mb-1">Step 02</span>
            <div className="w-20 h-20 rounded-2xl bg-surface-container/40 backdrop-blur-md border border-electric-blue/30 flex items-center justify-center shadow-[0_0_25px_rgba(14,165,233,0.2)]">
                <span className="material-symbols-outlined text-electric-blue text-3xl">account_tree</span>
            </div>
            <span className="font-headline-sm text-base text-electric-blue font-bold text-center">AI Engine</span>
        </div>

        {/* Stage 3: Split Agents */}
        <div className="relative z-10 flex flex-col gap-6">
            <span className="font-label-sm text-[10px] text-primary/60 uppercase tracking-widest text-center mb-[-8px]">Step 03</span>
            <div className="flex items-center gap-4 bg-surface-container/40 backdrop-blur-md border border-surface-bright/20 p-3 rounded-xl min-w-[220px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">image</span>
                </div>
                <span className="font-headline-sm text-sm text-white">Flux/SDXL (Images)</span>
            </div>
            <div className="flex items-center gap-4 bg-surface-container/40 backdrop-blur-md border border-surface-bright/20 p-3 rounded-xl min-w-[220px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">mic</span>
                </div>
                <span className="font-headline-sm text-sm text-white">ElevenLabs (Voice)</span>
            </div>
            <div className="flex items-center gap-4 bg-surface-container/40 backdrop-blur-md border border-surface-bright/20 p-3 rounded-xl min-w-[220px] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">text_snippet</span>
                </div>
                <span className="font-headline-sm text-sm text-white">Anthropic (Copy)</span>
            </div>
        </div>

        {/* Stage 4: Dashboard */}
        <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="font-label-sm text-[10px] text-primary/60 uppercase tracking-widest mb-1">Step 04</span>
            <div className="w-20 h-20 rounded-2xl bg-surface-container/40 backdrop-blur-md border border-surface-bright/20 flex items-center justify-center shadow-[0_0_20px_rgba(201,198,197,0.1)]">
                <span className="material-symbols-outlined text-white text-3xl">dashboard</span>
            </div>
            <span className="font-headline-sm text-base text-white font-semibold">Approval Hub</span>
        </div>
    </div>
</div></section>
{/* Section 5: The Optimization Loop */}
<section className="max-w-7xl mx-auto px-md py-24 border-t border-[#222222]">
<div className="flex flex-col md:flex-row items-center gap-16">
<div className="flex-1 text-center md:text-left">
<h2 className="font-headline-lg text-headline-lg font-bold text-white mb-6">Ruthless 24/7 Optimization.</h2>
<p className="font-body-md text-on-surface-variant text-sm md:text-base mb-8 leading-relaxed">
                Adverto evaluates Meta Insights daily, automatically pausing ads that miss your ROAS targets and spinning up fresh variants from your winning creatives.
            </p>
<ul className="space-y-4 text-left inline-block md:block">
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-electric-blue">check_circle</span>
<span className="font-label-sm text-white">Daily Performance Sync</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-electric-blue">check_circle</span>
<span className="font-label-sm text-white">Automated Budget Reallocation</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-electric-blue">check_circle</span>
<span className="font-label-sm text-white">Winning Element Mutation</span>
</li>
</ul>
</div>
<div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] shrink-0 mx-auto my-12">
<div className="absolute inset-0 border-2 border-dashed border-[#444] rounded-full loop-circle opacity-50"></div>
<div className="absolute inset-4 border border-[#333] rounded-full loop-circle" style={{animationDirection: 'reverse', animationDuration: '40s'}}></div>
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel-heavy px-3 py-2 rounded-lg flex items-center gap-2 glow-accent z-10 w-max max-w-[140px] justify-center">
<span className="material-symbols-outlined text-electric-blue text-sm">download</span>
<span className="font-label-sm text-white font-bold text-[10px]">Fetch Insights</span>
</div>
<div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 glass-panel-heavy px-3 py-2 rounded-lg flex items-center gap-2 glow-accent z-10 w-max max-w-[140px] justify-center">
<span className="material-symbols-outlined text-yellow-500 text-sm">analytics</span>
<span className="font-label-sm text-white font-bold text-[10px]">Evaluate ROAS</span>
</div>
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 glass-panel-heavy px-3 py-2 rounded-lg flex items-center gap-2 glow-accent z-10 w-max max-w-[140px] justify-center">
<span className="material-symbols-outlined text-red-500 text-sm">pause_circle</span>
<span className="font-label-sm text-white font-bold text-[10px]">Pause Losers</span>
</div>
<div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel-heavy px-3 py-2 rounded-lg flex items-center gap-2 glow-accent z-10 w-max max-w-[140px] justify-center">
<span className="material-symbols-outlined text-green-500 text-sm">all_inclusive</span>
<span className="font-label-sm text-white font-bold text-[10px]">Mutate Winners</span>
</div>
<div className="absolute inset-0 flex items-center justify-center">
<div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-electric-blue/10 flex items-center justify-center border border-electric-blue/30 glow-accent">
<span className="material-symbols-outlined text-electric-blue text-2xl md:text-3xl">autorenew</span>
</div>
</div>
</div>
</div>
</section>
{/* Section 6: Technical Trust / Integrations Band */}
<section className="border-t border-b border-[#222222] bg-[#0A0A0A]" id="integrations">
<div className="max-w-7xl mx-auto px-md py-8">
<p className="font-label-sm text-center text-on-surface-variant mb-6 uppercase tracking-widest text-xs">Powered by industry-leading infrastructure</p>
<div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
{/* Simulated Logos using text for simplicity, in a real scenario these would be SVGs */}
<div className="font-headline-lg font-bold text-white flex items-center gap-1">
<span className="material-symbols-outlined">campaign</span> Meta Ads
            </div>
<div className="font-headline-lg font-bold text-white flex items-center gap-1">
<span className="material-symbols-outlined">payments</span> Stripe
            </div>
<div className="font-headline-lg font-bold text-white flex items-center gap-1">
<span className="material-symbols-outlined">database</span> Supabase
            </div>
<div className="font-headline-lg font-bold text-white flex items-center gap-1">
<span className="material-symbols-outlined">psychology</span> Anthropic
            </div>
<div className="font-headline-lg font-bold text-white flex items-center gap-1">
<span className="material-symbols-outlined">graphic_eq</span> ElevenLabs
            </div>
<div className="font-headline-lg font-bold text-white flex items-center gap-1">
<span className="material-symbols-outlined">account_tree</span> n8n
            </div>
</div>
</div>
</section>
</main>
{/* Footer Component */}
<footer className="bg-surface-container-lowest w-full pt-32 pb-lg border-t border-surface-container-highest relative overflow-hidden">
{/* Enhanced CTA Section */}
<div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none z-0"></div>
<div className="max-w-4xl mx-auto text-center px-md mb-32 relative z-10">
<h2 className="font-display-lg text-[40px] md:text-[56px] font-bold text-white mb-6 tracking-tight">Ready to fire your ad agency?</h2>
<p className="font-body-md text-on-surface-variant text-lg mb-10">Join 500+ D2C brands scaling their ROAS on autopilot.</p>
<a className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] px-8 py-4 rounded-lg font-label-sm font-bold hover:bg-gray-200 transition-colors glow-accent-hover group" href="#">
        Deploy your first campaign
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">rocket_launch</span>
</a>
</div>
<div className="flex flex-col md:flex-row justify-between items-center px-md max-w-7xl mx-auto relative z-10 pt-8 border-t border-[#222222]"><div className="grid grid-cols-2 md:grid-cols-4 gap-xl mb-16">
    <div className="col-span-2 md:col-span-1">
        <div className="font-headline-lg text-headline-lg font-bold text-on-background flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-electric-blue">bolt</span> Adverto
        </div>
        <p className="font-body-md text-on-surface-variant text-sm max-w-xs">
            Autonomous ad generation for modern D2C brands. Precision engineered advertising.
        </p>
    </div>
    <div>
        <h4 className="font-label-sm text-white font-bold mb-6 uppercase tracking-wider">Product</h4>
        <ul className="space-y-4 font-label-sm text-on-surface-variant">
            <li className=""><a href="#how-it-works" className="hover:text-electric-blue transition-colors">How it Works</a></li>
            <li className=""><a href="#integrations" className="hover:text-electric-blue transition-colors">Integrations</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Pricing</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Features</a></li>
        </ul>
    </div>
    <div>
        <h4 className="font-label-sm text-white font-bold mb-6 uppercase tracking-wider">Company</h4>
        <ul className="space-y-4 font-label-sm text-on-surface-variant">
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">About</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Careers</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Contact</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Blog</a></li>
        </ul>
    </div>
    <div>
        <h4 className="font-label-sm text-white font-bold mb-6 uppercase tracking-wider">Legal</h4>
        <ul className="space-y-4 font-label-sm text-on-surface-variant">
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Privacy Policy</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Terms of Service</a></li>
            <li className=""><a href="#" className="hover:text-electric-blue transition-colors">Security</a></li>
        </ul>
    </div>
</div>
<div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#222222] gap-md">
    <div className="font-body-md text-on-surface-variant text-sm">
        © 2024 Adverto AI. All rights reserved.
    </div>
    <div className="flex gap-6 items-center">
        <a href="#" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">brand_awareness</span>
        </a>
        <a href="#" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">groups</span>
        </a>
        <a href="#" className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined">terminal</span>
        </a>
    </div>
</div></div>
</footer>
    </div>
  );
}
