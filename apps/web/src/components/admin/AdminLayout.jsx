"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "dashboard" },
    { name: "Products", href: "/admin/products", icon: "inventory_2" },
    { name: "Artisans", href: "/admin/artisans", icon: "groups" },
    { name: "Inquiries & Deals", href: "/admin/inquiries", icon: "handshake" },
    { name: "Orders", href: "/admin/orders", icon: "local_shipping" },
    { name: "AI Review", href: "/admin/ai-review", icon: "robot_2" },
  ];

  return (
    <div className="bg-surface-muted/30 text-on-surface antialiased min-h-screen flex selection:bg-surface-container-high w-full font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-outline-variant h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant">
          <span className="font-bold tracking-tight text-[18px] text-primary">Craftigari Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${isActive ? 'bg-surface-container-high text-primary' : 'text-secondary hover:bg-surface-container hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[12px]">OP</div>
            <div className="text-[12px]">
              <div className="font-bold text-primary">Ops Team</div>
              <div className="text-secondary">admin@craftigari.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile/Tablet Header */}
        <header className="lg:hidden h-14 bg-surface border-b border-outline-variant flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 -ml-1 text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-bold tracking-tight text-[16px] text-primary">Admin</span>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-surface border-r border-outline-variant flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="h-14 flex items-center px-4 border-b border-outline-variant">
                <span className="font-bold tracking-tight text-[16px] text-primary">Craftigari Admin</span>
              </div>
              <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] font-medium ${pathname === item.href ? 'bg-surface-container-high text-primary' : 'text-secondary'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
    </div>
  );
}
