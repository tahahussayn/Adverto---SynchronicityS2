export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 px-sm md:px-lg py-lg h-full">
      <header className="mb-lg">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-1">Analytics</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Performance metrics</p>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full mx-auto py-xl">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-md border border-outline-variant">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">insights</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">No data yet</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">Launch a campaign to start seeing performance insights.</p>
      </section>
    </div>
  );
}
