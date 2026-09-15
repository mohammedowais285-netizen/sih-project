import React, { useState } from 'react';
import { UserRole } from '../../types';
import { BRAND_LOGO_URL } from '../../data/mockData';

interface AdminLoginProps {
  onSwitchRole: (role: UserRole) => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSwitchRole, onLoginSuccess }) => {
  const [society, setSociety] = useState('hyd-14');
  const [regNo, setRegNo] = useState('FED-HYD-2024-891');
  const [adminEmail, setAdminEmail] = useState('sec.hyderabad@helperzzz.coop');
  const [passcode, setPasscode] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [totpDigits, setTotpDigits] = useState(['7', '3', '9', '4', '1', '8']);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(null), 3500);
  };

  const handleTotpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...totpDigits];
    updated[index] = val;
    setTotpDigits(updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 900);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-24 pt-2 space-y-4">
      {/* Top Segmented Role Switcher */}
      <div className="w-full flex justify-center py-1">
        <div className="bg-surface-container-high p-1 rounded-full flex items-center shadow-xs w-full max-w-xs">
          <button
            type="button"
            onClick={() => onSwitchRole('customer')}
            className="flex-1 py-1.5 px-3 rounded-full text-center text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => onSwitchRole('worker')}
            className="flex-1 py-1.5 px-3 rounded-full text-center text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Worker
          </button>
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-full bg-surface-container-lowest text-primary shadow-xs text-center text-xs font-bold flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_person
            </span>
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Hero Header & Co-op Identity */}
      <div className="flex flex-col items-center text-center mt-2 mb-2">
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-xl bg-surface-container-lowest p-2 shadow-xs border border-surface-container flex items-center justify-center">
            <img
              alt="HelPerzzz Brand Logo"
              className="w-full h-full object-contain rounded-lg"
              src={BRAND_LOGO_URL}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[12px] block" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full mb-2 text-primary">
          <span className="material-symbols-outlined text-[15px]">account_balance</span>
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
            Labor Federation Portal
          </span>
        </div>

        <h1 className="font-headline-lg-mobile text-xl font-bold text-on-surface">
          HelPerzzz <span className="text-primary">Federation</span>
        </h1>
        <p className="font-body-sm text-xs text-on-surface-variant max-w-xs mt-0.5">
          Federation & Society Admin Console • <span className="text-secondary font-semibold">at your doorstep anytime</span>
        </p>
      </div>

      {/* Federation Accreditation Notice Strip */}
      <div className="bg-secondary-container text-on-secondary-container p-3 rounded-xl flex items-start gap-2.5 shadow-xs border border-secondary-container">
        <span className="material-symbols-outlined text-secondary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified_user
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-label-md text-xs font-bold leading-tight text-on-secondary-container">
            Statutory Cooperative System
          </p>
          <p className="font-body-sm text-[11px] text-on-secondary-container/90 mt-0.5 leading-snug">
            Governed under MSCS Act • Tier-3 Sovereign Encryption Protocol
          </p>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container">
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          {/* Society Branch Selector */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs text-on-surface font-semibold flex items-center justify-between">
              <span>Chartered Society / Guild</span>
              <span className="text-primary font-label-sm text-[11px] font-bold">Active Chapter</span>
            </label>
            <div className="relative">
              <select
                value={society}
                onChange={(e) => setSociety(e.target.value)}
                className="w-full h-11 bg-surface-container-low text-on-surface rounded-lg px-3 pr-8 text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-surface-container"
              >
                <option value="mum-01">Mumbai Suburban Technicians Union (#04)</option>
                <option value="hyd-14">Hyderabad Central Labour Union (#14)</option>
                <option value="blr-09">Bengaluru Urban Artisan Guild (#09)</option>
                <option value="del-22">Delhi NCR Cooperative Dispatch Federation (#22)</option>
                <option value="kol-05">Kolkata Municipal Allied Workers Alliance (#05)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-3 text-on-surface-variant pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Federation Registration Number */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs text-on-surface font-semibold flex items-center justify-between">
              <span>Federation Registration No.</span>
              <span className="text-on-surface-variant font-label-sm text-[11px]">Official MSCS ID</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                badge
              </span>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full h-11 bg-surface-container-low text-on-surface rounded-lg pl-9 pr-3 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container"
                required
              />
            </div>
          </div>

          {/* Admin Identity */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs text-on-surface font-semibold">
              Authorized Admin Identity
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                alternate_email
              </span>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full h-11 bg-surface-container-low text-on-surface rounded-lg pl-9 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container"
                required
              />
            </div>
          </div>

          {/* Passcode */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs text-on-surface font-semibold flex items-center justify-between">
              <span>Digital Security Passcode</span>
              <button
                type="button"
                onClick={() => showNotice('Cooperative vault recovery token sent to Secretariat Desk.')}
                className="text-primary font-label-sm text-[11px] font-semibold hover:underline cursor-pointer"
              >
                Vault Reset?
              </button>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                key
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full h-11 bg-surface-container-low text-on-surface rounded-lg pl-9 pr-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary border border-surface-container"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* e-Gov Sovereign 2FA Gateway */}
          <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-2 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  security
                </span>
                <span className="font-label-md text-xs font-bold text-on-surface">e-Gov Sovereign 2FA</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[10px] font-bold">
                Hardware Token Ready
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mt-0.5">
              {totpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleTotpChange(idx, e.target.value)}
                  className="h-10 text-center bg-surface-container-lowest rounded font-headline-md text-base font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none border border-surface-container-high"
                />
              ))}
            </div>

            <p className="font-label-sm text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-primary">sync</span>
              <span>Rolling TOTP synchronized with Central Guild Keycard</span>
            </p>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isAuthenticating || authSuccess}
            className={`w-full h-12 rounded-xl font-label-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 mt-1 ${
              authSuccess
                ? 'bg-primary-container text-on-primary'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            {isAuthenticating ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Authenticating Co-op Session...</span>
              </>
            ) : authSuccess ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Federation Clearance Granted</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>

          {/* Trust Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5 text-on-surface-variant text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
            <span className="font-medium">256-Bit Guild Consensus HSM Encrypted</span>
          </div>
        </form>
      </div>

      {/* Cooperative Compliance & Audit Card */}
      <div className="bg-surface-container rounded-xl p-3.5 shadow-xs border border-surface-container-high">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-surface-container-highest text-secondary shrink-0">
            <span className="material-symbols-outlined text-[20px]">gavel</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-label-md text-xs font-bold text-on-surface">
              Cooperative Compliance Notice
            </h2>
            <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
              Authorized under Multi-State Cooperative Societies Act & National Gig Worker Welfare Protocol. All administrative dispatch actions, rate arbitrations, and cooperative dividend ledger changes are tamper-evidently logged and auditable.
            </p>
          </div>
        </div>
      </div>

      {/* Federation Technical Secretariat Contact */}
      <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">support_agent</span>
            <h3 className="font-label-md text-xs font-bold text-on-surface">Technical Secretariat Desk</h3>
          </div>
          <span className="text-primary font-label-sm text-[11px] font-bold">24/7 Priority Line</span>
        </div>

        <p className="font-body-sm text-[11px] text-on-surface-variant">
          For hardware token replacement, guild charter validation, or urgent dispatch override clearance:
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <a
            className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-variant transition-colors"
            href="tel:1800-419-2667"
          >
            <span className="material-symbols-outlined text-[14px] text-primary">call</span>
            <span>1800-419-COOP (Ext. 04)</span>
          </a>
          <a
            className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-variant transition-colors"
            href="mailto:secretariat@helperzzz.org"
          >
            <span className="material-symbols-outlined text-[14px] text-primary">mail</span>
            <span>secretariat@helperzzz.org</span>
          </a>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-2 text-on-surface-variant font-label-sm text-[11px]">
        HelPerzzz Federation Network • Ethical Labor Solidarity • v4.8.2-Gov
      </div>

      {noticeMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-surface-container-high animate-fade-in max-w-[90vw]">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">info</span>
          <span className="truncate">{noticeMsg}</span>
        </div>
      )}
    </div>
  );
};
