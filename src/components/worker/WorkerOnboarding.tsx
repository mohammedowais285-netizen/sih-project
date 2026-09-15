import React, { useState } from 'react';
import { AppLanguage, UserRole } from '../../types';
import { ARTISAN_COMMUNITY_AVATARS } from '../../data/mockData';

interface WorkerOnboardingProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onSwitchRole: (role: UserRole) => void;
  onCompleteRegistration: () => void;
}

export const WorkerOnboarding: React.FC<WorkerOnboardingProps> = ({
  language,
  onLanguageChange,
  onSwitchRole,
  onCompleteRegistration,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [phone, setPhone] = useState('98765 43210');
  const [aadhaar, setAadhaar] = useState('5481 2910 8821');
  const [society, setSociety] = useState('hyd');
  const [trade, setTrade] = useState('electrician');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [consentTrust, setConsentTrust] = useState(true);
  const [consentFloor, setConsentFloor] = useState(true);
  const [otpDigits, setOtpDigits] = useState(['7', '3', '9', '4', '1', '8']);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-24 pt-2 space-y-4">
      {/* Top Utility Ribbon */}
      <header className="flex items-center justify-between">
        <nav aria-label="Language Selector" className="inline-flex p-0.5 bg-surface-container rounded-full shadow-xs">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'en' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'hi' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => onLanguageChange('te')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              language === 'te' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            తెలుగు
          </button>
        </nav>

        <aside className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span>Co-op Fed India</span>
        </aside>
      </header>

      {/* Role Switcher Pill Container */}
      <div className="w-full bg-surface-container-high p-1 rounded-full flex items-center shadow-inner">
        <button
          onClick={() => onSwitchRole('customer')}
          className="w-1/2 py-1.5 rounded-full text-center text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all"
        >
          Client Portal
        </button>
        <button
          onClick={() => onSwitchRole('worker')}
          className="w-1/2 py-1.5 rounded-full text-center text-xs font-bold bg-surface-container-lowest text-primary shadow-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            engineering
          </span>
          <span>Gig Worker Partner</span>
        </button>
      </div>

      {/* Cooperative Hero Banner Card */}
      <section className="p-4 bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary rounded-xl relative overflow-hidden shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 pointer-events-none">
          <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="6,4" strokeWidth="4" />
            <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed shadow-xs">
              <span className="material-symbols-outlined text-[18px]">handshake</span>
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase bg-primary-fixed/20 text-primary-fixed px-2 py-0.5 rounded-full">
              Federation Gateway
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-headline-lg-mobile leading-tight font-extrabold text-on-primary">
            Worker Owned.<br />Tech Powered.
          </h1>
          <p className="text-xs text-on-primary-container max-w-[280px] leading-relaxed">
            At your doorstep anytime — certified artisan solidarity across 48+ municipal unions.
          </p>
        </div>
      </section>

      {/* Primary Tab Selector: Join Cooperative vs Sign In (OTP) */}
      <div className="grid grid-cols-2 p-1 bg-surface-container rounded-xl">
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'register'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Join Cooperative</span>
        </button>

        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'login'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          <span>Sign In (OTP)</span>
        </button>
      </div>

      {/* REGISTRATION FLOW */}
      {authMode === 'register' ? (
        <div className="flex flex-col gap-4">
          {/* Milestone Header */}
          <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2 border border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Registration Milestones
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">Stage 1 of 4</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <div className="h-1.5 rounded-full bg-primary"></div>
              <div className="h-1.5 rounded-full bg-primary/40"></div>
              <div className="h-1.5 rounded-full bg-primary/40"></div>
              <div className="h-1.5 rounded-full bg-surface-container-highest"></div>
            </div>
          </div>

          {/* Stage 1: Identity & Biometrics */}
          <fieldset className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-headline-md font-bold text-on-surface">
                  Identity & Biometrics
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Instant OTP e-KYC matching with UIDAI sovereign portal
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface block">
                Mobile Number (Aadhaar linked)
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface flex items-center shrink-0">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface font-semibold focus:outline-none focus:bg-surface-container-high transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface block">
                12-Digit Aadhaar / VID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface font-semibold focus:outline-none focus:bg-surface-container-high"
                />
                <span className="material-symbols-outlined absolute right-3 top-2 text-on-surface-variant text-[18px]">
                  fingerprint
                </span>
              </div>
              <p className="text-[11px] text-primary flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Direct co-op end-to-end encrypted protocol</span>
              </p>
            </div>
          </fieldset>

          {/* Stage 2: Affiliated Co-op Society */}
          <fieldset className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-headline-md font-bold text-on-surface">
                  Affiliated Co-op Society
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Select your registered municipal labour cooperative union
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface block">
                Select District / State Federation
              </label>
              <div className="relative">
                <select
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                  className="w-full appearance-none px-3 py-2.5 pr-8 bg-surface-container-low rounded-lg text-xs text-on-surface font-medium focus:outline-none"
                >
                  <option value="hyd">Greater Hyderabad Labour Co-op Society Ltd. (MS/HYD/8821)</option>
                  <option value="kar">Karnataka Shramik Sahakari Sangha (BLR-URB-441)</option>
                  <option value="mh">Maharashtra Shramik Swavalamban Sanstha (MH-PUN-091)</option>
                  <option value="tn">Tamil Nadu Self-Employed Artisans Union (TN-CHE-218)</option>
                  <option value="ind">Direct Co-op Federation Pool (Autonomous Worker)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-lg flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
              <span>
                Dividend yield & pension credit linked to selected unit registration charter.
              </span>
            </div>
          </fieldset>

          {/* Stage 3: Trade & Skill Credentials */}
          <fieldset className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-headline-md font-bold text-on-surface">
                  Trade & Skill Credentials
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Badge accreditation based on your verified domain expertise
                </p>
              </div>
            </div>

            {/* Trade Pills */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'electrician', title: 'Electrician', sub: 'Wiring & LT Supply', icon: 'bolt' },
                { id: 'plumber', title: 'Plumber', sub: 'Sanitary & Pipelines', icon: 'plumbing' },
                { id: 'mason', title: 'Civil Mason', sub: 'Tiling & Masonry', icon: 'foundation' },
                { id: 'carpenter', title: 'Wood Artisan', sub: 'Furniture & Repair', icon: 'carpenter' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTrade(item.id)}
                  className={`p-2.5 rounded-lg text-left transition-all border flex flex-col gap-1 ${
                    trade === item.id
                      ? 'bg-primary-container text-on-primary border-primary shadow-xs'
                      : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-xs font-bold">{item.title}</span>
                  <span className="text-[11px] opacity-80 leading-none">{item.sub}</span>
                </button>
              ))}
            </div>

            {/* Upload Box */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-dashed border-outline-variant flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">
                  Upload ITI / NCVT / Skill Card
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'PDF, JPEG, or Digilocker XML sync (Max 10MB)'}
                </p>
              </div>
              <label className="px-4 py-1.5 bg-surface-container-lowest text-primary rounded-full text-xs font-bold shadow-xs hover:bg-surface-container-high transition-colors cursor-pointer">
                <span>{uploadedFileName ? 'Replace File' : 'Browse Files or Snap Photo'}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </fieldset>

          {/* Stage 4: Welfare Inclusion */}
          <fieldset className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm sm:text-base font-headline-md font-bold text-on-surface">
                  Universal Welfare Inclusion
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Statutory benefits enrolled under national and co-op schemes
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield_with_heart
                </span>
                <span className="text-xs font-bold text-on-surface">
                  PMSBY & HelPerzzz Co-op Solidarity Shield
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Includes ₹2,00,000 accidental cover, on-site hospital daily cash stipend, and maternal support via Co-op Solidarity Reserves.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentTrust}
                  onChange={(e) => setConsentTrust(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary accent-primary"
                />
                <span className="text-xs text-on-surface leading-tight">
                  I consent to register under the Cooperative Labor Trust and direct evening NEFT/UPI payouts.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentFloor}
                  onChange={(e) => setConsentFloor(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary accent-primary"
                />
                <span className="text-xs text-on-surface leading-tight">
                  I agree to the Fair Wage minimum floor guidelines and federation charter rules.
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={onCompleteRegistration}
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 mt-1 active:scale-98 transition-all"
            >
              <span>Proceed to Digital Biometric Verification</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </fieldset>
        </div>
      ) : (
        /* WORKER LOGIN PANEL */
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container space-y-4">
          <div>
            <h2 className="text-base font-headline-md font-bold text-on-surface">
              Welcome Back, Partner
            </h2>
            <p className="text-xs text-on-surface-variant">
              Enter your enrolled mobile number to receive your cooperative access OTP.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface block">Registered Mobile Number</label>
            <div className="flex gap-2">
              <div className="px-3 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface flex items-center shrink-0">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-3 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface">Enter 6-Digit OTP</label>
              <button type="button" className="text-xs font-semibold text-primary hover:underline">
                Resend via SMS
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="h-11 text-center text-base font-bold bg-surface-container-low rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onCompleteRegistration}
            className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Verify & Launch Dispatch Deck</span>
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onCompleteRegistration}
              className="text-xs text-secondary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
              <span>Log in with Biometric Thumb Scanner</span>
            </button>
          </div>
        </div>
      )}

      {/* Cooperative Guarantee & Rights 4 Pillars */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
          Cooperative Guarantee & Rights
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Guaranteed Wage Floor</h4>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              No sub-standard task bids. Rates benchmarked by state labour unions.
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Evening Payouts</h4>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              100% earnings transferred directly to your bank every day at 8:00 PM.
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Tribunal Due Process</h4>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              No algorithm blocks. Peer review tribunal before any action is taken.
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-surface-container-lowest text-tertiary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">pie_chart</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Annual Dividend</h4>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Platform profits are distributed annually as co-op member shares.
            </p>
          </div>
        </div>
      </section>

      {/* Active Community Member Showcase */}
      <section className="p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            {ARTISAN_COMMUNITY_AVATARS.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Artisan avatar"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container-lowest object-cover"
              />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">14,280+ Active Artisans</span>
            <span className="text-[11px] text-on-surface-variant">Across Hyderabad, Pune & Bengaluru</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
      </section>

      {/* Federation Footer Callout */}
      <footer className="text-center py-2">
        <p className="text-[11px] text-on-surface-variant font-medium">
          HelPerzzz is regulated under Multi-State Cooperative Societies Act, 2002.
        </p>
      </footer>
    </div>
  );
};
