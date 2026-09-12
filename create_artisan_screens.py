import os

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# 1. Artisan Header Component
header_code = """import Link from "next/link";

export function ArtisanHeader({ activeTab = "home" }) {
  return (
    <header className="w-full sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant px-0 lg:px-12">
      <div className="w-full h-14 flex items-center justify-between px-4 lg:px-0">
        <div className="flex items-center space-x-3">
          <Link
            href="/artisan/dashboard"
            aria-label="वापस जाएं"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="font-headline text-[18px] lg:text-[20px] text-primary tracking-tight font-bold">Craftigari नमस्ते</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium h-full">
          <Link href="/artisan/dashboard" className={`h-full flex items-center ${activeTab === 'home' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Home</Link>
          <Link href="/artisan/orders" className={`h-full flex items-center ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Orders</Link>
          <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
            Add
          </Link>
          <Link href="/artisan/inquiries" className={`h-full flex items-center ${activeTab === 'inquiries' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Inquiries</Link>
          <Link href="/artisan/profile" className={`h-full flex items-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary transition-colors'}`}>Profile</Link>
        </nav>

        <div className="flex items-center space-x-2">
          {/* Language Switcher Pill */}
          <button className="h-8 px-2.5 rounded-full border border-outline bg-surface-container text-on-surface font-label text-[12px] hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1" type="button">
            <span>हिंदी</span>
            <span className="text-on-surface-variant font-normal">/ EN</span>
          </button>
          {/* Audio Guidance */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all" type="button">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">volume_up</span>
          </button>
        </div>
      </div>
    </header>
  );
}
"""

# 2. Bottom Nav overwrite
bottom_nav_code = """import Link from 'next/link';

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
"""

# 3. Profile
profile_code = """"use client";
import React, { useState } from "react";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="profile" />

      <main className="flex-1 w-full flex flex-col items-center pt-8 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-[850px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Summary */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-outline-variant shadow-sm relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQCPbpMnj2mia5ZlTvmjjbzVv2p-lLNXfs12jq2F8QQuHCjehzJYoFj4xCnO05ZnyZJyiax01Gm-chVhdxHUZVIyfOeGS_VDhlFyY7NUT3YjYAnpbSG8EDcp7xKkMYrCqy6yDztOLYLWoRnmXtOIjD8JrruGqhHoChkRNApjfJuKyrRT7DJPIQJtJzrWK3Xo2QcGjMsbZK-gkYXk5dzGvMvPD9LmSASCIEVpwFHCj098Som1JbNOg" alt="Profile" className="w-full h-full object-cover" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-white">edit</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">राम सिंह (Ram Singh)</h1>
              <p className="text-[14px] text-secondary mt-1 font-medium">Amer Terracotta Studio</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline rounded-full mt-3">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="text-[12px] font-medium text-secondary">Verified Artisan</span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-outline flex justify-between items-center bg-surface-container-lowest">
                <h2 className="text-[16px] font-bold text-primary">प्रोफ़ाइल विवरण (Profile Details)</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="text-[13px] font-bold text-accent-terracotta hover:text-terracotta-dark transition-colors"
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
              
              <div className="p-5 sm:p-6 space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">फ़ोन नंबर (Phone Number)</label>
                  {isEditing ? (
                    <input type="text" defaultValue="+91 98765 43210" className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="text-[15px] font-medium text-primary">+91 98765 43210</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">शिल्प श्रेणी (Craft Category)</label>
                  {isEditing ? (
                    <input type="text" defaultValue="Terracotta & Pottery" className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="text-[15px] font-medium text-primary">Terracotta & Pottery</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">क्षेत्र (Region)</label>
                  {isEditing ? (
                    <input type="text" defaultValue="Amer, Rajasthan" className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="text-[15px] font-medium text-primary">Amer, Rajasthan</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">परिचय (Description)</label>
                  {isEditing ? (
                    <textarea rows="3" defaultValue="मैं पिछले 22 वर्षों से टेराकोटा शिल्प बना रहा हूँ। हम पारंपरिक मिट्टी के बर्तन और वास्तुकला उत्पाद बनाते हैं।" className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none resize-none"></textarea>
                  ) : (
                    <p className="text-[15px] text-primary leading-relaxed">मैं पिछले 22 वर्षों से टेराकोटा शिल्प बना रहा हूँ। हम पारंपरिक मिट्टी के बर्तन और वास्तुकला उत्पाद बनाते हैं।</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">पसंदीदा भाषा (Preferred Language)</label>
                  {isEditing ? (
                    <select className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none">
                      <option>हिन्दी (Hindi)</option>
                      <option>English</option>
                    </select>
                  ) : (
                    <p className="text-[15px] font-medium text-primary">हिन्दी (Hindi)</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}
"""

# 4. All Inquiries
inquiries_code = """"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanInquiriesPage() {
  const [filter, setFilter] = useState("All");
  
  const filters = ["All", "New", "Needs Reply", "Quote Sent", "Accepted"];
  
  const inquiries = [
    { id: "inq-1", buyer: "Rohit Sharma", product: "पारंपरिक टेराकोटा कलश", date: "Today, 2:15 PM", qty: 80, status: "Needs Reply", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgUNMms8a7WGzFm4xI95SSkqiEs7g91mmr7zyPhxyuNkz_EUUs3YCzjY2BNN2KvmgqCoiwY5HAr9ifAURuqj4qIPBFnTKTj-r0_wkWFE7HXzF7maQKA_h_iHlKIAAPi7OgnkkgTHfkfZCVodvY6J6dnT8sA8JPBfh-OBki4bcbIuzaJDSq9JuRuEwOLqGv17VaH2h6z2TxEkoa5piI9mMGZJ2plKupfLhmpxJEtZirIwHGBH8_pdI" },
    { id: "inq-2", buyer: "Anita Desai", product: "Large Planter Set", date: "Yesterday", qty: 25, status: "Quote Sent", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=200&auto=format&fit=crop" },
    { id: "inq-3", buyer: "Design Studio", product: "Fluted Vase", date: "Oct 12", qty: 40, status: "Accepted", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" },
  ];

  const filtered = filter === "All" ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="inquiries" />

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">सभी पूछताछ (Inquiries)</h1>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 sm:pb-0">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline text-secondary hover:bg-surface-container-low'}`}
              >
                {f === "All" ? "सभी (All)" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-outline bg-surface-container-lowest text-[12px] font-bold text-secondary uppercase tracking-wider">
            <div className="col-span-5">Product & Buyer</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Status</div>
          </div>
          
          <div className="divide-y divide-outline">
            {filtered.map(inq => (
              <Link href={`/artisan/inquiries/demo`} key={inq.id} className="block hover:bg-surface-container-lowest transition-colors group">
                <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-3">
                  
                  {/* Mobile Top Row / Desktop Col 1 */}
                  <div className="lg:col-span-5 flex items-start gap-3">
                    <img src={inq.image} alt={inq.product} className="w-14 h-14 rounded-lg object-cover border border-outline-variant shrink-0" />
                    <div>
                      <h3 className="text-[14px] font-bold text-primary group-hover:text-terracotta transition-colors">{inq.product}</h3>
                      <p className="text-[12px] text-secondary mt-0.5">{inq.buyer}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Quantity:</span>
                    <span className="text-[14px] font-medium text-primary">{inq.qty} pcs</span>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Date:</span>
                    <span className="text-[13px] text-tertiary">{inq.date}</span>
                  </div>

                  <div className="lg:col-span-3 flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[12px] text-secondary">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border
                      ${inq.status === 'Needs Reply' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        inq.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-surface-container text-secondary border-outline'}`}>
                      {inq.status}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
            
            {filtered.length === 0 && (
              <div className="p-8 text-center text-secondary text-[14px]">No inquiries found.</div>
            )}
          </div>
        </div>
      </main>

      <BottomNav activeTab="inquiries" />
    </div>
  );
}
"""

# 5. My Orders
orders_code = """"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanOrdersPage() {
  const [filter, setFilter] = useState("All");
  
  const filters = ["All", "Active", "Delivered"];
  
  const orders = [
    { id: "559-X", buyer: "Studio Architecture", product: "Amer High-Fire Terracotta Water Urn", date: "Today", qty: 80, val: "₹60,000", status: "Confirmed", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" },
    { id: "212-B", buyer: "Nita Collections", product: "Glazed Plates", date: "Oct 10", qty: 150, val: "₹45,000", status: "In Transit", image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=200&auto=format&fit=crop" },
    { id: "109-A", buyer: "Heritage Homes", product: "Decorative Vase", date: "Sep 28", qty: 20, val: "₹18,000", status: "Delivered", image: "https://images.unsplash.com/photo-1611082596489-0824b232670a?q=80&w=200&auto=format&fit=crop" },
  ];

  const filtered = filter === "All" ? orders : 
                   filter === "Active" ? orders.filter(o => o.status !== "Delivered") : 
                   orders.filter(o => o.status === "Delivered");

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="orders" />

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">मेरे ऑर्डर (My Orders)</h1>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 sm:pb-0">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-outline text-secondary hover:bg-surface-container-low'}`}
              >
                {f === "All" ? "सभी (All)" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-outline bg-surface-container-lowest text-[12px] font-bold text-secondary uppercase tracking-wider">
            <div className="col-span-1">Order #</div>
            <div className="col-span-4">Product & Buyer</div>
            <div className="col-span-2">Value & Qty</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Status</div>
          </div>
          
          <div className="divide-y divide-outline">
            {filtered.map(order => (
              <Link href={`/artisan/orders/${order.id}`} key={order.id} className="block hover:bg-surface-container-lowest transition-colors group">
                <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center flex flex-col gap-3">
                  
                  <div className="lg:col-span-1 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Order #:</span>
                    <span className="text-[13px] font-mono font-bold text-primary">#{order.id}</span>
                  </div>

                  <div className="lg:col-span-4 flex items-start gap-3">
                    <img src={order.image} alt={order.product} className="w-12 h-12 rounded-lg object-cover border border-outline-variant shrink-0 hidden sm:block" />
                    <div>
                      <h3 className="text-[14px] font-bold text-primary group-hover:text-terracotta transition-colors line-clamp-1">{order.product}</h3>
                      <p className="text-[12px] text-secondary mt-0.5">{order.buyer}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Value/Qty:</span>
                    <div>
                      <span className="text-[14px] font-bold text-primary">{order.val}</span>
                      <span className="text-[12px] text-secondary block">{order.qty} pcs</span>
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex justify-between lg:block">
                    <span className="lg:hidden text-[12px] text-secondary">Date:</span>
                    <span className="text-[13px] text-tertiary">{order.date}</span>
                  </div>

                  <div className="lg:col-span-3 flex justify-between lg:block items-center">
                    <span className="lg:hidden text-[12px] text-secondary">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border
                      ${order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {order.status}
                    </span>
                  </div>

                </div>
              </Link>
            ))}
            
            {filtered.length === 0 && (
              <div className="p-8 text-center text-secondary text-[14px]">No orders found.</div>
            )}
          </div>
        </div>
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}
"""

# 6. Artisan Order Details
order_details_code = """"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";

export default function ArtisanOrderDetailsPage() {
  const params = useParams();
  const id = params?.id || "demo";
  
  const [status, setStatus] = useState("Confirmed");

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="orders" />

      <main className="flex-1 w-full max-w-[1050px] mx-auto pt-6 pb-12 px-4 sm:px-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">ऑर्डर विवरण (Order Details)</h1>
            <p className="text-[14px] text-secondary font-mono mt-1">ORD-{id.toUpperCase()}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-md inline-flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span className="text-[12px] font-bold">Simulated Fulfillment Demo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden p-6">
              <div className="flex items-start gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" alt="Product" className="w-20 h-20 rounded-lg object-cover border border-outline-variant shrink-0" />
                <div>
                  <h3 className="text-[16px] font-bold text-primary">Amer High-Fire Terracotta Water Urn</h3>
                  <p className="text-[13px] text-secondary mt-1">Red Finish (Custom Glaze)</p>
                  <p className="text-[13px] text-secondary">80 Pieces</p>
                </div>
              </div>

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between border-b border-outline border-dashed pb-2">
                  <span className="text-secondary">Total Value (Product)</span>
                  <span className="font-bold text-primary">₹60,000</span>
                </div>
                <div className="flex justify-between border-b border-outline border-dashed pb-2">
                  <span className="text-secondary">Production Timeline</span>
                  <span className="font-bold text-primary">15 Days (Due: Nov 12)</span>
                </div>
              </div>
            </div>

            {/* Fulfilment Timeline */}
            <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden p-6">
              <h3 className="text-[16px] font-bold text-primary mb-6">पूर्ति स्थिति (Fulfillment Status)</h3>
              
              <div className="relative border-l-2 border-outline ml-3 space-y-8 pb-4">
                
                {/* Step 1: Confirmed */}
                <div className="relative pl-6">
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center border-success">
                    <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                  </div>
                  <h4 className="text-[15px] font-bold text-primary">Order Confirmed</h4>
                  <p className="text-[12px] mt-0.5 text-secondary">Today, 10:45 AM</p>
                </div>

                {/* Step 2: Pack Product */}
                <div className="relative pl-6">
                  <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${status === 'Confirmed' ? 'border-primary' : 'border-success'}`}>
                    {status === 'Confirmed' && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>}
                    {status === 'Packed' && <div className="w-2.5 h-2.5 rounded-full bg-success"></div>}
                  </div>
                  <h4 className={`text-[15px] font-bold ${status === 'Confirmed' ? 'text-primary' : 'text-primary'}`}>Pack Product</h4>
                  {status === 'Confirmed' ? (
                    <div className="mt-3">
                      <p className="text-[13px] text-secondary mb-3">उत्पाद पैक होने पर नीचे क्लिक करें (Click below when packed)</p>
                      <button 
                        onClick={() => setStatus('Packed')}
                        className="bg-primary text-white py-2.5 px-5 rounded-lg text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-sm"
                      >
                        उत्पाद पैक हो गया (Mark Product Packed)
                      </button>
                    </div>
                  ) : (
                    <p className="text-[12px] mt-0.5 text-secondary">Just now</p>
                  )}
                </div>

                {/* Step 3: Pickup Scheduled */}
                <div className="relative pl-6">
                  <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${status === 'Packed' ? 'border-primary' : 'border-outline-variant'}`}>
                    {status === 'Packed' && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>}
                  </div>
                  <h4 className={`text-[15px] font-bold ${status === 'Packed' ? 'text-primary' : 'text-tertiary'}`}>Pickup Scheduled</h4>
                  {status === 'Packed' && (
                    <p className="text-[13px] mt-1 text-secondary">
                      पिकअप शेड्यूलिंग सिम्युलेटेड है (Pickup scheduling is simulated in the current prototype.)
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right: Deal Summary */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest border border-outline shadow-sm rounded-xl overflow-hidden p-6 sticky top-20">
              <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-outline pb-2">Buyer Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">Buyer Name</span>
                  <span className="text-[14px] font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">business</span>
                    Design Studio, Mumbai
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">Shipping Address</span>
                  <span className="text-[14px] text-primary block leading-snug">
                    14, Nariman Point, Ground Floor<br/>
                    Mumbai, Maharashtra 400021<br/>
                    India
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wide mb-1">Buyer Note</span>
                  <span className="text-[13px] text-secondary italic block border-l-2 border-outline pl-3">
                    "Looking forward to the red finish. Will be used for an indoor architectural installation."
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <BottomNav activeTab="orders" />
    </div>
  );
}
"""

ensure_dir("apps/web/src/components/artisan")
ensure_dir("apps/web/src/app/artisan/profile")
ensure_dir("apps/web/src/app/artisan/inquiries")
ensure_dir("apps/web/src/app/artisan/orders/[id]")

with open("apps/web/src/components/artisan/ArtisanHeader.jsx", "w", encoding="utf-8") as f:
    f.write(header_code)
with open("apps/web/src/components/BottomNav.jsx", "w", encoding="utf-8") as f:
    f.write(bottom_nav_code)
with open("apps/web/src/app/artisan/profile/page.jsx", "w", encoding="utf-8") as f:
    f.write(profile_code)
with open("apps/web/src/app/artisan/inquiries/page.jsx", "w", encoding="utf-8") as f:
    f.write(inquiries_code)
with open("apps/web/src/app/artisan/orders/page.jsx", "w", encoding="utf-8") as f:
    f.write(orders_code)
with open("apps/web/src/app/artisan/orders/[id]/page.jsx", "w", encoding="utf-8") as f:
    f.write(order_details_code)

print("Artisan screens created successfully.")
