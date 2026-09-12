import os

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# 1. Admin Layout Component
admin_layout_code = """"use client";
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
"""

# 2. Admin Dashboard
dashboard_code = """import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard Overview</h1>
        <p className="text-[14px] text-secondary mt-1">Operational snapshot for Craftigari HQ.</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Artisans", val: "142", icon: "groups" },
          { label: "Published Products", val: "856", icon: "inventory_2" },
          { label: "Open Inquiries", val: "24", icon: "handshake" },
          { label: "Active Orders", val: "18", icon: "local_shipping" },
          { label: "AI Reviews Pending", val: "7", icon: "robot_2", alert: true },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className={`material-symbols-outlined ${m.alert ? 'text-amber-600' : 'text-secondary'}`}>{m.icon}</span>
              {m.alert && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
            </div>
            <div className="text-[28px] font-bold text-primary tracking-tight">{m.val}</div>
            <div className="text-[12px] font-medium text-secondary">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Recent Inquiries */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h2 className="text-[15px] font-bold text-primary">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-[12px] font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-outline-variant overflow-x-auto">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead className="bg-surface-muted text-secondary text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">Inquiry ID</th>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "INQ-99", p: "Terracotta Urn", s: "Quote Sent" },
                  { id: "INQ-98", p: "Large Planter", s: "New Inquiry" },
                  { id: "INQ-97", p: "Glazed Vase", s: "Accepted" },
                ].map(r => (
                  <tr key={r.id} className="hover:bg-surface-container-lowest">
                    <td className="px-4 py-3 font-mono font-medium text-primary">{r.id}</td>
                    <td className="px-4 py-3 text-secondary">{r.p}</td>
                    <td className="px-4 py-3"><span className="text-[11px] font-bold px-2 py-0.5 border border-outline rounded-md bg-surface">{r.s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant bg-amber-50/50">
            <h2 className="text-[15px] font-bold text-amber-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Needs Attention
            </h2>
          </div>
          <div className="divide-y divide-outline-variant">
            {[
              { t: "AI extraction needs review", sub: "Product: Blue Pottery Plate", link: "/admin/ai-review" },
              { t: "Product missing required info", sub: "Artisan: Ram Singh", link: "/admin/products" },
              { t: "Buyer change request pending", sub: "Deal: INQ-95", link: "/admin/inquiries" }
            ].map((a, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-container-lowest">
                <div>
                  <div className="text-[13px] font-bold text-primary">{a.t}</div>
                  <div className="text-[12px] text-secondary">{a.sub}</div>
                </div>
                <Link href={a.link} className="text-[12px] font-bold text-primary border border-outline-variant px-3 py-1.5 rounded-md hover:bg-surface-container">Resolve</Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
"""

# 3. Admin Products
products_code = """"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminProductsPage() {
  const [filter, setFilter] = useState("All");

  const products = [
    { id: "P-104", name: "Amer Terracotta Urn", artisan: "Ram Singh", craft: "Pottery", region: "Rajasthan", price: "₹750/pc", status: "Published", ai: "Completed" },
    { id: "P-105", name: "Glazed Blue Plate", artisan: "Shanti Devi", craft: "Blue Pottery", region: "Rajasthan", price: "₹400/pc", status: "Needs Review", ai: "Needs Review" },
    { id: "P-106", name: "Bamboo Weave Basket", artisan: "Arjun Kumar", craft: "Bamboo Weaving", region: "Assam", price: "-", status: "Missing Info", ai: "Completed" },
    { id: "P-107", name: "Block Print Saree", artisan: "Nita Textiles", craft: "Block Print", region: "Gujarat", price: "₹2,500", status: "Published", ai: "Completed" },
  ];

  const filtered = filter === "All" ? products : products.filter(p => p.status === filter);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Products</h1>
          <p className="text-[14px] text-secondary">Manage marketplace catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-secondary">search</span>
            <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 border border-outline-variant rounded-lg text-[13px] focus:outline-none focus:border-primary w-full sm:w-64" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
        {["All", "Published", "Needs Review", "Missing Info"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant text-secondary hover:bg-surface-container'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[800px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Product</th>
              <th className="px-5 py-3 font-bold">Artisan & Region</th>
              <th className="px-5 py-3 font-bold">Category</th>
              <th className="px-5 py-3 font-bold">Price</th>
              <th className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-surface-container-lowest">
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{p.name}</div>
                  <div className="text-[11px] font-mono text-tertiary">{p.id}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary">{p.artisan}</div>
                  <div className="text-secondary text-[12px]">{p.region}</div>
                </td>
                <td className="px-5 py-4 text-secondary">{p.craft}</td>
                <td className="px-5 py-4 font-medium text-primary">{p.price}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    p.status === 'Published' ? 'bg-green-50 text-green-700 border-green-200' : 
                    p.status === 'Needs Review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    'bg-red-50 text-red-700 border-red-200'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
"""

# 4. Admin Artisans
artisans_code = """"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminArtisansPage() {
  const artisans = [
    { name: "Ram Singh", phone: "+91 98765 43210", craft: "Terracotta", region: "Amer, RJ", products: 12, joined: "Oct 2025", status: "Active" },
    { name: "Shanti Devi", phone: "+91 87654 32109", craft: "Blue Pottery", region: "Jaipur, RJ", products: 5, joined: "Nov 2025", status: "Active" },
    { name: "Arjun Kumar", phone: "+91 76543 21098", craft: "Bamboo Weaving", region: "Jorhat, AS", products: 2, joined: "Dec 2025", status: "Inactive" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Artisans</h1>
          <p className="text-[14px] text-secondary">Roster of onboarded creators.</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-secondary">search</span>
          <input type="text" placeholder="Search name or phone..." className="pl-9 pr-4 py-2 border border-outline-variant rounded-lg text-[13px] focus:outline-none focus:border-primary w-full sm:w-64" />
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[700px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Artisan</th>
              <th className="px-5 py-3 font-bold">Craft & Region</th>
              <th className="px-5 py-3 font-bold">Products</th>
              <th className="px-5 py-3 font-bold">Joined</th>
              <th className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {artisans.map((a, i) => (
              <tr key={i} className="hover:bg-surface-container-lowest">
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{a.name}</div>
                  <div className="text-[12px] font-mono text-secondary">{a.phone}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary">{a.craft}</div>
                  <div className="text-secondary text-[12px]">{a.region}</div>
                </td>
                <td className="px-5 py-4 text-primary font-medium">{a.products}</td>
                <td className="px-5 py-4 text-secondary">{a.joined}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    a.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-surface-container text-secondary border-outline'}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
"""

# 5. Admin Inquiries
inquiries_code = """"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminInquiriesPage() {
  const [filter, setFilter] = useState("All");
  
  const inquiries = [
    { id: "INQ-99", product: "Terracotta Urn", artisan: "Ram Singh", buyer: "Design Studio", qty: 80, stage: "Quote Sent", quote: "₹64,200", updated: "2h ago" },
    { id: "INQ-98", product: "Large Planter", artisan: "Shanti Devi", buyer: "Nita Collections", qty: 25, stage: "New Inquiry", quote: "-", updated: "1d ago" },
    { id: "INQ-97", product: "Glazed Vase", artisan: "Ram Singh", buyer: "Heritage Homes", qty: 40, stage: "Quote Accepted", quote: "₹24,000", updated: "2d ago" },
    { id: "INQ-96", product: "Bamboo Basket", artisan: "Arjun Kumar", buyer: "Eco Store", qty: 100, stage: "Change Requested", quote: "₹15,000", updated: "3d ago" },
  ];

  const filtered = filter === "All" ? inquiries : inquiries.filter(i => i.stage === filter);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Inquiries & Deals</h1>
          <p className="text-[14px] text-secondary">Monitor buyer-artisan deal progression.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
        {["All", "New Inquiry", "Quote Sent", "Change Requested", "Quote Accepted"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant text-secondary hover:bg-surface-container'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[900px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Inquiry ID</th>
              <th className="px-5 py-3 font-bold">Deal Context</th>
              <th className="px-5 py-3 font-bold">Quote / Qty</th>
              <th className="px-5 py-3 font-bold">Current Stage</th>
              <th className="px-5 py-3 font-bold">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.map(i => (
              <tr key={i.id} className="hover:bg-surface-container-lowest cursor-pointer">
                <td className="px-5 py-4 font-mono font-bold text-primary">{i.id}</td>
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{i.product}</div>
                  <div className="text-secondary text-[12px]">{i.buyer} ↔ {i.artisan}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary font-bold">{i.quote}</div>
                  <div className="text-secondary text-[12px]">{i.qty} units</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    i.stage === 'Quote Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                    i.stage === 'Change Requested' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    i.stage === 'New Inquiry' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-surface-container text-secondary border-outline'}`}>
                    {i.stage}
                  </span>
                </td>
                <td className="px-5 py-4 text-secondary">{i.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
"""

# 6. Admin Orders
orders_code = """"use client";
import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminOrdersPage() {
  const orders = [
    { id: "ORD-559-X", product: "Terracotta Urn", artisan: "Ram Singh", buyer: "Design Studio", qty: 80, val: "₹64,200", pmt: "Test Confirmed", status: "Preparing", date: "Today" },
    { id: "ORD-212-B", product: "Glazed Plates", artisan: "Shanti Devi", buyer: "Nita Collections", qty: 150, val: "₹45,000", pmt: "Test Confirmed", status: "In Transit", date: "Oct 10" },
    { id: "ORD-109-A", product: "Deco Vase", artisan: "Ram Singh", buyer: "Heritage Homes", qty: 20, val: "₹18,000", pmt: "Test Confirmed", status: "Delivered", date: "Sep 28" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Orders</h1>
          <p className="text-[14px] text-secondary">Confirmed orders and simulated fulfilment.</p>
        </div>
        <div className="bg-surface border border-outline px-3 py-1.5 rounded text-[11px] text-secondary font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Tracking is simulated for prototype
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[950px]">
          <thead className="bg-surface-container-lowest text-secondary text-[12px] uppercase border-b border-outline-variant">
            <tr>
              <th className="px-5 py-3 font-bold">Order #</th>
              <th className="px-5 py-3 font-bold">Context</th>
              <th className="px-5 py-3 font-bold">Value & Qty</th>
              <th className="px-5 py-3 font-bold">Payment</th>
              <th className="px-5 py-3 font-bold">Fulfillment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-surface-container-lowest">
                <td className="px-5 py-4">
                  <div className="font-mono font-bold text-primary">{o.id}</div>
                  <div className="text-[12px] text-tertiary">{o.date}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-bold text-primary">{o.product}</div>
                  <div className="text-secondary text-[12px]">{o.buyer} ↔ {o.artisan}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-primary font-bold">{o.val}</div>
                  <div className="text-secondary text-[12px]">{o.qty} units</div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[11px] text-success font-medium bg-success/10 px-2 py-0.5 rounded border border-success/20">{o.pmt}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                    o.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
"""

# 7. Admin AI Review
ai_review_code = """"use client";
import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminAiReviewPage() {
  
  const [items, setItems] = useState([
    { id: "AI-102", product: "Glazed Blue Plate", artisan: "Shanti Devi", type: "Voice Extraction", status: "Needs Review", conf: "Medium", 
      details: [
        { key: "Material", val: "Ceramic", src: "Voice", conf: "High" },
        { key: "Color", val: "Blue", src: "Voice", conf: "High" },
        { key: "Size", val: "Missing", src: "-", action: "Ask Artisan" }
      ]
    },
    { id: "AI-101", product: "Terracotta Urn", artisan: "Ram Singh", type: "Image Processing", status: "Completed", conf: "High", 
      details: [
        { key: "Material", val: "Terracotta", src: "Image", conf: "High" },
        { key: "Category", val: "Vase/Urn", src: "Image", conf: "High" }
      ]
    }
  ]);

  const markApproved = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, status: "Completed", conf: "High" } : i));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">AI Review & Processing</h1>
          <p className="text-[14px] text-secondary">Resolve uncertainties from automated extraction pipelines.</p>
        </div>
      </div>

      <div className="space-y-6">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className={`p-4 border-b flex justify-between items-center ${item.status === 'Needs Review' ? 'bg-amber-50/30 border-amber-200' : 'bg-surface-container-lowest border-outline-variant'}`}>
              <div className="flex items-center gap-4">
                <div className="font-mono text-[12px] font-bold text-secondary bg-surface px-2 py-1 rounded border border-outline">{item.id}</div>
                <div>
                  <h3 className="text-[15px] font-bold text-primary">{item.product} <span className="text-[13px] font-normal text-secondary ml-1">by {item.artisan}</span></h3>
                  <p className="text-[12px] text-secondary">{item.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold uppercase border ${
                  item.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 lg:flex gap-8">
              <div className="flex-1">
                <h4 className="text-[12px] font-bold text-secondary uppercase tracking-wider mb-4 border-b border-outline-variant pb-2">Extraction Payload</h4>
                <div className="space-y-3">
                  {item.details.map((d, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-outline-variant border-dashed pb-2">
                      <div>
                        <span className="text-[13px] text-secondary">{d.key}:</span>
                        <span className={`ml-2 text-[14px] font-bold ${d.val === 'Missing' ? 'text-amber-600' : 'text-primary'}`}>{d.val}</span>
                      </div>
                      <div className="text-[11px] flex gap-2">
                        {d.src !== "-" && <span className="bg-surface px-1.5 py-0.5 rounded text-tertiary border border-outline">Source: {d.src}</span>}
                        {d.conf && <span className="bg-surface px-1.5 py-0.5 rounded text-tertiary border border-outline">Conf: {d.conf}</span>}
                        {d.action && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">{d.action}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {item.status === 'Needs Review' && (
                <div className="mt-6 lg:mt-0 lg:w-64 shrink-0 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-outline-variant pt-6 lg:pt-0 lg:pl-8">
                  <button onClick={() => markApproved(item.id)} className="w-full bg-primary text-white py-2 px-4 rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors">
                    Approve Extraction
                  </button>
                  <button className="w-full bg-white border border-outline-variant text-primary py-2 px-4 rounded-lg text-[13px] font-bold hover:bg-surface-container transition-colors">
                    Ask Artisan
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
"""

ensure_dir("apps/web/src/components/admin")
ensure_dir("apps/web/src/app/admin")
ensure_dir("apps/web/src/app/admin/products")
ensure_dir("apps/web/src/app/admin/artisans")
ensure_dir("apps/web/src/app/admin/inquiries")
ensure_dir("apps/web/src/app/admin/orders")
ensure_dir("apps/web/src/app/admin/ai-review")

with open("apps/web/src/components/admin/AdminLayout.jsx", "w", encoding="utf-8") as f:
    f.write(admin_layout_code)
with open("apps/web/src/app/admin/page.jsx", "w", encoding="utf-8") as f:
    f.write(dashboard_code)
with open("apps/web/src/app/admin/products/page.jsx", "w", encoding="utf-8") as f:
    f.write(products_code)
with open("apps/web/src/app/admin/artisans/page.jsx", "w", encoding="utf-8") as f:
    f.write(artisans_code)
with open("apps/web/src/app/admin/inquiries/page.jsx", "w", encoding="utf-8") as f:
    f.write(inquiries_code)
with open("apps/web/src/app/admin/orders/page.jsx", "w", encoding="utf-8") as f:
    f.write(orders_code)
with open("apps/web/src/app/admin/ai-review/page.jsx", "w", encoding="utf-8") as f:
    f.write(ai_review_code)

print("Admin screens created successfully.")
