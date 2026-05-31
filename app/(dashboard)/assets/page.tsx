export default function AssetsPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-lg py-lg h-full">
      <header className="mb-lg">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-1">Assets</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Asset library</p>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl w-full mx-auto py-xl px-4">
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group w-full min-w-full sm:min-w-[500px]">
          {/* Subtle glow effect inside the glass */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] relative z-10">
            <span className="material-symbols-outlined text-[48px] text-white/80">inventory_2</span>
          </div>
          <h2 className="font-headline-lg text-3xl text-white mb-4 font-bold tracking-tight relative z-10 whitespace-nowrap">No assets yet</h2>
          <p className="font-body-md text-white/60 mb-10 max-w-[320px] leading-relaxed relative z-10 text-lg">Upload images and videos to use in your campaigns.</p>
          
          <button className="text-white font-label-sm text-base flex items-center gap-3 transition-all duration-300 border border-white/20 bg-white/5 px-10 py-4 rounded-full hover:bg-white/15 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] relative z-10 whitespace-nowrap">
            <span className="material-symbols-outlined text-[20px]">upload</span>
            Upload Asset
          </button>
        </div>
      </section>
    </div>
  );
}
