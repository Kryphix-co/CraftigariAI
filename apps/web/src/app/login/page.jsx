"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/features/i18n/LanguageContext";
import { LanguageSelector } from "@/features/i18n/LanguageSelector";
import { ApiClientError, apiGet, apiPost } from "@/lib/api";

function safeArtisanPath(value) {
  return value?.startsWith("/artisan/") ? value : "/artisan/dashboard";
}

function PhoneLoginContent() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeArtisanPath(searchParams.get("next"));

  useEffect(() => {
    const controller = new AbortController();
    apiGet("/api/auth/me", { signal: controller.signal })
      .then((data) => {
        const destination = data.profileComplete
          ? nextPath
          : `/artisan/profile?onboarding=1&next=${encodeURIComponent(nextPath)}`;
        router.replace(destination);
      })
      .catch((requestError) => {
        if (
          requestError.name !== "AbortError" &&
          !(requestError instanceof ApiClientError && requestError.status === 401)
        ) {
          setError(requestError.message);
        }
      });
    return () => controller.abort();
  }, [nextPath, router]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(
      () => setCooldown((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const requestOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(t("invalidPhone", "Enter a valid 10-digit Indian mobile number."));
      return;
    }
    setError("");
    setIsSending(true);
    try {
      const data = await apiPost("/api/auth/send-otp", {
        phone: `+91${phone}`,
      });
      setStep(2);
      setOtp("");
      setCooldown(data.resendAfterSeconds ?? 60);
      setDemoOtp(
        process.env.NODE_ENV !== "production" && data.demoOtp
          ? data.demoOtp
          : "",
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to send OTP.");
      const retryAfter = requestError.details?.[0]?.retryAfterSeconds;
      if (retryAfter) setCooldown(retryAfter);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();
    await requestOtp();
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError(t("invalidOtp", "Enter the complete 6-digit OTP."));
      return;
    }
    setError("");
    setIsVerifying(true);
    try {
      const data = await apiPost("/api/auth/verify-otp", {
        otp,
        phone: `+91${phone}`,
      });
      const destination = data.profileComplete
        ? nextPath
        : `/artisan/profile?onboarding=1&next=${encodeURIComponent(nextPath)}`;
      router.replace(destination);
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || "Unable to verify OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased font-sans min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white border border-outline p-8 sm:p-10 shadow-sm text-center relative">
        <div className="flex justify-end mb-2">
          <LanguageSelector compact />
        </div>

        <div className="w-14 h-14 mx-auto mb-6 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px] text-primary">smartphone</span>
        </div>

        {error && (
          <div aria-live="polite" className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-left text-[13px] text-red-700">
            {error}
          </div>
        )}
        
        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">
              {t("loginTitle", "Enter Mobile Number")}
            </h1>
            <p className="text-[14px] text-secondary mb-8">
              {t("loginSubtitle", "Welcome to Craftigari. Enter your 10-digit mobile number.")}
            </p>
            
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="flex bg-white border border-outline">
                <span className="flex items-center justify-center px-4 border-r border-outline bg-surface-container-low text-[15px] font-medium text-secondary">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder={t("phonePlaceholder", "Phone number")}
                  className="w-full px-4 py-3.5 text-[16px] font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </div>
              <button disabled={isSending} type="submit" className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                {isSending
                  ? t("sendingOtp", "Sending OTP…")
                  : t("sendOtp", "Send OTP")}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">
              {t("enterOtp", "Enter OTP")}
            </h1>
            <p className="text-[14px] text-secondary mb-2">
              {t("otpSent", "We have sent a 6-digit code to your number.")}
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-[13px] font-medium text-primary">+91 ••••••{phone.slice(-4)}</span>
              <button onClick={() => { setStep(1); setOtp(""); setError(""); setDemoOtp(""); }} className="text-[12px] text-terracotta underline font-medium" type="button">
                {t("editNumber", "Edit Number")}
              </button>
            </div>
            
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {demoOtp && (
                <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800" role="status">
                  Development OTP: <span className="font-mono font-bold tracking-wider">{demoOtp}</span>
                </div>
              )}
              <input 
                type="text" 
                placeholder="• • • • • •" 
                className="w-full px-4 py-4 text-center text-[24px] tracking-[0.5em] font-medium border border-outline focus:outline-none focus:ring-1 focus:ring-primary"
                required
                maxLength="6"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button disabled={isVerifying} type="submit" className="w-full bg-primary text-white py-4 px-6 text-[15px] font-bold hover:bg-neutral-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                {isVerifying
                  ? t("verifying", "Verifying…")
                  : t("verifyContinue", "Verify & Continue")}
              </button>
            </form>
            <div className="mt-6 text-[13px] text-secondary">
              {t("codeMissing", "Didn't receive code?")} {" "}
              <button className="text-primary font-bold hover:underline disabled:cursor-not-allowed disabled:text-tertiary disabled:no-underline" disabled={cooldown > 0 || isSending} onClick={requestOtp} type="button">
                {isSending
                  ? t("sendingOtp", "Sending…")
                  : cooldown > 0
                  ? t("resendIn", "Resend in {seconds}s").replace("{seconds}", cooldown)
                  : t("resendOtp", "Resend OTP")}
              </button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}

export default function PhoneLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <PhoneLoginContent />
    </Suspense>
  );
}
