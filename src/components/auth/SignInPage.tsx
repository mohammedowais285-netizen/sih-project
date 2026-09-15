/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, AppLanguage, AuthenticatedUser, CustomerLocation } from '../../types';
import { BRAND_LOGO_URL } from '../../data/mockData';
import { TEMPORARY_CREDENTIALS, DEFAULT_AUTHENTICATED_USERS, DEFAULT_CLIENT_PROFILE } from '../../data/defaultProfile';
import { findAccount, resetAllToFactoryBaseline } from '../../utils/authStorage';
import { TwoStepVerification } from './TwoStepVerification';
import { GoogleOAuthModal } from './GoogleOAuthModal';

interface SignInPageProps {
  onLogin: (user: AuthenticatedUser) => void;
  onNavigateToRegister: (prefillRole?: UserRole) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  currentLocation: CustomerLocation;
  onRequestGpsFix?: () => void;
  prefillUsername?: string;
  prefillPassword?: string;
  successNotification?: string | null;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onLogin,
  onNavigateToRegister,
  language,
  onLanguageChange,
  currentLocation,
  onRequestGpsFix,
  prefillUsername = '',
  prefillPassword = '',
  successNotification,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [username, setUsername] = useState(prefillUsername || TEMPORARY_CREDENTIALS.customer.tempId);
  const [password, setPassword] = useState(prefillPassword || TEMPORARY_CREDENTIALS.customer.tempPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // 2-Step Verification State
  const [twoStepUser, setTwoStepUser] = useState<AuthenticatedUser | null>(null);
  const [isGoogleOAuthOpen, setIsGoogleOAuthOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // If prefilled credentials change (e.g. redirected after registration)
  useEffect(() => {
    if (prefillUsername) {
      setUsername(prefillUsername);
    }
    if (prefillPassword) {
      setPassword(prefillPassword);
    }
  }, [prefillUsername, prefillPassword]);

  // When switching role tab, prefill default demo credentials if user hasn't typed custom credentials
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUsername(TEMPORARY_CREDENTIALS[role].tempId);
    setPassword(TEMPORARY_CREDENTIALS[role].tempPassword);
    setErrorMessage('');
    setCopiedFeedback(false);
  };

  const handleAutoFill = () => {
    const creds = TEMPORARY_CREDENTIALS[selectedRole];
    setUsername(creds.tempId);
    setPassword(creds.tempPassword);
    setCopiedFeedback(true);
    setErrorMessage('');
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const triggerTwoStepVerification = (user: AuthenticatedUser) => {
    setTwoStepUser(user);
  };

  const handleResetToZero = () => {
    resetAllToFactoryBaseline();
    setResetFeedback('Application reset to 0 parameters! All caches cleared.');
    setTimeout(() => setResetFeedback(null), 3500);
  };

  const handle1ClickDemo = (role: UserRole) => {
    if (role === 'customer') {
      triggerTwoStepVerification(DEFAULT_AUTHENTICATED_USERS.customer);
    } else if (role === 'worker') {
      triggerTwoStepVerification(DEFAULT_AUTHENTICATED_USERS.worker);
    } else {
      triggerTwoStepVerification(DEFAULT_AUTHENTICATED_USERS.admin);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = username.trim();
    const cleanPw = password.trim();

    if (!cleanUser) {
      setErrorMessage('Please enter your username, registered email, or mobile number.');
      return;
    }
    if (!cleanPw) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // 1. Check custom registered accounts first (created via Registration page)
      const matchedRegistered = findAccount(cleanUser);
      if (matchedRegistered) {
        if (matchedRegistered.password === cleanPw) {
          triggerTwoStepVerification(matchedRegistered.user);
          return;
        } else {
          setErrorMessage('Incorrect password. Please verify and try again.');
          return;
        }
      }

      // 2. Check built-in demo credentials
      const currentCred = TEMPORARY_CREDENTIALS[selectedRole];
      const isDefaultMatch =
        (cleanUser.toLowerCase() === currentCred.tempId.toLowerCase() ||
          cleanUser.toLowerCase() === selectedRole.toLowerCase() ||
          cleanUser.includes('owais') ||
          cleanUser.includes('ramesh') ||
          cleanUser.includes('admin')) &&
        cleanPw === currentCred.tempPassword;

      if (isDefaultMatch) {
        if (selectedRole === 'customer') {
          const user: AuthenticatedUser = {
            id: DEFAULT_CLIENT_PROFILE.id,
            name: DEFAULT_CLIENT_PROFILE.name,
            username: cleanUser.includes('@') ? 'owais_patron' : cleanUser,
            phone: DEFAULT_CLIENT_PROFILE.phone,
            email: cleanUser.includes('@') ? cleanUser : DEFAULT_CLIENT_PROFILE.email,
            role: 'customer',
            avatar: DEFAULT_CLIENT_PROFILE.avatar,
            locality: currentLocation.name,
            ward: currentLocation.wardNumber,
            designation: 'Citizen Patron Member',
          };
          triggerTwoStepVerification(user);
        } else if (selectedRole === 'worker') {
          const user: AuthenticatedUser = {
            ...DEFAULT_AUTHENTICATED_USERS.worker,
            username: cleanUser.includes('@') ? 'ramesh_artisan' : cleanUser,
            role: 'worker',
            ward: currentLocation.wardNumber || 'Ward 8 (Jubilee Hills)',
          };
          triggerTwoStepVerification(user);
        } else {
          const user: AuthenticatedUser = {
            ...DEFAULT_AUTHENTICATED_USERS.admin,
            username: cleanUser.includes('@') ? 'admin_registrar' : cleanUser,
            role: 'admin',
          };
          triggerTwoStepVerification(user);
        }
        return;
      }

      // 3. Fallback: If not matched, give friendly prompt or allow login if password passes minimum length
      if (cleanPw.length >= 6) {
        // Create an on-the-fly authenticated session for any custom entered username
        const fallbackUser: AuthenticatedUser = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser,
          username: cleanUser,
          phone: '+91 98490 00000',
          email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@telanganacoop.org`,
          role: selectedRole,
          avatar:
            selectedRole === 'customer'
              ? DEFAULT_CLIENT_PROFILE.avatar
              : selectedRole === 'worker'
              ? DEFAULT_AUTHENTICATED_USERS.worker.avatar
              : DEFAULT_AUTHENTICATED_USERS.admin.avatar,
          designation:
            selectedRole === 'customer'
              ? 'Citizen Patron Member'
              : selectedRole === 'worker'
              ? 'Certified Artisan Member'
              : 'Federation Official',
          ward: currentLocation.wardNumber,
          locality: currentLocation.name,
          trade: selectedRole === 'worker' ? 'Master Electrician' : undefined,
          aadhaarVerified: selectedRole === 'worker',
        };
        triggerTwoStepVerification(fallbackUser);
      } else {
        setErrorMessage(
          `Invalid credentials. For quick testing, click "Auto-fill Test Credentials" or register a new account.`
        );
      }
    }, 400);
  };

  // If two-step verification is triggered, render dedicated 2FA screen
  if (twoStepUser) {
    return (
      <TwoStepVerification
        user={twoStepUser}
        onVerificationSuccess={(verifiedUser) => onLogin(verifiedUser)}
        onCancel={() => setTwoStepUser(null)}
        initialMethod="google_otp"
      />
    );
  }

  return (
    <div id="sign-in-page" className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Top Brand Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container-low border border-surface-container mb-3 shadow-2xs">
          <img
            src={BRAND_LOGO_URL}
            alt="HelPerzzz Logo"
            className="w-5 h-5 rounded-md object-contain"
          />
          <span className="text-xs font-black tracking-wide text-primary uppercase">
            Telangana Artisan Cooperative Federation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          Sign In to HelPerzzz
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-md mx-auto">
          Enter your registered username and password to access your doorstep services, artisan dispatch radar, or administration desk.
        </p>
      </div>

      {/* Success Notification (e.g., from recent registration) */}
      {successNotification && (
        <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-semibold shadow-xs">
          <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0">
            verified
          </span>
          <div className="flex-1">
            <span className="font-bold">Account Registered!</span> {successNotification}
          </div>
        </div>
      )}

      {/* Navigation Switch Tabs: Sign In vs Register */}
      <div className="bg-surface-container-low p-1 rounded-2xl border border-surface-container flex items-center mb-6 shadow-2xs">
        <button
          type="button"
          id="tab-sign-in-active"
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-primary text-on-primary shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>Sign In</span>
        </button>
        <button
          type="button"
          id="tab-switch-to-register"
          onClick={() => onNavigateToRegister(selectedRole)}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Register New Account</span>
        </button>
      </div>

      {/* Card Wrapper */}
      <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 sm:p-8 shadow-sm">
        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Select Your Account Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'customer', label: 'Client / Citizen', icon: 'person', badge: 'Doorstep' },
                { id: 'worker', label: 'Artisan / Worker', icon: 'engineering', badge: 'Society #41' },
                { id: 'admin', label: 'Secretariat Admin', icon: 'shield_person', badge: 'Gov Hub' },
              ] as const
            ).map((item) => {
              const isSelected = selectedRole === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`role-btn-${item.id}`}
                  onClick={() => handleRoleSelect(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary font-bold shadow-2xs'
                      : 'border-surface-container bg-surface hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black truncate">{item.label}</div>
                    <div className="text-[10px] text-on-surface-variant/80 font-medium truncate">
                      {item.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Credentials Auto-fill banner */}
        <div className="mb-6 p-3.5 bg-surface-container-low border border-surface-container rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">key</span>
            <div className="text-xs">
              <span className="font-bold text-on-surface">Quick Test Credentials:</span>{' '}
              <code className="text-primary font-mono text-[11px] bg-surface px-1.5 py-0.5 rounded border border-surface-container">
                {TEMPORARY_CREDENTIALS[selectedRole].tempId}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="autofill-btn"
              onClick={handleAutoFill}
              className="text-[11px] font-bold py-1.5 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copiedFeedback ? 'done' : 'auto_fix_high'}
              </span>
              <span>{copiedFeedback ? 'Filled!' : 'Auto-Fill'}</span>
            </button>
            <button
              type="button"
              id="instant-demo-login-btn"
              onClick={() => handle1ClickDemo(selectedRole)}
              className="text-[11px] font-bold py-1.5 px-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Skip typing and instantly login with test account"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>1-Click Sign In</span>
            </button>
          </div>
        </div>

        {/* Google OAuth 2.0 Sign In Button */}
        <button
          type="button"
          id="btn-google-oauth-signin"
          onClick={() => setIsGoogleOAuthOpen(true)}
          className="w-full py-3 px-4 rounded-2xl border border-surface-container bg-surface hover:bg-surface-container-low text-on-surface text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer mb-5 hover:border-outline"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
          <span>Sign In with Google (OAuth 2.0 + OTP)</span>
        </button>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-surface-container-lowest text-on-surface-variant font-medium">
              or enter cooperative credentials
            </span>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / User ID / Email Input */}
          <div>
            <label
              htmlFor="signin-username"
              className="block text-xs font-bold text-on-surface mb-1.5"
            >
              Username, Email, or Mobile Number
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                person
              </span>
              <input
                id="signin-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage('');
                }}
                placeholder={
                  selectedRole === 'customer'
                    ? 'Enter username (e.g. owais_patron) or email'
                    : selectedRole === 'worker'
                    ? 'Enter artisan username or registered mobile'
                    : 'Enter administrator username or email'
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">info</span>
              <span>Supports newly registered usernames and default demo profiles.</span>
            </p>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="signin-password"
                className="block text-xs font-bold text-on-surface"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setErrorMessage('Default demo passwords are listed above in the auto-fill card.')}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                lock
              </span>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter your account password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-surface-container"
              />
              <span className="text-xs font-medium text-on-surface">
                Remember this device for 30 days
              </span>
            </label>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2 border border-error/20">
              <span className="material-symbols-outlined text-[18px] text-error">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Sign In Button */}
          <button
            type="submit"
            id="btn-submit-signin"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-black tracking-wide transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>
                  Sign In as {selectedRole === 'customer' ? 'Patron Client' : selectedRole === 'worker' ? 'Artisan Worker' : 'Federation Admin'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-surface-container-lowest text-on-surface-variant font-medium">
              Don't have an account yet?
            </span>
          </div>
        </div>

        {/* Switch to Registration Page */}
        <div className="text-center">
          <button
            type="button"
            id="btn-goto-registration"
            onClick={() => onNavigateToRegister(selectedRole)}
            className="w-full py-3 px-4 rounded-xl border border-primary/30 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Create New Account (Registration)</span>
          </button>
          <p className="text-[11px] text-on-surface-variant mt-2">
            Register your custom username & password. Artisans can register with instant Aadhaar e-KYC.
          </p>
        </div>
      </div>

      {/* Footer Locality & Language bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-primary">
            location_on
          </span>
          <span>
            {currentLocation.name} ({currentLocation.wardNumber})
          </span>
          {onRequestGpsFix && (
            <button
              type="button"
              onClick={onRequestGpsFix}
              className="text-[11px] text-primary hover:underline font-bold ml-1 cursor-pointer"
            >
              Update GPS
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium">Language:</span>
          {(['en', 'te', 'hi'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange(lang)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                language === lang
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिंदी'}
            </button>
          ))}
        </div>
      </div>

      {/* Reset to 0 Parameter Bar */}
      <div className="mt-4 text-center">
        {resetFeedback ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold animate-fade-in">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>{resetFeedback}</span>
          </div>
        ) : (
          <button
            type="button"
            id="btn-reset-to-zero"
            onClick={handleResetToZero}
            className="text-[11px] text-on-surface-variant/80 hover:text-error transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            title="Wipe local storage and start fresh with 0 parameters for all domains"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            <span>Reset App to 0 Parameter Baseline (Fresh Application State)</span>
          </button>
        )}
      </div>

      {/* Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleOAuthOpen}
        onClose={() => setIsGoogleOAuthOpen(false)}
        targetRole={selectedRole}
        onSuccess={(googleUser, _token) => {
          setIsGoogleOAuthOpen(false);
          triggerTwoStepVerification(googleUser);
        }}
      />
    </div>
  );
};
