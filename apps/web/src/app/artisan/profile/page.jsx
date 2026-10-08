"use client";
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
              <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
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
