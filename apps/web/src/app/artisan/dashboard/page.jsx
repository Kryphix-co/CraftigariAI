import Image from "next/image";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";

export default function ArtisanDashboardPage() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-full flex flex-col justify-between selection:bg-surface-container-high pb-20 lg:pb-0">
      {/* Top App Bar Navigation Anchor */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant">
        <div className="max-w-[1150px] mx-auto px-space-16 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              aria-label="वापस जाएं"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <span className="font-headline text-[20px] text-primary tracking-tight font-bold">Craftigari नमस्ते</span>
          </div>

          {/* Desktop Navigation (Hidden on mobile/tablet) */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link href="/artisan/dashboard" className="text-primary border-b-2 border-primary py-4">Home</Link>
            <Link href="#crafts" className="text-secondary hover:text-primary transition-colors">Crafts</Link>
            <Link href="/artisan/products/new" className="flex items-center gap-1.5 text-accent-terracotta bg-accent-terracotta-soft px-3 py-1.5 rounded-full hover:bg-tertiary-fixed transition-colors">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              Add
            </Link>
            <Link href="#market" className="text-secondary hover:text-primary transition-colors">Market</Link>
            <Link href="#profile" className="text-secondary hover:text-primary transition-colors">Profile</Link>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Language Switcher Pill */}
            <button
              className="h-8 px-2.5 rounded-full border border-outline bg-surface-container text-on-surface font-label text-[12px] hover:bg-surface-container-high active:scale-95 transition-all flex items-center gap-1"
              type="button"
            >
              <span>हिंदी</span>
              <span className="text-on-surface-variant font-normal">/ EN</span>
            </button>
            {/* Audio Guidance Speaker Button */}
            <button
              aria-label="ऑडियो सहायता सुनें"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant bg-surface hover:bg-surface-container text-on-surface active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">volume_up</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Container */}
      <main className="flex-1 max-w-[1150px] w-full mx-auto px-space-16 pt-8 pb-28 lg:pb-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[calc(100vh-56px)] lg:content-center">
        
        {/* Left Column (Desktop) / Main Column (Mobile) */}
        <div className="lg:col-span-5">
          {/* Header / Artisan Identity Section */}
          <section className="py-space-12 flex items-center justify-between lg:py-0 lg:mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border border-outline-variant"
                  alt="Ram Singh Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQCPbpMnj2mia5ZlTvmjjbzVv2p-lLNXfs12jq2F8QQuHCjehzJYoFj4xCnO05ZnyZJyiax01Gm-chVhdxHUZVIyfOeGS_VDhlFyY7NUT3YjYAnpbSG8EDcp7xKkMYrCqy6yDztOLYLWoRnmXtOIjD8JrruGqhHoChkRNApjfJuKyrRT7DJPIQJtJzrWK3Xo2QcGjMsbZK-gkYXk5dzGvMvPD9LmSASCIEVpwFHCj098Som1JbNOg"
                />
                <span className="absolute bottom-0 right-0 lg:bottom-1 lg:right-1 w-3 h-3 bg-success rounded-full ring-2 ring-surface"></span>
              </div>
              <div>
                <h1 className="text-[20px] lg:text-[24px] leading-7 font-bold text-[#202124] tracking-tight">नमस्ते, राम सिंह</h1>
                <div className="flex items-center gap-1 text-[13px] text-[#5F6368] font-body mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-on-surface-variant">location_on</span>
                  <span>जयपुर, राजस्थान</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex lg:hidden items-center px-3 py-1 bg-surface-container rounded-full text-[12px] font-medium text-on-surface-variant">
              <span>कारीगर आईडी: #JP-402</span>
            </div>
          </section>

          {/* Dominant Primary Action (Add Product via Voice or Photo) */}
          <section className="mt-space-20 mb-space-32 lg:mt-0 lg:mb-8">
            <Link href="/artisan/products/new" className="w-full h-[52px] rounded-[10px] bg-primary-container text-on-primary flex items-center justify-center gap-2.5 px-space-16 text-[16px] font-medium shadow-sm hover:bg-[#303030] active:scale-[0.99] transition-all">
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
              <span className="text-secondary-fixed-dim font-light text-base">+</span>
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              <span className="ml-1 tracking-wide">नया उत्पाद जोड़ें</span>
            </Link>
            {/* Subtle Helper Copy */}
            <p className="text-center text-[13px] text-[#5F6368] mt-2.5 font-body flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">auto_awesome</span>
              <span>फ़ोटो खींचें या बोलकर बताएं • कोई टाइपिंग नहीं</span>
            </p>
          </section>
          
          {/* Quiet Help Assistance Notice */}
          <div className="hidden lg:flex p-3.5 rounded-xl border border-outline-variant bg-[#F8F9FA] items-center justify-center gap-2 text-center text-[13px] text-[#5F6368]">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">support_agent</span>
            <span>सहायता चाहिए? ऊपर स्पीकर बटन दबाएं या सहायता केंद्र चुनें</span>
          </div>
        </div>

        {/* Right Column (Desktop) / Second Block (Mobile) */}
        <div className="lg:col-span-7">
          {/* Section Header: Recent Crafts */}
          <div className="flex items-center justify-between mb-space-12">
            <h2 className="text-[18px] leading-6 font-semibold text-[#202124] tracking-tight">हाल के उत्पाद</h2>
            <a className="text-[14px] font-medium text-[#5F6368] hover:text-primary transition-colors flex items-center gap-0.5" href="#all-crafts">
              <span>सभी देखें</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          {/* Recent Products List: Quiet Uncluttered Rows */}
          <section className="space-y-3 lg:space-y-4">
            {/* Item 1: Terracotta Floral Vase */}
            <div className="bg-surface rounded-[12px] border border-outline-variant p-3.5 lg:p-4 flex items-center justify-between gap-3 hover:border-outline transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-[8px] object-cover bg-surface-container flex-shrink-0 border border-outline-variant"
                  alt="Terracotta Vase"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsL1wHBAT6njHV6-KAbs6A4YnwgIq5CS5GgUiBjwlJmSWuxHyu6FaqRtjCgQ0xqqAVn9h7jIKmPxphJAoWgraVLPO_aRjsT33HaRVpODjFPP819h1ZJ19YMAsydEZIJeO-pAon75E-ia__RZHOgSAnneZYJPl5wW5bH8wYksRVRR5AXJ2WEBeTKzCEJ3WealYLQs4XlFGzKiNqIPZ3zoozRQQvFxm-pH1OdT-GkysF1gdajC_c8Ew"
                />
                <div className="min-w-0">
                  <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#202124] truncate mb-1">टेराकोटा नक्काशी फूलदान</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent-terracotta-soft text-accent-terracotta border border-tertiary-fixed">तैयार</span>
                    <span className="text-[15px] lg:text-[16px] font-bold text-[#202124]">₹1,450</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 pl-2">
                <button
                  className="h-9 lg:h-10 px-3 lg:px-4 rounded-lg border border-outline text-[#1F1F1F] bg-surface text-[13px] lg:text-[14px] font-medium hover:bg-surface-container active:scale-95 transition-all flex items-center gap-1"
                  type="button"
                >
                  <span>जारी रखें</span>
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Item 2: Indigo Block Print Shawl */}
            <div className="bg-surface rounded-[12px] border border-outline-variant p-3.5 lg:p-4 flex items-center justify-between gap-3 hover:border-outline transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-[8px] object-cover bg-surface-container flex-shrink-0 border border-outline-variant"
                  alt="Indigo Block Print Shawl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9wKsZszSZRUUdMs3D3PIfHqwoeXEdtz_kZ-3NWBiCOzEBr2glb6AtweDRwF24Wci_YJfdD51iJ7fd7TYOvK4Vk2WlvIKWY48UyHbhuAp4BnXxKB5OhICPsWohL4dG1i1ch_n7b0E-QqevT3rdeRjtb-SrQU10Sh3h9M3OiQq76SiGXuFR3Oyo-ew65yiE9o5Ysh7pR7xOHSIRb9XzqipCe50dZ7kpHjoaeuv-4f9W7QYIBeV9gnU"
                />
                <div className="min-w-0">
                  <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#202124] truncate mb-1">इंडिगो ब्लॉक प्रिंट शॉल</h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-success border border-outline">
                      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
                      सक्रिय (Live)
                    </span>
                    <span className="text-[15px] lg:text-[16px] font-bold text-[#202124]">₹2,800</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 pl-2">
                <button
                  className="h-9 lg:h-10 px-3 lg:px-4 rounded-lg border border-outline-variant text-[#5F6368] bg-transparent text-[13px] lg:text-[14px] font-medium hover:bg-surface-container hover:text-on-surface active:scale-95 transition-all flex items-center gap-1"
                  type="button"
                >
                  <span>देखें</span>
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Item 3: Clay Water Jug (Matka) */}
            <div className="bg-surface rounded-[12px] border border-outline-variant p-3.5 lg:p-4 flex items-center justify-between gap-3 hover:border-outline transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-[8px] object-cover bg-surface-container flex-shrink-0 border border-outline-variant"
                  alt="Clay Water Jug"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1rSrGSte_k5LztvRQNUQjGb1sKEEuR22TKY9A4AvCOPN9Et9KDrv4T3cLHTo-UINlkBxsjySlpzCYwk9qJByXuon2eUaa8nhaD18-V4IDBcPQTvETGb2UfSvBqrwttevBf_OhzBCGb0jxZQQmkY5_FuFEvf7wOMmndIihisbWHzUCkw7vODiaaIWogIgWA2LDuF2bKSfWwEDf9nOfg9rKdkqUNyoVDB59cobgiAAeLgwYzDqktrU"
                />
                <div className="min-w-0">
                  <h3 className="text-[15px] lg:text-[16px] font-semibold text-[#202124] truncate mb-1">मिट्टी का पानी का मटका</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-[#5F6368] border border-outline">अधूरा ड्राफ़्ट</span>
                    <span className="text-[13px] text-[#5F6368]">मूल्य शेष</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 pl-2">
                <button
                  className="h-9 lg:h-10 px-3.5 lg:px-4 rounded-lg bg-primary-container text-on-primary text-[13px] lg:text-[14px] font-medium hover:bg-[#303030] active:scale-95 transition-all flex items-center gap-1"
                  type="button"
                >
                  <span>पूरा करें</span>
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Quiet Help Assistance Notice (Mobile) */}
        <div className="lg:hidden mt-space-32 p-3.5 rounded-xl border border-outline-variant bg-[#F8F9FA] flex items-center justify-center gap-2 text-center text-[13px] text-[#5F6368]">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">support_agent</span>
          <span>सहायता चाहिए? ऊपर स्पीकर बटन दबाएं या सहायता केंद्र चुनें</span>
        </div>
      </main>
      
      <BottomNav activeTab="home" />
    </div>
  );
}
