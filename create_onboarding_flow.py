import os

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

order_confirmed_page = """import Link from "next/link";
import React from "react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function OrderConfirmedPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 sm:py-24 px-4 sm:px-6">
        <div className="w-full max-w-[750px] bg-white border border-border p-8 sm:p-12 shadow-sm text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-forest">check</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-2">Order Confirmed</h1>
          <p className="text-[14px] text-secondary">Your order has been successfully placed with the artisan.</p>
          <div className="mt-2 text-[12px] font-mono text-tertiary uppercase">Ref: ORD-559-{id.toUpperCase()}</div>

          <div className="mt-10 border border-border bg-surface-muted/20 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-left">
            <div className="w-24 h-24 bg-surface-muted border border-border shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop" 
                alt="Amer Terracotta Urn" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <h3 className="text-[16px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h3>
              <p className="text-[13px] text-secondary">Master Ram Singh • 80 Pieces</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">Total Paid</span>
                  <span className="text-[14px] font-bold text-primary">₹64,200</span>
                </div>
                <div>
                  <span className="block text-[11px] text-tertiary uppercase tracking-wider mb-0.5">Timeline</span>
                  <span className="text-[14px] font-bold text-primary">15 Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/order/${id}`} className="bg-primary text-white py-3.5 px-8 text-[14px] font-bold hover:bg-neutral-800 transition-colors inline-block w-full sm:w-auto">
              Track Order
            </Link>
            <Link href="/" className="bg-white border border-border text-primary py-3.5 px-8 text-[14px] font-bold hover:border-primary transition-colors inline-block w-full sm:w-auto">
              Continue Exploring
            </Link>
          </div>
          
        </div>
      </main>
      
      <BuyerFooter />
    </div>
  );
}
"""

order_tracking_page = """import Link from "next/link";
import React from "react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";

export default function OrderTrackingPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";

  const trackingStages = [
    { name: "Order Confirmed", status: "completed", date: "Today, 10:45 AM" },
    { name: "Pack Product", status: "completed", date: "Today, 2:15 PM" },
    { name: "Pickup Scheduled", status: "current", date: "Expected Tomorrow" },
    { name: "Picked Up", status: "upcoming", date: "" },
    { name: "In Transit", status: "upcoming", date: "" },
    { name: "Delivered", status: "upcoming", date: "Est. in 4-6 Days" },
  ];

  return (
    <div className="bg-white text-primary antialiased font-sans min-h-screen flex flex-col selection:bg-primary selection:text-white w-full">
      <BuyerHeader />
      
      <main className="flex-1 w-full flex flex-col items-center py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-muted/20">
        <div className="w-full max-w-[950px]">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Order Tracking</h1>
              <p className="text-[14px] text-secondary mt-1">Ref: ORD-559-{id.toUpperCase()}</p>
            </div>
            <div className="bg-surface border border-border px-3 py-1.5 inline-flex items-center gap-2 w-fit">
              <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
              <span className="text-[11px] font-medium text-secondary">Simulated tracking demo for prototype</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Summary */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-border p-6 shadow-sm">
                <h3 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Order Details</h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-surface-muted border border-border shrink-0">
                    <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=200&auto=format&fit=crop" alt="Urn" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-primary mb-1">Amer High-Fire Terracotta Water Urn</h4>
                    <p className="text-[12px] text-secondary">Master Ram Singh</p>
                    <p className="text-[12px] text-secondary">80 Pieces</p>
                  </div>
                </div>

                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between border-b border-border border-dashed pb-2">
                    <span className="text-secondary">Destination</span>
                    <span className="font-medium text-primary text-right">Design Studio<br/>Mumbai, MH</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-secondary">Final Amount</span>
                    <span className="font-bold text-primary">₹64,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Timeline */}
            <div className="md:col-span-7">
              <div className="bg-white border border-border p-6 sm:p-8 shadow-sm">
                <h3 className="text-[14px] font-bold text-primary mb-8">Journey Status</h3>
                
                <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                  {trackingStages.map((stage, i) => (
                    <div key={i} className="relative pl-8">
                      <div className={`absolute -left-[9px] top-0.5 w-[17px] h-[17px] rounded-full border-2 bg-white flex items-center justify-center 
                        ${stage.status === 'completed' ? 'border-forest' : stage.status === 'current' ? 'border-primary' : 'border-border'}`}>
                        {stage.status === 'completed' && <div className="w-2 h-2 rounded-full bg-forest"></div>}
                        {stage.status === 'current' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                      </div>
                      
                      <div>
                        <h4 className={`text-[15px] font-bold ${stage.status === 'upcoming' ? 'text-tertiary' : 'text-primary'}`}>
                          {stage.name}
                        </h4>
                        {stage.date && (
                          <p className={`text-[12px] mt-1 ${stage.status === 'upcoming' ? 'text-tertiary' : 'text-secondary'}`}>
                            {stage.date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
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

welcome_page = """"use client";
import Link from "next/link";
import { useState } from "react";

export default function WelcomeLanguagePage() {
  const [selected, setSelected] = useState("hi");

  return (
    <div className="bg-surface text-on-surface antialiased font-sans min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[560px] bg-white border border-outline p-8 sm:p-12 text-center shadow-sm">
        
        <div className="w-16 h-16 mx-auto mb-6 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-primary">language</span>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">अपनी भाषा चुनें</h1>
        <p className="text-[14px] text-secondary mb-10">Choose the language you are comfortable using.</p>

        <div className="space-y-4 mb-10">
          <button 
            onClick={() => setSelected("hi")}
            className={`w-full p-5 border text-left flex items-center justify-between transition-colors ${selected === "hi" ? "border-primary bg-surface-container-low" : "border-outline hover:border-outline-variant"}`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-[20px] font-bold ${selected === "hi" ? "text-primary" : "text-secondary"}`}>हिन्दी</span>
              <span className="text-[13px] text-tertiary">(Hindi)</span>
            </div>
            {selected === "hi" && <span className="material-symbols-outlined text-primary">check_circle</span>}
          </button>

          <button 
            onClick={() => setSelected("en")}
            className={`w-full p-5 border text-left flex items-center justify-between transition-colors ${selected === "en" ? "border-primary bg-surface-container-low" : "border-outline hover:border-outline-variant"}`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-[20px] font-bold ${selected === "en" ? "text-primary" : "text-secondary"}`}>English</span>
            </div>
            {selected === "en" && <span className="material-symbols-outlined text-primary">check_circle</span>}
          </button>
        </div>

        <Link href="/login" className="w-full block bg-primary text-white py-4 px-6 text-[16px] font-bold hover:bg-neutral-800 transition-colors text-center">
          Continue / आगे बढ़ें
        </Link>
        
      </div>
    </div>
  );
}
"""

login_page = """"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneLoginPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleSendOTP = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    // Simulate successful login
    router.push("/artisan/dashboard");
  };

  return (
    <div className="bg-surface text-on-surface antialiased font-sans min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white border border-outline p-8 sm:p-10 shadow-sm text-center">
        
        <div className="w-14 h-14 mx-auto mb-6 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-primary">smartphone</span>
        </div>
        
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">मोबाइल नंबर दर्ज करें</h1>
            <p className="text-[14px] text-secondary mb-8">Craftigari में आपका स्वागत है। अपना 10 अंकों का नंबर दर्ज करें।</p>
            
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="flex bg-white border border-outline">
                <span className="flex items-center justify-center px-4 border-r border-outline bg-surface-container-low text-[15px] font-medium text-secondary">
                  +91
                </span>
                <input 
                  type="tel" 
                  placeholder="Phone number" 
                  className="w-full px-4 py-3.5 text-[16px] font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors">
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">OTP दर्ज करें</h1>
            <p className="text-[14px] text-secondary mb-2">हमने आपके नंबर पर 6-अंकीय कोड भेजा है।</p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-[13px] font-medium text-primary">+91 ••••••••••</span>
              <button onClick={() => setStep(1)} className="text-[12px] text-terracotta underline font-medium">Edit Number</button>
            </div>
            
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input 
                type="text" 
                placeholder="• • • • • •" 
                className="w-full px-4 py-4 text-center text-[24px] tracking-[0.5em] font-medium border border-outline focus:outline-none focus:ring-1 focus:ring-primary"
                required
                maxLength="6"
              />
              <button type="submit" className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors">
                Verify & Continue
              </button>
            </form>
            <div className="mt-6 text-[13px] text-secondary">
              Didn't receive code? <button className="text-primary font-bold hover:underline">Resend OTP</button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
"""

ensure_dir("apps/web/src/app/order/[id]/confirmed")
ensure_dir("apps/web/src/app/welcome")

with open("apps/web/src/app/order/[id]/confirmed/page.jsx", "w", encoding="utf-8") as f:
    f.write(order_confirmed_page)
with open("apps/web/src/app/order/[id]/page.jsx", "w", encoding="utf-8") as f:
    f.write(order_tracking_page)
with open("apps/web/src/app/welcome/page.jsx", "w", encoding="utf-8") as f:
    f.write(welcome_page)
with open("apps/web/src/app/login/page.jsx", "w", encoding="utf-8") as f:
    f.write(login_page)

print("Onboarding pages created successfully.")
