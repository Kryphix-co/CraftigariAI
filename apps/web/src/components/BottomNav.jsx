import Link from 'next/link';

export function BottomNav({ activeTab = 'home' }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden flex justify-around items-center px-2 py-1 min-h-[56px] pb-safe bg-surface-container border-t border-outline-variant shadow-md">
      <div className="max-w-[640px] w-full mx-auto flex items-center justify-around">
        <Link href="/artisan/dashboard" className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'home' ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'}`}>
          <span className="material-symbols-outlined text-[24px]" style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className="text-[11px] leading-[14px] mt-0.5">Home</span>
        </Link>
        <Link href="/artisan/orders" className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'orders' ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'}`}>
          <span className="material-symbols-outlined text-[24px]" style={activeTab === 'orders' ? { fontVariationSettings: "'FILL' 1" } : {}}>local_shipping</span>
          <span className="text-[11px] leading-[14px] mt-0.5">Orders</span>
        </Link>
        <Link href="/artisan/products/new" className="flex flex-col items-center justify-center text-secondary py-1 group active:scale-95 transition-transform duration-150">
          <div className="w-10 h-10 -mt-3 bg-accent-terracotta text-on-tertiary rounded-full flex items-center justify-center shadow-sm group-hover:bg-on-tertiary-fixed-variant transition-colors">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </div>
          <span className="text-[11px] leading-[14px] mt-0.5 text-on-surface">Add</span>
        </Link>
        <Link href="/artisan/inquiries" className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'inquiries' ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'}`}>
          <span className="material-symbols-outlined text-[24px]" style={activeTab === 'inquiries' ? { fontVariationSettings: "'FILL' 1" } : {}}>forum</span>
          <span className="text-[11px] leading-[14px] mt-0.5">Inquiries</span>
        </Link>
        <Link href="/artisan/profile" className={`flex flex-col items-center justify-center py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'profile' ? 'text-primary font-semibold' : 'text-secondary hover:text-primary'}`}>
          <span className="material-symbols-outlined text-[24px]" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
          <span className="text-[11px] leading-[14px] mt-0.5">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
