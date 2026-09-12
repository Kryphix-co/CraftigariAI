import os

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

# 1. Buyer Quotation Page
buyer_quote_page = """import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function BuyerQuotationPage({ params }) {
  const id = params?.id || "demo";
  
  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[1000px] bg-white border border-border shadow-sm p-5 sm:p-8 lg:p-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-terracotta block mb-2">Deal Offer</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Quotation Confirmation</h1>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[11px] font-mono text-tertiary uppercase mb-1">Reference No.</div>
              <div className="text-[14px] font-bold text-primary font-mono">QTN-8204-{id.toUpperCase()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left: Context */}
            <div className="md:col-span-5 flex flex-col gap-5">
              <div className="aspect-[4/3] bg-surface-muted border border-border overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" 
                  alt="Product Image" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h2>
                <div className="flex items-center gap-2 text-[12px] text-secondary mt-2">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span className="font-medium text-primary">Master Ram Singh</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-secondary mt-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>Amer, Rajasthan Cluster</span>
                </div>
              </div>
            </div>

            {/* Right: Terms & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Proposed Terms</h3>
                <div className="space-y-3 text-[13px] sm:text-[14px]">
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Quantity</span>
                    <span className="font-bold text-primary">80 Pieces</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Unit Price</span>
                    <span className="font-bold text-primary">₹750</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Production Timeline</span>
                    <span className="font-bold text-primary">15 Days</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Customization</span>
                    <span className="font-bold text-primary">Red Finish (Custom Glaze)</span>
                  </div>
                </div>

                <div className="mt-6 bg-surface-muted p-4 border border-border flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-secondary">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">₹60,000</span>
                </div>
                
                <div className="mt-4 p-4 border-l-2 border-terracotta bg-terracotta/5">
                  <p className="text-[12px] text-primary italic leading-relaxed">
                    "I have accounted for the custom red glaze in this price. The kiln is ready for your batch." <span className="font-semibold">— Ram Singh</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/quote/${id}/payment`} className="flex-1 bg-primary text-white text-center py-3.5 px-6 text-[14px] font-bold rounded-none hover:bg-neutral-800 transition-colors">
                    Accept Quote
                  </Link>
                  <Link href={`/quote/${id}/change`} className="flex-1 bg-white border border-border text-primary text-center py-3.5 px-6 text-[14px] font-bold rounded-none hover:border-primary transition-colors">
                    Request a Change
                  </Link>
                </div>
                <div className="text-center pt-2">
                  <button className="text-[12px] font-medium text-tertiary hover:text-secondary underline underline-offset-2">Decline Offer</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
"""

# 2. Request a Change / Negotiation
buyer_change_page = """import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function BuyerChangeRequestPage({ params }) {
  const id = params?.id || "demo";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="w-full max-w-[750px] bg-white border border-border shadow-sm">
          
          <div className="p-6 sm:p-8 border-b border-border bg-surface-muted/30">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary mb-2">Request a Change</h1>
            <p className="text-[13px] text-secondary">Propose new terms to the artisan. They will review and respond.</p>
            
            <div className="mt-5 p-4 border border-border bg-white flex flex-wrap gap-4 justify-between items-center text-[12px]">
              <div>
                <span className="text-tertiary block mb-0.5">Current Unit Price</span>
                <span className="font-bold text-primary text-[14px]">₹750 / piece</span>
              </div>
              <div>
                <span className="text-tertiary block mb-0.5">Current Quantity</span>
                <span className="font-bold text-primary text-[14px]">80 pieces</span>
              </div>
            </div>
          </div>

          <form className="p-6 sm:p-8 space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-primary mb-2">Proposed Unit Price (₹)</label>
                <input type="text" defaultValue="620" className="w-full bg-white border border-border px-4 py-2.5 text-[14px] focus:border-primary focus:ring-0 outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-primary mb-2">Proposed Quantity</label>
                <input type="text" defaultValue="80" className="w-full bg-white border border-border px-4 py-2.5 text-[14px] focus:border-primary focus:ring-0 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-primary mb-2">Production Timeline</label>
              <select className="w-full bg-white border border-border px-4 py-2.5 text-[14px] focus:border-primary focus:ring-0 outline-none">
                <option>15 Days (No change)</option>
                <option>10 Days (Rush)</option>
                <option>20 Days (Relaxed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-2">Message to Artisan</label>
              <textarea rows="4" className="w-full bg-white border border-border px-4 py-3 text-[14px] focus:border-primary focus:ring-0 outline-none resize-none" defaultValue="Can you do 80 pieces at ₹620 each?"></textarea>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link href={`/artisan/inquiries/demo/fair-deal`} className="flex-1 bg-primary text-white text-center py-3.5 px-6 text-[14px] font-bold hover:bg-neutral-800 transition-colors">
                Send Change Request
              </Link>
              <Link href={`/quote/${id}`} className="flex-1 bg-white border border-border text-primary text-center py-3.5 px-6 text-[14px] font-bold hover:border-primary transition-colors">
                Cancel
              </Link>
            </div>
          </form>

        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
"""

# 3. Fair Deal Shield (Artisan-facing)
artisan_fair_deal_page = """import Link from "next/link";

export default function ArtisanFairDealPage({ params }) {
  const id = params?.id || "demo";

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased min-h-screen flex flex-col">
      {/* Artisan Top Bar */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 lg:px-12 h-14 flex items-center justify-between border-b border-[#E5E5E5] shrink-0">
        <div className="flex items-center space-x-3">
          <Link href="/artisan/dashboard" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#1A1A1A] lg:hidden">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="text-[15px] text-[#1A1A1A] tracking-tight font-semibold lg:hidden">पूछताछ विवरण</span>
          <span className="text-[20px] text-[#1A1A1A] tracking-tight font-bold hidden lg:block">Craftigari नमस्ते</span>
        </div>
        <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-medium">
          <span className="text-[#666666]">Home</span>
          <span className="text-[#1A1A1A] font-bold">Market (1 New)</span>
        </nav>
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-transparent hover:bg-[#F3F4F6] text-[#666666]">
          <span className="material-symbols-outlined text-[20px]">volume_up</span>
        </button>
      </header>

      <main className="w-full flex-1 px-4 sm:px-6 lg:px-12 py-8 flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col gap-6">
          
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#666666] text-[12px] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]"></span>
            <span>क्रेता का नया प्रस्ताव (Buyer Counter-Offer)</span>
          </div>

          {/* FAIR DEAL SHIELD UI - Amber/Warm styling */}
          <div className="border-2 border-[#F59E0B] bg-[#FFFBEB] rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#FFFBEB] to-transparent">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[32px] sm:text-[40px] text-[#D97706] mt-1">shield_error</span>
                <div>
                  <h1 className="text-[22px] sm:text-[28px] font-bold text-[#92400E] leading-tight mb-2">
                    यह ऑफर आपकी सुरक्षित कीमत से कम है
                  </h1>
                  <p className="text-[14px] sm:text-[16px] text-[#B45309] font-medium max-w-2xl">
                    इस कीमत पर आपके कच्चे माल, मेहनत और पैकेजिंग का पूरा मूल्य नहीं मिल सकता। 
                    (This offer is below your sustainable pricing threshold.)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-[#FCD34D] bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Buyer Offer */}
                <div className="p-4 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-[12px] font-semibold text-[#666666] uppercase tracking-wide">क्रेता का प्रस्ताव<br/>(Buyer Offer)</span>
                  <span className="text-[24px] font-bold text-[#DC2626] mt-2">₹620 <span className="text-[12px] font-medium text-[#666666]">/ pc</span></span>
                </div>
                {/* Safe Threshold */}
                <div className="p-4 border-2 border-[#FCD34D] rounded-lg bg-[#FFFBEB] flex flex-col items-center sm:items-start text-center sm:text-left relative">
                  <span className="absolute -top-3 left-1/2 sm:left-4 -translate-x-1/2 sm:translate-x-0 bg-[#F59E0B] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">Fair Deal</span>
                  <span className="text-[12px] font-semibold text-[#92400E] uppercase tracking-wide mt-1">सुरक्षित न्यूनतम मूल्य<br/>(Minimum Safe Price)</span>
                  <span className="text-[24px] font-bold text-[#92400E] mt-2">₹680 <span className="text-[12px] font-medium text-[#B45309]">/ pc</span></span>
                </div>
                {/* Previous Quote */}
                <div className="p-4 border border-[#E5E5E5] rounded-lg bg-white flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-[12px] font-semibold text-[#666666] uppercase tracking-wide">आपकी पिछली कोटेशन<br/>(Your Quote)</span>
                  <span className="text-[24px] font-bold text-[#1A1A1A] mt-2">₹750 <span className="text-[12px] font-medium text-[#666666]">/ pc</span></span>
                </div>
              </div>

              <div className="bg-[#F3F4F6] p-4 rounded-lg mb-8 border border-[#E5E5E5]">
                <p className="text-[13px] text-[#4B5563] font-medium mb-1">Buyer Message:</p>
                <p className="text-[14px] text-[#1A1A1A] italic">"Can you do 80 pieces at ₹620 each?"</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-[#E5E5E5] pt-6">
                <button className="w-full sm:w-auto flex-1 bg-[#1A1A1A] text-white py-3.5 px-6 rounded-lg text-[15px] font-bold hover:bg-[#333333] transition-colors shadow-sm">
                  नया प्रस्ताव भेजें (Counter Offer: ₹700)
                </button>
                <button className="w-full sm:w-auto flex-1 bg-white border border-[#1A1A1A] text-[#1A1A1A] py-3.5 px-6 rounded-lg text-[15px] font-bold hover:bg-[#F3F4F6] transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  आवाज़ से जवाब दें (Reply by Voice)
                </button>
              </div>
              <div className="text-center sm:text-right mt-4">
                <button className="text-[12px] text-[#666666] hover:text-[#1A1A1A] underline decoration-[#CCCCCC] underline-offset-4 font-medium mr-4">
                  प्रस्ताव अस्वीकार करें (Decline)
                </button>
                <button className="text-[12px] text-[#92400E] hover:text-[#B45309] underline decoration-[#FCD34D] underline-offset-4 font-medium">
                  फिर भी स्वीकार करें (Accept Anyway)
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
"""

# 4. Quote Accepted / Payment Unlocked
buyer_payment_page = """import Link from "next/link";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function BuyerPaymentPage({ params }) {
  const id = params?.id || "demo";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col bg-surface-muted/20 items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-[1050px]">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-forest">check_circle</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Quotation Accepted</h1>
              <p className="text-[14px] text-secondary mt-1">Payment is now available for this confirmed deal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Confirmed Summary */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white border border-border p-6 shadow-sm">
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-5 border-b border-border pb-2">Final Deal Summary</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-surface-muted border border-border shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop" 
                      alt="Product Image" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h4>
                    <p className="text-[12px] text-secondary">Artisan: Master Ram Singh (Rajasthan)</p>
                    <p className="text-[11px] font-mono text-tertiary mt-2">Ref: QTN-8204-{id.toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-3 text-[13px] sm:text-[14px] mb-6">
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Quantity</span>
                    <span className="font-bold text-primary">80 Pieces</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Unit Price</span>
                    <span className="font-bold text-primary">₹750</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Production Timeline</span>
                    <span className="font-bold text-primary">15 Days</span>
                  </div>
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Customization</span>
                    <span className="font-bold text-primary">Red Finish (Custom Glaze)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment UI */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-border p-6 shadow-sm sticky top-24">
                <h3 className="text-[14px] font-bold text-primary uppercase tracking-wider mb-5 border-b border-border pb-2">Payment Details</h3>
                
                <div className="space-y-3 text-[13px] sm:text-[14px] mb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary">Product Total</span>
                    <span className="font-medium text-primary">₹60,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Estimated Shipping</span>
                    <span className="font-medium text-primary">₹4,200</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-border">
                    <span className="font-bold text-primary">Final Payable Amount</span>
                    <span className="text-xl font-bold text-primary">₹64,200</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">science</span>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Razorpay Test Mode</span>
                </div>

                <button className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm" onClick={() => alert('Razorpay Test Mode invoked. Backend integration required.')}>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pay Now
                </button>
                <p className="text-[11px] text-tertiary text-center mt-4">
                  This is a prototype environment. No real funds will be transferred.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
"""

# Write files
ensure_dir("apps/web/src/app/quote/[id]/change")
ensure_dir("apps/web/src/app/quote/[id]/payment")
ensure_dir("apps/web/src/app/artisan/inquiries/[id]/fair-deal")

with open("apps/web/src/app/quote/[id]/page.jsx", "w", encoding="utf-8") as f:
    f.write(buyer_quote_page)
with open("apps/web/src/app/quote/[id]/change/page.jsx", "w", encoding="utf-8") as f:
    f.write(buyer_change_page)
with open("apps/web/src/app/artisan/inquiries/[id]/fair-deal/page.jsx", "w", encoding="utf-8") as f:
    f.write(artisan_fair_deal_page)
with open("apps/web/src/app/quote/[id]/payment/page.jsx", "w", encoding="utf-8") as f:
    f.write(buyer_payment_page)

print("Deal flow pages created successfully.")
