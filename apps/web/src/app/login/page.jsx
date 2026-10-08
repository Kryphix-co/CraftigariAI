"use client";
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
