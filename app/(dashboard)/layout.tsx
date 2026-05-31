import ThemeToggle from "@/components/ThemeToggle";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest text-on-surface font-body-md antialiased min-h-screen flex tech-grid w-full">
      {/* TopNavBar (Mobile) */}
      <div className="md:hidden bg-background/80 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center w-full px-md h-16 fixed top-0 z-50">
        <div className="flex items-center gap-2 font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
          <img src="/logo.png" alt="Adverto" className="w-6 h-6 object-contain" />
          Adverto
        </div>
        <div className="flex items-center gap-sm">
          <ThemeToggle />
          <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95 flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant flex items-center justify-center text-xs font-bold text-on-surface">
            U
          </div>
        </div>
      </div>

      {/* SideNavBar (Web) */}
      <DashboardSidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
