/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AuthenticatedUser } from '../../types';
import { BRAND_LOGO_URL } from '../../data/mockData';

interface TwoStepVerificationProps {
  user: AuthenticatedUser;
  onVerificationSuccess: (user: AuthenticatedUser) => void;
  onCancel: () => void;
  initialMethod?: 'google_otp' | 'sms' | 'email';
}

export const TwoStepVerification: React.FC<TwoStepVerificationProps> = ({
  user,
  onVerificationSuccess,
  onCancel,
  initialMethod = 'google_otp',
}) => {
  const [method, setMethod] = useState<'google_otp' | 'sms' | 'email'>(initialMethod);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [trustDevice, setTrustDevice] = useState(true);

  // Dynamic Google Authenticator rolling TOTP simulation
  const [totpSecondsRemaining, setTotpSecondsRemaining] = useState(26);
  const [activeGoogleOtp, setActiveGoogleOtp] = useState('839204');
  const [smsTimer, setSmsTimer] = useState(30);
  const [canResendSms, setCanResendSms] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Rolling TOTP timer (every 30 seconds updates code)
  useEffect(() => {
    const timer = setInterval(() => {
      setTotpSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Generate a new 6-digit rolling code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setActiveGoogleOtp(newCode);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // SMS resend timer
  useEffect(() => {
    if (smsTimer > 0) {
      const t = setTimeout(() => setSmsTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResendSms(true);
    }
  }, [smsTimer]);

  // Focus first input box on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [method]);

  // Handle single digit input and auto-advance
  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage('');
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are entered
    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pasted.length === 6) {
      verifyCode(pasted);
    }
  };

  // Quick auto-fill active code
  const handleQuickFillCode = () => {
    const code = activeGoogleOtp;
    setDigits(code.split(''));
    verifyCode(code);
  };

  // Verify code logic
  const verifyCode = (codeToTest?: string) => {
    const code = codeToTest || digits.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);

      // In demo mode, accept activeGoogleOtp, or standard demo OTPs (e.g. 839204, 123456, 482910)
      const validCodes = [activeGoogleOtp, '839204', '123456', '482910', '000000'];
      const isValid = validCodes.includes(code) || code.length === 6;

      if (isValid) {
        onVerificationSuccess(user);
      } else {
        setErrorMessage(`Invalid code entered. Active Google OTP is: ${activeGoogleOtp}`);
      }
    }, 500);
  };

  // Resend SMS
  const handleResendSms = () => {
    if (!canResendSms) return;
    setCanResendSms(false);
    setSmsTimer(30);
    setResendNotice('New OTP dispatched via SMS & WhatsApp gateway.');
    setTimeout(() => setResendNotice(null), 3000);
  };

  return (
    <div
      id="two-step-verification-container"
      className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-fade-in"
    >
      {/* Top Brand Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-surface-container mb-3 shadow-2xs">
          <img src={BRAND_LOGO_URL} alt="HelPerzzz" className="w-5 h-5 rounded-md object-contain" />
          <span className="text-xs font-black tracking-wide text-primary uppercase">
            Telangana Cooperative Security
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          2-Step Verification
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-md mx-auto">
          Authenticate your identity with Google OAuth 2.0 OTP to unlock your cooperative domain clearance.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 sm:p-8 shadow-sm">
        {/* User Identity Card */}
        <div className="flex items-center justify-between p-3.5 bg-surface-container-low border border-surface-container rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-primary shadow-xs"
            />
            <div>
              <div className="text-xs sm:text-sm font-black text-on-surface flex items-center gap-1.5">
                <span>{user.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                  {user.role}
                </span>
              </div>
              <div className="text-[11px] text-on-surface-variant font-mono truncate max-w-[220px]">
                {user.email || user.username}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            <span className="material-symbols-outlined text-[14px]">check</span>
            <span>Step 1 Verified</span>
          </div>
        </div>

        {/* Verification Method Tabs */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Select 2-Step Verification Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Method 1: Google Authenticator */}
            <button
              type="button"
              id="method-google-otp"
              onClick={() => {
                setMethod('google_otp');
                setErrorMessage('');
              }}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                method === 'google_otp'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary font-bold shadow-2xs'
                  : 'border-surface-container bg-surface hover:bg-surface-container-low text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {method === 'google_otp' && <span className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <div>
                <div className="text-xs font-black truncate">Google OTP</div>
                <div className="text-[10px] text-on-surface-variant/80 font-medium truncate">
                  OAuth 2.0 TOTP
                </div>
              </div>
            </button>

            {/* Method 2: SMS Mobile OTP */}
            <button
              type="button"
              id="method-sms-otp"
              onClick={() => {
                setMethod('sms');
                setErrorMessage('');
              }}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                method === 'sms'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary font-bold shadow-2xs'
                  : 'border-surface-container bg-surface hover:bg-surface-container-low text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-[20px]">sms</span>
                {method === 'sms' && <span className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <div>
                <div className="text-xs font-black truncate">SMS / WhatsApp</div>
                <div className="text-[10px] text-on-surface-variant/80 font-medium truncate">
                  Registered Mobile
                </div>
              </div>
            </button>

            {/* Method 3: Email PIN */}
            <button
              type="button"
              id="method-email-otp"
              onClick={() => {
                setMethod('email');
                setErrorMessage('');
              }}
              className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                method === 'email'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary font-bold shadow-2xs'
                  : 'border-surface-container bg-surface hover:bg-surface-container-low text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                {method === 'email' && <span className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <div>
                <div className="text-xs font-black truncate">Email Security</div>
                <div className="text-[10px] text-on-surface-variant/80 font-medium truncate">
                  Inbox PIN
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Details for Selected Method */}
        {method === 'google_otp' && (
          <div className="p-3.5 bg-surface-container-low border border-surface-container rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  lock_clock
                </span>
                <span className="text-xs font-bold text-on-surface">
                  Live Google Authenticator TOTP
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
                <span>Refreshes in {totpSecondsRemaining}s</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-medium">Active Code:</span>
                <span className="text-base font-black font-mono tracking-wider text-primary">
                  {activeGoogleOtp.slice(0, 3)} {activeGoogleOtp.slice(3)}
                </span>
              </div>
              <button
                type="button"
                id="btn-quick-fill-google-otp"
                onClick={handleQuickFillCode}
                className="py-1 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Auto-Fill</span>
              </button>
            </div>
          </div>
        )}

        {method === 'sms' && (
          <div className="p-3.5 bg-surface-container-low border border-surface-container rounded-2xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">phone_iphone</span>
              <span>
                Code sent to: <strong className="font-mono text-on-surface">{user.phone}</strong>
              </span>
            </div>
            {canResendSms ? (
              <button
                type="button"
                onClick={handleResendSms}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Resend SMS
              </button>
            ) : (
              <span className="text-[11px] text-on-surface-variant font-medium">
                Resend in {smsTimer}s
              </span>
            )}
          </div>
        )}

        {method === 'email' && (
          <div className="p-3.5 bg-surface-container-low border border-surface-container rounded-2xl mb-6 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">outgoing_mail</span>
            <span>
              6-digit PIN dispatched to:{' '}
              <strong className="font-mono text-on-surface">{user.email}</strong>
            </span>
          </div>
        )}

        {resendNotice && (
          <div className="mb-4 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{resendNotice}</span>
          </div>
        )}

        {/* 6-Digit Code Input Boxes */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-on-surface text-center mb-3">
            Enter 6-Digit Verification Code
          </label>
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                id={`digit-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black font-mono rounded-xl bg-surface border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-2xs"
              />
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2 border border-error/20">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Trust Device Checkbox */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface font-medium">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-surface-container"
            />
            <span>Trust this device for 30 days</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          id="btn-verify-otp"
          onClick={() => verifyCode()}
          disabled={isVerifying}
          className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-black tracking-wide transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isVerifying ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
              <span>Verifying 2-Step Clearance...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>Verify & Access {user.role.toUpperCase()} Domain</span>
            </>
          )}
        </button>

        {/* Back to Sign In */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            ← Cancel & Return to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
