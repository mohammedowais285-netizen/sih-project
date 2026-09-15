import React, { useState } from 'react';
import { AppLanguage, UserRole } from '../../types';
import { BRAND_LOGO_URL } from '../../data/mockData';

interface CustomerAuthProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onSwitchRole: (role: UserRole) => void;
  onLoginSuccess: (phoneNumber: string) => void;
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({
  language,
  onLanguageChange,
  onSwitchRole,
  onLoginSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationDetected, setIsLocationDetected] = useState(false);
  const [detectedWard, setDetectedWard] = useState('Hyderabad GHMC Ward 8 (17.3850° N, 78.4867° E)');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const translations = {
    en: {
      tagline: 'at your doorstep anytime',
      authTitle: 'Instant Sign In',
      authDesc: 'Enter your 10-digit mobile phone number',
      btnOtp: 'Get OTP & Continue',
      client: 'Customer',
      worker: 'Gig Partner',
      admin: 'Co-op Admin',
      locSub: 'Find certified cooperative workers in your colony or ward for sub-15 minute doorstep response.',
      detectWardBtn: 'Detect My Ward',
      verifyBtn: 'Verify & Enter HelPerzzz',
      googleBtn: 'Continue with Google',
      guaranteesTitle: 'Consumer Co-op Guarantees',
      badgeSpeed: '100% Cooperative Equity Collective',
    },
    hi: {
      tagline: 'हर समय आपके द्वार पर',
      authTitle: 'त्वरित प्रवेश करें',
      authDesc: 'अपना 10-अंकों का मोबाइल नंबर दर्ज करें',
      btnOtp: 'ओटीपी प्राप्त करें और आगे बढ़ें',
      client: 'ग्राहक',
      worker: 'सहकारी साथी',
      admin: 'सहकार व्यवस्थापक',
      locSub: '15 मिनट में मदद के लिए अपने वार्ड या कॉलोनी में सत्यापित सहकारी श्रमिकों को खोजें।',
      detectWardBtn: 'मेरा वार्ड खोजें',
      verifyBtn: 'सत्यापित करें और प्रवेश करें',
      googleBtn: 'गूगल से जारी रखें',
      guaranteesTitle: 'सहकारी उपभोक्ता गारंटी',
      badgeSpeed: '100% सहकारी सामूहिक स्वामित्व',
    },
    te: {
      tagline: 'ఎప్పుడైనా మీ ఇంటి ముంగిట',
      authTitle: 'త్వరిత లాగిన్',
      authDesc: 'మీ 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
      btnOtp: 'ఓటీపీ పొందండి & కొనసాగించండి',
      client: 'కస్టమర్',
      worker: 'కో-ఆప్ కార్మికుడు',
      admin: 'అడ్మిన్',
      locSub: '15 నిమిషాల్లో మీ కాలనీ లేదా వార్డులో ధృవీకరించబడిన కో-ఆపరేటివ్ వర్కర్లను కనుగొనండి.',
      detectWardBtn: 'నా వార్డు గుర్తించండి',
      verifyBtn: 'ధృవీకరించి ప్రవేశించండి',
      googleBtn: 'గూగుల్ తో కొనసాగించండి',
      guaranteesTitle: 'వినియోగదారుల సహకార రక్షణలు',
      badgeSpeed: '100% సహకార సమష్టి భరోసా',
    },
  };

  const t = translations[language];

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg(null);
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    onLoginSuccess(phoneNumber);
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setIsLocationDetected(true);
          const { latitude, longitude } = pos.coords;
          // If close to Hyderabad or general coordinates, show Hyderabad GHMC
          setDetectedWard(`Hyderabad GHMC Ward 8 (${latitude ? latitude.toFixed(4) : '17.3850'}° N, ${longitude ? longitude.toFixed(4) : '78.4867'}° E) • 52 artisans nearby`);
        },
        () => {
          setIsLocating(false);
          setIsLocationDetected(true);
          setDetectedWard('Hyderabad GHMC Ward 8 (17.3850° N, 78.4867° E) • 52 artisans nearby');
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setIsLocationDetected(true);
        setDetectedWard('Hyderabad GHMC Ward 8 (17.3850° N, 78.4867° E) • 52 artisans nearby');
      }, 600);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-20 pt-3 space-y-4">
      {/* Top Utility Header & Language Chips */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full shadow-xs">
          <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
          <span className="font-label-sm text-xs font-bold tracking-wide">Labour Co-op Fed</span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-surface-container p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded-full font-label-sm text-xs transition-all ${
              language === 'en'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2.5 py-1 rounded-full font-label-sm text-xs transition-all ${
              language === 'hi'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('te')}
            className={`px-2.5 py-1 rounded-full font-label-sm text-xs transition-all ${
              language === 'te'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Segmented Role Switcher */}
      <div className="w-full bg-surface-container-low p-1 rounded-full flex items-center shadow-xs">
        <button
          type="button"
          onClick={() => onSwitchRole('customer')}
          className="flex-1 py-1.5 rounded-full font-label-md text-xs sm:text-sm transition-all bg-surface-container-lowest text-on-surface font-bold shadow-xs flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">person_pin</span>
          <span>{t.client}</span>
        </button>

        <button
          type="button"
          onClick={() => onSwitchRole('worker')}
          className="flex-1 py-1.5 rounded-full font-label-md text-xs sm:text-sm transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">engineering</span>
          <span>{t.worker}</span>
        </button>

        <button
          type="button"
          onClick={() => onSwitchRole('admin')}
          className="flex-1 py-1.5 rounded-full font-label-md text-xs sm:text-sm transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
          <span>{t.admin}</span>
        </button>
      </div>

      {/* Brand Hero Identity Card */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary-fixed/30 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-secondary-fixed/40 rounded-full blur-xl pointer-events-none"></div>

        {/* Cooperative Equity Collective Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full mb-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="w-2 h-2 -ml-3.5 rounded-full bg-primary"></span>
          <span className="font-label-sm text-xs text-primary font-bold">{t.badgeSpeed}</span>
        </div>

        {/* Logo */}
        <div className="relative w-20 h-20 mb-2 flex items-center justify-center">
          <img
            alt="HelPerzzz Brand Logo"
            className="w-full h-full object-contain rounded-xl shadow-xs"
            src={BRAND_LOGO_URL}
          />
        </div>

        <h1 className="font-headline-lg-mobile text-2xl font-extrabold tracking-tight text-on-surface">
          HelPerzzz
        </h1>
        <p className="font-body-sm text-sm text-primary font-semibold mt-0.5 tracking-wide flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span>
          <span>{t.tagline}</span>
        </p>

        <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-2 max-w-xs leading-relaxed">
          Connect directly with certified municipal plumbers, electricians, housekeepers, and skilled trades at ethical state-regulated rates.
        </p>
      </div>

      {/* Doorstep Location Auto-Detection Card */}
      <div className="bg-surface-container-high rounded-xl p-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-on-primary-fixed">
            <span className="material-symbols-outlined text-[22px]">my_location</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-sm font-bold truncate text-on-surface">
                Enable Doorstep Location
              </h3>
              <span className="bg-primary-fixed-dim text-on-primary-fixed font-label-sm text-[11px] px-2 py-0.5 rounded-full font-bold">
                Local Co-op
              </span>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-snug">
              {t.locSub}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {!isLocationDetected ? (
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="bg-surface-container-lowest text-primary font-label-sm text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 hover:bg-surface-container-low transition-colors"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isLocating ? 'animate-spin' : ''}`}>
                    {isLocating ? 'sync' : 'near_me'}
                  </span>
                  <span>{isLocating ? 'Locating...' : t.detectWardBtn}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-primary font-label-sm text-xs font-bold bg-primary-fixed/40 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>{detectedWard}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Form Card */}
      <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-sm border border-surface-container">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-headline-md text-base font-bold text-on-surface">{t.authTitle}</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">{t.authDesc}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
            <label className="block font-label-md text-xs text-on-surface-variant font-semibold">
              Mobile Number
            </label>
            <div className="flex items-center bg-surface-container-low rounded-lg px-3 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary transition-all">
              <div className="flex items-center gap-1 pr-2 text-on-surface font-headline-md shrink-0">
                <span className="text-sm">🇮🇳</span>
                <span className="font-bold text-sm">+91</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full bg-transparent py-3 font-headline-md text-on-surface placeholder:text-outline focus:outline-none tracking-wider text-base"
                maxLength={12}
                required
              />
              {phoneNumber && (
                <button
                  type="button"
                  onClick={() => setPhoneNumber('')}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-error font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                <span>{errorMsg}</span>
              </p>
            )}

            <p className="font-label-sm text-[11px] text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              <span>We do not share your contact. OTP sent via SMS & WhatsApp.</span>
            </p>

            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary rounded-lg font-label-lg text-sm font-bold shadow-sm hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-1"
            >
              <span>{t.btnOtp}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-on-surface-variant">
                OTP sent to <strong className="text-on-surface">+91 {phoneNumber}</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="font-label-sm text-xs text-primary font-bold hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="flex justify-between gap-1.5 sm:gap-2">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-12 sm:w-11 sm:h-12 text-center font-headline-md text-lg bg-surface-container-low rounded-lg focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none font-bold"
                  placeholder="•"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-label-sm">
              <span className="text-on-surface-variant">
                Resend code in <strong className="text-primary font-bold">00:38</strong>
              </span>
              <button type="button" className="text-secondary font-semibold hover:underline">
                Resend via WhatsApp
              </button>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full h-12 bg-primary text-on-primary rounded-lg font-label-lg text-sm font-bold shadow-sm hover:bg-primary-container active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>{t.verifyBtn}</span>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </button>
          </div>
        )}

        {/* Quick Social Sign In Alternative */}
        <div className="mt-4 pt-2 space-y-2">
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full bg-surface-container-highest h-[1px]"></div>
            <span className="absolute bg-surface-container-lowest px-2 font-label-sm text-[11px] text-outline">
              or connect with
            </span>
          </div>

          <button
            type="button"
            onClick={() => onLoginSuccess('98490 28141')}
            className="w-full h-12 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors active:scale-[0.99] shadow-xs"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" fill="#EA4335" />
              <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" fill="#4285F4" />
              <path d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" fill="#FBBC05" />
              <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z" fill="#34A853" />
            </svg>
            <span>{t.googleBtn}</span>
          </button>
        </div>
      </div>

      {/* Consumer Co-op Guarantees */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-headline-md text-xs font-bold text-on-surface uppercase tracking-wider">
            {t.guaranteesTitle}
          </h4>
          <span className="font-label-sm text-[11px] text-primary font-bold">Standardized Safety</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Guarantee 1 */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container flex flex-col gap-1">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <span className="font-label-md text-xs font-bold text-on-surface mt-1">100% Police Verified</span>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
              Background screened & endorsed by local RWA society branches.
            </p>
          </div>

          {/* Guarantee 2 */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container flex flex-col gap-1">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">price_check</span>
            </div>
            <span className="font-label-md text-xs font-bold text-on-surface mt-1">Fair Co-op Pricing</span>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
              Zero surge extortion. Municipal collective standard tariffs.
            </p>
          </div>

          {/* Guarantee 3 */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container flex flex-col gap-1">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
            </div>
            <span className="font-label-md text-xs font-bold text-on-surface mt-1">Transparent Welfare</span>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
              100% of fees benefit partner healthcare & children’s education.
            </p>
          </div>

          {/* Guarantee 4 */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container flex flex-col gap-1">
            <div className="w-8 h-8 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
            </div>
            <span className="font-label-md text-xs font-bold text-on-surface mt-1">Emergency Dispatch</span>
            <p className="font-body-sm text-[11px] text-on-surface-variant text-xs leading-tight">
              Immediate pipe leaks, lockouts, or power failures in under 15m.
            </p>
          </div>
        </div>
      </div>

      {/* Doorstep Live Federation Dispatch Snapshot Card */}
      <div className="bg-surface-container-low rounded-xl p-3 shadow-xs border border-surface-container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container-highest shrink-0 shadow-xs">
            <img
              className="w-full h-full object-cover"
              alt="Ramesh K."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClGX2ZRSIvx93yyA_ZIiQfP6juTkIJo5CYZUZq4bW6nTvnBqmV-ZAefI9_8WkZ44I_ons3vcUKmNAoZyTR-h4Vcfdec9ppbVF129Pa9byXHZqOWxKZEeo-yCo196gu3cTzkghWYXiSR9yrclCVuWaKeEXM6m3YVK9Qr0PMK8cPFJvIfCsZc1OyMcRciFZXFiWOQVMRQEK9KOePft9ohVAei2zeGPZWNhe6CxrfWJdswHlz5R9L8e4ZdA"
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-surface-container-lowest"></div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h5 className="font-label-md text-xs font-bold text-on-surface truncate">
                Ramesh K. (Master Electrician)
              </h5>
              <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
            </div>
            <p className="font-label-sm text-[11px] text-on-surface-variant truncate">
              Currently active 0.6 km away • 4.9 ★ (840+ jobs)
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="inline-block px-2.5 py-1 bg-surface-container-lowest text-primary font-label-sm text-xs font-bold rounded-full shadow-xs border border-surface-container">
            ~12 min ETA
          </span>
        </div>
      </div>

      {/* Legal & Co-op Federation Footer Notice */}
      <div className="text-center pt-2 space-y-1">
        <p className="font-label-sm text-[11px] text-outline leading-tight">
          By continuing, you endorse equitable wages and consent to the{' '}
          <a className="text-primary underline font-medium" href="#charter">Cooperative Charter</a> &{' '}
          <a className="text-primary underline font-medium" href="#bylaws">Privacy Bylaws</a>.
        </p>
        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-outline font-medium">
          <span>Secured by National Co-op Stack</span>
          <span>•</span>
          <span>ISO 27001 Certified</span>
        </div>
      </div>
    </div>
  );
};
