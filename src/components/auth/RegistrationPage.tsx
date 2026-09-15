/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, AppLanguage, AuthenticatedUser, CustomerLocation } from '../../types';
import { BRAND_LOGO_URL } from '../../data/mockData';
import { HYDERABAD_POPULAR_WARDS } from '../../data/hyderabadLocations';
import { saveRegisteredAccount, findAccount } from '../../utils/authStorage';
import { GoogleOAuthModal } from './GoogleOAuthModal';

interface RegistrationPageProps {
  onRegisterSuccess: (user: AuthenticatedUser, credentials: { username: string; password: string }) => void;
  onNavigateToSignIn: (prefillUsername?: string, prefillPassword?: string) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  currentLocation: CustomerLocation;
  onRequestGpsFix?: () => void;
  initialRole?: UserRole;
  onRegisterWorkerKyc?: (newWorker: any) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onRegisterSuccess,
  onNavigateToSignIn,
  language,
  onLanguageChange,
  currentLocation,
  onRequestGpsFix,
  initialRole = 'customer',
  onRegisterWorkerKyc,
}) => {
  // Role selection
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isGoogleOAuthOpen, setIsGoogleOAuthOpen] = useState(false);
  const [googleFilledNotice, setGoogleFilledNotice] = useState<string | null>(null);

  const handleGoogleOAuthSuccess = (googleUser: AuthenticatedUser) => {
    setIsGoogleOAuthOpen(false);
    setSelectedRole(googleUser.role);
    setFullName(googleUser.name);
    setEmail(googleUser.email);
    setUsername(googleUser.username);
    setPhone(googleUser.phone || '+91 98490 12345');
    setPassword('Google@Secure2026');
    setConfirmPassword('Google@Secure2026');
    setGoogleFilledNotice(
      `Profile loaded from Google OAuth (${googleUser.email}). Your password is set to Google@Secure2026. Review and submit below!`
    );
    setTimeout(() => setGoogleFilledNotice(null), 6000);
  };

  // Core Credentials (Requested: username and password)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Personal Profile
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Client-specific fields
  const [clientAddress, setClientAddress] = useState('Flat 402, Green Meadows');
  const [clientWard, setClientWard] = useState('Ward 8 (Jubilee Hills)');

  // Worker-specific fields (with Aadhaar e-KYC)
  const [workerTrade, setWorkerTrade] = useState('Master Electrician');
  const [workerExperience, setWorkerExperience] = useState('5');
  const [workerWard, setWorkerWard] = useState('Ward 8 (Jubilee Hills / Madhapur Hub)');
  const [workerSociety, setWorkerSociety] = useState('Hyderabad Urban Artisan Guild (#41)');
  const [aadhaarNumber, setAadhaarNumber] = useState('4829-1092-3841');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [aadhaarVerified, setAadhaarVerified] = useState(true);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);

  // Admin-specific fields
  const [adminDepartment, setAdminDepartment] = useState('Labour Welfare & Secretariat Desk');
  const [adminSecurityPasskey, setAdminSecurityPasskey] = useState('COOP-SEC-2026');

  // Terms & Validation state
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccessUser, setRegisteredSuccessUser] = useState<{
    user: AuthenticatedUser;
    username: string;
    password: string;
  } | null>(null);

  // Format Aadhaar with hyphens
  const handleAadhaarChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += raw[i];
    }
    setAadhaarNumber(formatted);
    if (formatted.length < 14) {
      setAadhaarVerified(false);
    }
  };

  // Simulate UIDAI OTP verification
  const handleVerifyAadhaar = () => {
    setAadhaarVerifying(true);
    setTimeout(() => {
      setAadhaarVerifying(false);
      setAadhaarVerified(true);
      setErrorMessage('');
    }, 600);
  };

  // Check username format & availability
  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
  const isUsernameTaken = !!cleanUsername && !!findAccount(cleanUsername);

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validate Username
    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMessage('Username must be at least 3 characters (e.g. anil_electrician or priya_patron).');
      return;
    }
    if (isUsernameTaken) {
      setErrorMessage(`Username "${cleanUsername}" is already registered. Please choose another username.`);
      return;
    }

    // 2. Validate Password
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    // 3. Validate Contact Details
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    // 4. Validate Role-Specific constraints
    if (selectedRole === 'worker') {
      const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        setErrorMessage('Worker registration requires a valid 12-digit Aadhaar UIDAI number.');
        return;
      }
      if (!aadhaarVerified) {
        setErrorMessage('Please verify your Aadhaar UIDAI number using the OTP verification button.');
        return;
      }
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Telangana Artisan Cooperative Charter to register.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const generatedId =
        selectedRole === 'customer'
          ? `CUST-${Date.now().toString().slice(-4)}`
          : selectedRole === 'worker'
          ? `TS-WRK-${Date.now().toString().slice(-4)}`
          : `ADMIN-${Date.now().toString().slice(-4)}`;

      const userEmail = email.trim() || `${cleanUsername}@telanganacoop.org`;
      const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');

      const newUser: AuthenticatedUser = {
        id: generatedId,
        name: fullName.trim(),
        username: cleanUsername,
        phone: `+91 ${cleanPhone.slice(-10)}`,
        email: userEmail,
        role: selectedRole,
        avatar:
          selectedRole === 'customer'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : selectedRole === 'worker'
            ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        designation:
          selectedRole === 'customer'
            ? 'Citizen Patron Member'
            : selectedRole === 'worker'
            ? `${workerTrade} (Guild Member)`
            : `${adminDepartment} Official`,
        locality:
          selectedRole === 'customer'
            ? `${clientAddress}, ${clientWard}`
            : selectedRole === 'worker'
            ? workerWard
            : 'Hyderabad Secretariat',
        ward: selectedRole === 'customer' ? clientWard : selectedRole === 'worker' ? workerWard : undefined,
        trade: selectedRole === 'worker' ? workerTrade : undefined,
        society: selectedRole === 'worker' ? workerSociety : undefined,
        experienceYears: selectedRole === 'worker' ? parseInt(workerExperience, 10) || 5 : undefined,
        aadhaarNumber: selectedRole === 'worker' ? `XXXX-XXXX-${cleanAadhaar.slice(-4)}` : undefined,
        aadhaarVerified: selectedRole === 'worker' ? true : undefined,
      };

      // Save to localStorage registered accounts
      saveRegisteredAccount({
        username: cleanUsername,
        password: password,
        user: newUser,
        registeredAt: new Date().toISOString(),
      });

      // If worker, also submit to Admin KYC queue
      if (selectedRole === 'worker' && onRegisterWorkerKyc) {
        onRegisterWorkerKyc({
          id: `VERIF-${Date.now().toString().slice(-4)}`,
          name: fullName.trim(),
          trade: workerTrade,
          society: workerSociety,
          aadhaarNumber: `XXXX-XXXX-${cleanAadhaar.slice(-4)}`,
          certificateName: `Aadhaar e-KYC Verified • ${workerExperience}+ Years Experience`,
          submittedDate: 'Just Now (Online Registration)',
          status: 'approved',
          avatar: newUser.avatar,
        });
      }

      setRegisteredSuccessUser({
        user: newUser,
        username: cleanUsername,
        password: password,
      });
    }, 450);
  };

  return (
    <div id="registration-page" className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Top Brand Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container-low border border-surface-container mb-3 shadow-2xs">
          <img
            src={BRAND_LOGO_URL}
            alt="HelPerzzz Logo"
            className="w-5 h-5 rounded-md object-contain"
          />
          <span className="text-xs font-black tracking-wide text-primary uppercase">
            New Member Registration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
          Create Your Account
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-md mx-auto">
          Register your custom username and secure password to join the Telangana Artisan & Doorstep Cooperative.
        </p>
      </div>

      {/* Navigation Switch Tabs: Sign In vs Register */}
      <div className="bg-surface-container-low p-1 rounded-2xl border border-surface-container flex items-center mb-6 shadow-2xs">
        <button
          type="button"
          id="tab-switch-to-signin"
          onClick={() => onNavigateToSignIn()}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          <span>Sign In</span>
        </button>
        <button
          type="button"
          id="tab-register-active"
          className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 bg-primary text-on-primary shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Register New Account</span>
        </button>
      </div>

      {/* Success Modal / Banner upon registration */}
      {registeredSuccessUser ? (
        <div className="bg-surface-container-lowest border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-md text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h2 className="text-xl font-black text-on-surface">Registration Completed!</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-md mx-auto">
            Your account for <strong className="text-on-surface">{registeredSuccessUser.user.name}</strong> has been registered with unique username:
          </p>

          <div className="my-5 p-4 bg-surface-container-low border border-surface-container rounded-2xl max-w-sm mx-auto text-left">
            <div className="flex justify-between items-center text-xs py-1 border-b border-surface-container">
              <span className="text-on-surface-variant font-medium">Registered Username:</span>
              <span className="font-mono font-bold text-primary">@{registeredSuccessUser.username}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 border-b border-surface-container">
              <span className="text-on-surface-variant font-medium">Account Role:</span>
              <span className="font-bold uppercase text-on-surface">{registeredSuccessUser.user.role}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1">
              <span className="text-on-surface-variant font-medium">Password:</span>
              <span className="font-mono text-on-surface">••••••••</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              type="button"
              id="btn-login-now-direct"
              onClick={() => onRegisterSuccess(registeredSuccessUser.user, { username: registeredSuccessUser.username, password: registeredSuccessUser.password })}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-black shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>Enter Dashboard Now</span>
            </button>
            <button
              type="button"
              id="btn-goto-signin-with-creds"
              onClick={() => onNavigateToSignIn(registeredSuccessUser.username, registeredSuccessUser.password)}
              className="flex-1 py-3 px-4 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Go to Sign In Page</span>
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form Card */
        <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 sm:p-8 shadow-sm">
          {/* Quick Sign Up With Google OAuth */}
          <div className="mb-6">
            <button
              type="button"
              id="btn-google-oauth-register"
              onClick={() => setIsGoogleOAuthOpen(true)}
              className="w-full py-3 px-4 rounded-2xl border border-surface-container bg-surface hover:bg-surface-container-low text-on-surface text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer hover:border-outline"
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
              <span>Quick Register with Google Account (OAuth 2.0)</span>
            </button>

            {googleFilledNotice && (
              <div className="mt-2.5 p-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>{googleFilledNotice}</span>
              </div>
            )}

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface-container-lowest text-on-surface-variant font-medium">
                  or register with custom credentials
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitRegistration} className="space-y-6">
            {/* Step 1: Select Role */}
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                1. Select Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    {
                      id: 'customer',
                      title: 'Client / Citizen',
                      subtitle: 'Book verified doorstep home services',
                      icon: 'person',
                    },
                    {
                      id: 'worker',
                      title: 'Artisan / Worker',
                      subtitle: 'Electrician, plumber with Aadhaar KYC',
                      icon: 'engineering',
                    },
                    {
                      id: 'admin',
                      title: 'Secretariat Admin',
                      subtitle: 'Municipal dispatch & governance',
                      icon: 'shield_person',
                    },
                  ] as const
                ).map((item) => {
                  const isSelected = selectedRole === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`reg-role-btn-${item.id}`}
                      onClick={() => {
                        setSelectedRole(item.id);
                        setErrorMessage('');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary font-bold shadow-2xs'
                          : 'border-surface-container bg-surface hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </div>
                      <div>
                        <div className="text-xs font-black truncate">{item.title}</div>
                        <div className="text-[10px] text-on-surface-variant/70 line-clamp-2 leading-tight mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Username and Password Credentials */}
            <div className="border-t border-surface-container pt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  2. Choose Username & Password
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username Input */}
                <div className="sm:col-span-2">
                  <label htmlFor="reg-username" className="block text-xs font-bold text-on-surface mb-1">
                    Username <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-mono font-bold">
                      @
                    </span>
                    <input
                      id="reg-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="e.g. anil_electrician, owais_patron, rajesh_plumbing"
                      className={`w-full pl-8 pr-10 py-2.5 rounded-xl bg-surface border text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
                        isUsernameTaken
                          ? 'border-error ring-1 ring-error'
                          : 'border-surface-container'
                      }`}
                      required
                    />
                    {cleanUsername.length >= 3 && !isUsernameTaken && (
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-[18px]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-1 text-on-surface-variant">
                    <span>Use lowercase letters, numbers, or underscores.</span>
                    {isUsernameTaken ? (
                      <span className="text-error font-bold">Username already taken</span>
                    ) : cleanUsername.length >= 3 ? (
                      <span className="text-emerald-600 font-bold">Username available</span>
                    ) : null}
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="reg-password" className="block text-xs font-bold text-on-surface mb-1">
                    Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-1">
                    {password.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            password.length < 6
                              ? 'bg-error'
                              : password.length < 10
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-semibold text-[10px]">
                          {password.length < 6 ? 'Too short' : password.length < 10 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-on-surface mb-1">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="Re-enter password"
                      className={`w-full pl-3 pr-10 py-2.5 rounded-xl bg-surface border text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-error ring-1 ring-error'
                          : 'border-surface-container'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="text-[10px] mt-1">
                    {confirmPassword && confirmPassword !== password && (
                      <span className="text-error font-bold">Passwords do not match</span>
                    )}
                    {confirmPassword && confirmPassword === password && (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check</span> Passwords match
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Personal & Contact Information */}
            <div className="border-t border-surface-container pt-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  3. Personal Information
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="reg-fullname" className="block text-xs font-bold text-on-surface mb-1">
                    Full Legal Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      selectedRole === 'customer'
                        ? 'e.g. Mohammed Owais'
                        : selectedRole === 'worker'
                        ? 'e.g. Ramesh Kumar Reddy'
                        : 'e.g. Dr. K. Srinivas Rao, IAS'
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-bold text-on-surface mb-1">
                    Mobile Number <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                      +91
                    </span>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold text-on-surface mb-1">
                    Email Address <span className="text-on-surface-variant font-normal">(Optional)</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Role-Specific Details */}
            {selectedRole === 'worker' && (
              <div className="border-t border-surface-container pt-5 bg-secondary-container/15 -mx-5 sm:-mx-8 px-5 sm:px-8 py-5 border-b border-secondary-container/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      4. Artisan Guild & Aadhaar e-KYC
                    </label>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                    Mandatory for Dispatch
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label htmlFor="worker-trade" className="block text-xs font-bold text-on-surface mb-1">
                      Trade Specialization
                    </label>
                    <select
                      id="worker-trade"
                      value={workerTrade}
                      onChange={(e) => setWorkerTrade(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Master Electrician">Master Electrician (Class A)</option>
                      <option value="Certified Plumber">Certified Plumber & Pipefitter</option>
                      <option value="HVAC / AC Specialist">HVAC & Inverter AC Specialist</option>
                      <option value="Master Carpenter">Master Carpenter & Joiner</option>
                      <option value="Home Appliance Technician">Home Appliance Technician</option>
                      <option value="Civil Mason & Tiler">Civil Mason & Tiler</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="worker-exp" className="block text-xs font-bold text-on-surface mb-1">
                      Years of Experience
                    </label>
                    <select
                      id="worker-exp"
                      value={workerExperience}
                      onChange={(e) => setWorkerExperience(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="3">3+ Years (Certified)</option>
                      <option value="5">5+ Years (Journeyman)</option>
                      <option value="8">8+ Years (Senior)</option>
                      <option value="12">12+ Years (Master Artisan)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="worker-ward" className="block text-xs font-bold text-on-surface mb-1">
                      Municipal Ward Hub
                    </label>
                    <select
                      id="worker-ward"
                      value={workerWard}
                      onChange={(e) => setWorkerWard(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {HYDERABAD_POPULAR_WARDS.map((loc) => (
                        <option key={loc.id} value={`${loc.wardNumber} (${loc.name})`}>
                          {loc.name} - {loc.wardNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Aadhaar UIDAI 12-digit input */}
                <div className="p-3.5 bg-surface rounded-2xl border border-surface-container shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="worker-aadhaar" className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">credit_card</span>
                      <span>12-Digit Aadhaar UIDAI Number</span>
                    </label>
                    {aadhaarVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        UIDAI e-KYC Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="worker-aadhaar"
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => handleAadhaarChange(e.target.value)}
                      placeholder="4829-1092-3841"
                      maxLength={14}
                      className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container font-mono text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {!aadhaarVerified ? (
                      <button
                        type="button"
                        onClick={handleVerifyAadhaar}
                        disabled={aadhaarVerifying}
                        className="px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer shrink-0"
                      >
                        {aadhaarVerifying ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAadhaarVerified(false)}
                        className="px-2.5 py-1.5 text-[11px] text-on-surface-variant hover:text-primary font-medium cursor-pointer"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1.5">
                    Protected by Government of Telangana Cooperative Welfare Trust. Masked as XXXX-XXXX-{aadhaarNumber.replace(/\D/g, '').slice(-4)}.
                  </p>
                </div>
              </div>
            )}

            {selectedRole === 'customer' && (
              <div className="border-t border-surface-container pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">home_pin</span>
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    4. Doorstep Address & GHMC Ward
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="client-ward" className="block text-xs font-bold text-on-surface mb-1">
                      Hyderabad Ward
                    </label>
                    <select
                      id="client-ward"
                      value={clientWard}
                      onChange={(e) => setClientWard(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {HYDERABAD_POPULAR_WARDS.map((w) => (
                        <option key={w.id} value={`${w.wardNumber} (${w.name})`}>
                          {w.name} - {w.wardNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="client-address" className="block text-xs font-bold text-on-surface mb-1">
                      Street / Villa / Apartment
                    </label>
                    <input
                      id="client-address"
                      type="text"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="e.g. Villa 14B, Road No. 36"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div className="border-t border-surface-container pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    4. Secretariat Authority Passkey
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="admin-dept" className="block text-xs font-bold text-on-surface mb-1">
                      Department
                    </label>
                    <input
                      id="admin-dept"
                      type="text"
                      value={adminDepartment}
                      onChange={(e) => setAdminDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-passkey" className="block text-xs font-bold text-on-surface mb-1">
                      Co-op Passkey
                    </label>
                    <input
                      id="admin-passkey"
                      type="password"
                      value={adminSecurityPasskey}
                      onChange={(e) => setAdminSecurityPasskey(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container text-on-surface text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="border-t border-surface-container pt-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary border-surface-container"
                />
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  I pledge adherence to the{' '}
                  <strong className="text-on-surface">Telangana Artisan Cooperative Federation Charter</strong>: 0% middleman exploitation, 85% fair worker cut, and ethical transparent doorstep services.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-semibold flex items-center gap-2 border border-error/20">
                <span className="material-symbols-outlined text-[18px] text-error">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Registration */}
            <button
              type="submit"
              id="btn-submit-registration"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-black tracking-wide transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
                  <span>Creating Cooperative Account...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  <span>Register Account & Save Credentials</span>
                </>
              )}
            </button>
          </form>

          {/* Already have an account? Go to Sign In */}
          <div className="mt-6 pt-5 border-t border-surface-container text-center">
            <p className="text-xs text-on-surface-variant mb-2">Already have an account registered?</p>
            <button
              type="button"
              id="btn-goto-signin-bottom"
              onClick={() => onNavigateToSignIn()}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In with Username & Password</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Locality & Language bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
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

      {/* Google OAuth Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleOAuthOpen}
        onClose={() => setIsGoogleOAuthOpen(false)}
        targetRole={selectedRole}
        onSuccess={handleGoogleOAuthSuccess}
      />
    </div>
  );
};
