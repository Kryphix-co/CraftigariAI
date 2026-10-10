"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArtisanHeader } from "@/components/artisan/ArtisanHeader";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/features/auth/AuthContext";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { apiGet, apiPatch, apiUpload } from "@/lib/api";

const EMPTY_PROFILE = {
  bio: "",
  craftSpecialization: "",
  location: "",
  name: "",
  phone: "",
  profilePhoto: "",
};

const SARVAM_LANGUAGES = [
  { code: "hi", label: "हिन्दी" },
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "mr", label: "मराठी" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "ur", label: "اردو" },
];

const VOICE_FIELD_LABELS = {
  bio: "Description",
  craftSpecialization: "Craft Category",
  location: "Region",
};

function formatDuration(duration) {
  const minutes = Math.floor(duration / 60).toString().padStart(2, "0");
  const seconds = (duration % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function ArtisanProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [speechLanguage, setSpeechLanguage] = useState("hi");
  const [activeVoiceField, setActiveVoiceField] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const activeVoiceFieldRef = useRef("");
  const router = useRouter();
  const { updateAuthenticatedArtisan } = useAuth();

  const handleRecorded = useCallback(
    async (file) => {
      const field = activeVoiceFieldRef.current;
      if (!field || !file) return;
      setIsTranscribing(true);
      setVoiceError("");
      setVoiceMessage("");

      try {
        const formData = new FormData();
        formData.append("audio", file);
        formData.append("language", speechLanguage);
        const data = await apiUpload("/api/ai/voice-transcription", formData);
        const transcript = data?.transcript?.trim();
        if (!transcript) throw new Error("Sarvam did not return any speech text.");

        setProfile((current) => ({ ...current, [field]: transcript }));
        setVoiceMessage(
          `${VOICE_FIELD_LABELS[field]} filled from Sarvam. Review it before saving.`,
        );
      } catch (requestError) {
        setVoiceError(
          requestError.code === "SARVAM_NOT_CONFIGURED"
            ? "Sarvam is not configured. Add SARVAM_API_KEY and try again."
            : requestError.message || "Sarvam could not transcribe this recording.",
        );
      } finally {
        activeVoiceFieldRef.current = "";
        setActiveVoiceField("");
        setIsTranscribing(false);
      }
    },
    [speechLanguage],
  );

  const {
    duration,
    error: recorderError,
    isRecording,
    startRecording,
    stopRecording,
  } = useVoiceRecorder({ onRecorded: handleRecorded });

  const handleVoiceField = async (field) => {
    setVoiceError("");
    setVoiceMessage("");
    if (isRecording) {
      if (activeVoiceField === field) stopRecording();
      return;
    }
    activeVoiceFieldRef.current = field;
    setActiveVoiceField(field);
    await startRecording();
  };

  useEffect(() => {
    if (isRecording && duration >= 30) stopRecording();
  }, [duration, isRecording, stopRecording]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    apiGet("/api/artisans/me", { signal: controller.signal })
      .then((data) => {
        if (!active) return;
        setProfile({ ...EMPTY_PROFILE, ...data.artisan });
        setIsEditing(!data.profileComplete);
      })
      .catch((requestError) => {
        if (active && requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      const data = await apiPatch("/api/artisans/me", {
        bio: profile.bio,
        craftSpecialization: profile.craftSpecialization,
        location: profile.location,
        name: profile.name,
        profilePhoto: profile.profilePhoto,
      });
      setProfile({ ...EMPTY_PROFILE, ...data.artisan });
      updateAuthenticatedArtisan(data.artisan, data.profileComplete);
      setIsEditing(!data.profileComplete);
      setMessage(
        data.profileComplete
          ? "Profile saved successfully."
          : "Profile saved. Add your name, craft category, and region to continue.",
      );

      const params = new URLSearchParams(window.location.search);
      if (params.get("onboarding") === "1" && data.profileComplete) {
        const next = params.get("next");
        router.replace(next?.startsWith("/artisan/") ? next : "/artisan/dashboard");
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col pb-20 lg:pb-0">
      <ArtisanHeader activeTab="profile" />

      <main className="flex-1 w-full flex flex-col items-center pt-8 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-[850px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Summary */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-outline-variant shadow-sm relative">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.name || "Artisan profile"} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-container text-tertiary">
                  <span className="material-symbols-outlined text-[38px]">person</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                {profile.name || "Complete your profile"}
              </h1>
              <p className="text-[14px] text-secondary mt-1 font-medium">
                {profile.craftSpecialization || "Add your craft specialization"}
              </p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-outline shadow-sm rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-outline flex justify-between items-center gap-4 bg-surface-container-lowest">
                <h2 className="text-[16px] font-bold text-primary">प्रोफ़ाइल विवरण (Profile Details)</h2>
                <button
                  className="shrink-0 text-[13px] font-bold text-accent-terracotta hover:text-terracotta-dark transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading || isSaving || isRecording || isTranscribing}
                  form={isEditing ? "artisan-profile-form" : undefined}
                  onClick={() => {
                    if (!isEditing) {
                      setError("");
                      setMessage("");
                      setIsEditing(true);
                    }
                  }}
                  type={isEditing ? "submit" : "button"}
                >
                  {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
              
              <form id="artisan-profile-form" onSubmit={handleSave} className="p-5 sm:p-6 space-y-6">
                {isLoading && <p className="text-[13px] text-secondary" role="status">Loading profile…</p>}
                {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">{error}</p>}
                {message && <p className="border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-800" role="status">{message}</p>}

                {isEditing && (
                  <section className="rounded-lg border border-outline-variant bg-surface-container-low p-4" aria-label="Sarvam voice fill">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="flex items-center gap-2 text-[13px] font-bold text-primary">
                          <span className="material-symbols-outlined text-[19px]">mic</span>
                          बोलकर प्रोफ़ाइल भरें · Sarvam Voice Fill
                        </h3>
                        <p className="mt-1 text-[11px] leading-relaxed text-secondary">
                          Choose a language, then tap Speak beside Craft Category, Region, or Description. Maximum 30 seconds.
                        </p>
                      </div>
                      <select
                        aria-label="Voice language"
                        className="h-9 rounded-md border border-outline bg-white px-3 text-[12px] font-medium text-primary outline-none focus:border-primary"
                        disabled={isRecording || isTranscribing}
                        onChange={(event) => setSpeechLanguage(event.target.value)}
                        value={speechLanguage}
                      >
                        {SARVAM_LANGUAGES.map((language) => (
                          <option key={language.code} value={language.code}>{language.label}</option>
                        ))}
                      </select>
                    </div>
                    {(recorderError || voiceError) && (
                      <p className="mt-3 text-[12px] text-red-700" role="alert">{voiceError || recorderError}</p>
                    )}
                    {voiceMessage && (
                      <p className="mt-3 text-[12px] text-green-800" role="status">{voiceMessage}</p>
                    )}
                    {(isRecording || isTranscribing) && (
                      <p className="mt-3 flex items-center gap-2 text-[12px] font-medium text-terracotta" role="status">
                        <span className={`h-2 w-2 rounded-full bg-red-500 ${isRecording ? "animate-pulse" : ""}`} />
                        {isRecording
                          ? `Listening for ${VOICE_FIELD_LABELS[activeVoiceField]} · ${formatDuration(duration)} · tap again to finish`
                          : "Sarvam is converting your speech to text…"}
                      </p>
                    )}
                  </section>
                )}

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">नाम (Name)</label>
                  {isEditing ? (
                    <input type="text" required maxLength={120} value={profile.name} onChange={(event) => updateField("name", event.target.value)} className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="break-words text-[15px] font-medium text-primary">{profile.name || "Not added"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">फ़ोन नंबर (Phone Number)</label>
                  <p className="break-words text-[15px] font-medium text-primary">{profile.phone || "Not available"}</p>
                  {isEditing && <p className="mt-1 text-[11px] text-tertiary">Your verified phone number cannot be changed here.</p>}
                </div>
                
                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="block text-[12px] font-bold text-secondary">शिल्प श्रेणी (Craft Category)</label>
                    {isEditing && (
                      <button aria-label="Fill Craft Category by voice" className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${activeVoiceField === "craftSpecialization" && isRecording ? "border-red-300 bg-red-50 text-red-700" : "border-outline bg-white text-primary hover:border-primary"}`} disabled={isTranscribing || (isRecording && activeVoiceField !== "craftSpecialization")} onClick={() => handleVoiceField("craftSpecialization")} type="button">
                        <span className="material-symbols-outlined text-[17px]">{activeVoiceField === "craftSpecialization" && isRecording ? "stop_circle" : "mic"}</span>
                        {activeVoiceField === "craftSpecialization" && isRecording ? "Stop" : "Speak"}
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input type="text" required maxLength={160} value={profile.craftSpecialization} onChange={(event) => updateField("craftSpecialization", event.target.value)} className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="break-words text-[15px] font-medium text-primary">{profile.craftSpecialization || "Not added"}</p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="block text-[12px] font-bold text-secondary">क्षेत्र (Region)</label>
                    {isEditing && (
                      <button aria-label="Fill Region by voice" className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${activeVoiceField === "location" && isRecording ? "border-red-300 bg-red-50 text-red-700" : "border-outline bg-white text-primary hover:border-primary"}`} disabled={isTranscribing || (isRecording && activeVoiceField !== "location")} onClick={() => handleVoiceField("location")} type="button">
                        <span className="material-symbols-outlined text-[17px]">{activeVoiceField === "location" && isRecording ? "stop_circle" : "mic"}</span>
                        {activeVoiceField === "location" && isRecording ? "Stop" : "Speak"}
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input type="text" required maxLength={180} value={profile.location} onChange={(event) => updateField("location", event.target.value)} className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="break-words text-[15px] font-medium text-primary">{profile.location || "Not added"}</p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="block text-[12px] font-bold text-secondary">परिचय (Description)</label>
                    {isEditing && (
                      <button aria-label="Fill Description by voice" className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${activeVoiceField === "bio" && isRecording ? "border-red-300 bg-red-50 text-red-700" : "border-outline bg-white text-primary hover:border-primary"}`} disabled={isTranscribing || (isRecording && activeVoiceField !== "bio")} onClick={() => handleVoiceField("bio")} type="button">
                        <span className="material-symbols-outlined text-[17px]">{activeVoiceField === "bio" && isRecording ? "stop_circle" : "mic"}</span>
                        {activeVoiceField === "bio" && isRecording ? "Stop" : "Speak"}
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea rows={3} maxLength={2000} value={profile.bio} onChange={(event) => updateField("bio", event.target.value)} className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none resize-none" />
                  ) : (
                    <p className="break-words text-[15px] text-primary leading-relaxed">{profile.bio || "Not added"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">प्रोफ़ाइल फ़ोटो URL (Profile Photo URL)</label>
                  {isEditing ? (
                    <input type="url" maxLength={2000} placeholder="https://example.com/photo.jpg" value={profile.profilePhoto} onChange={(event) => updateField("profilePhoto", event.target.value)} className="w-full border border-outline px-3 py-2 text-[14px] rounded-md focus:border-primary focus:ring-0 outline-none" />
                  ) : (
                    <p className="break-all text-[15px] font-medium text-primary">{profile.profilePhoto || "Not added"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-secondary mb-1">पसंदीदा भाषा (Preferred Language)</label>
                  <p className="text-[15px] font-medium text-primary">हिन्दी (Hindi)</p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}
