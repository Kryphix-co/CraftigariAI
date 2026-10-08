"use client";
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
