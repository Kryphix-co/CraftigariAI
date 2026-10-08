import Link from "next/link";
import React from "react";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";

export default function ArtisanFairDealPage({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams?.id || "demo";

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased min-h-screen flex flex-col">
      <ArtisanHeader activeTab="inquiries" />

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
                <Link href="/artisan/dashboard" className="w-full sm:w-auto flex-1 bg-[#1A1A1A] text-white py-3.5 px-6 rounded-lg text-[15px] font-bold hover:bg-[#333333] transition-colors shadow-sm text-center">
                  नया प्रस्ताव भेजें (Counter Offer: ₹700)
                </Link>
                <Link href={`/artisan/inquiries/${id}/quote`} className="w-full sm:w-auto flex-1 bg-white border border-[#1A1A1A] text-[#1A1A1A] py-3.5 px-6 rounded-lg text-[15px] font-bold hover:bg-[#F3F4F6] transition-colors flex items-center justify-center gap-2 text-center">
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  आवाज़ से जवाब दें (Reply by Voice)
                </Link>
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
