/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, AppLanguage, AuthenticatedUser, CustomerLocation } from '../../types';
import { SignInPage } from './SignInPage';
import { RegistrationPage } from './RegistrationPage';
import { TwoStepVerification } from './TwoStepVerification';

interface UnifiedLoginProps {
  onLogin: (user: AuthenticatedUser) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  currentLocation: CustomerLocation;
  onRequestGpsFix?: () => void;
  onRegisterWorkerKyc?: (newWorker: any) => void;
  initialMode?: 'signin' | 'register';
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({
  onLogin,
  language,
  onLanguageChange,
  currentLocation,
  onRequestGpsFix,
  onRegisterWorkerKyc,
  initialMode = 'signin',
}) => {
  // Page mode: 'signin' (Separate Sign In page) | 'register' (Separate Registration page)
  const [authMode, setAuthMode] = useState<'signin' | 'register'>(initialMode);
  const [prefillUsername, setPrefillUsername] = useState('');
  const [prefillPassword, setPrefillPassword] = useState('');
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [registerRole, setRegisterRole] = useState<UserRole>('customer');
  const [twoStepUser, setTwoStepUser] = useState<AuthenticatedUser | null>(null);

  const handleNavigateToRegister = (role?: UserRole) => {
    if (role) setRegisterRole(role);
    setSuccessNotification(null);
    setAuthMode('register');
  };

  const handleNavigateToSignIn = (username?: string, password?: string) => {
    if (username) setPrefillUsername(username);
    if (password) setPrefillPassword(password);
    if (username && password) {
      setSuccessNotification(`You can now sign in with username: ${username}`);
    }
    setAuthMode('signin');
  };

  const handleRegisterSuccess = (
    user: AuthenticatedUser,
    _credentials: { username: string; password: string }
  ) => {
    // Route newly registered account through 2-Step verification
    setTwoStepUser(user);
  };

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
    <div className="w-full">
      {authMode === 'signin' ? (
        <SignInPage
          onLogin={onLogin}
          onNavigateToRegister={handleNavigateToRegister}
          language={language}
          onLanguageChange={onLanguageChange}
          currentLocation={currentLocation}
          onRequestGpsFix={onRequestGpsFix}
          prefillUsername={prefillUsername}
          prefillPassword={prefillPassword}
          successNotification={successNotification}
        />
      ) : (
        <RegistrationPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToSignIn={handleNavigateToSignIn}
          language={language}
          onLanguageChange={onLanguageChange}
          currentLocation={currentLocation}
          onRequestGpsFix={onRequestGpsFix}
          initialRole={registerRole}
          onRegisterWorkerKyc={onRegisterWorkerKyc}
        />
      )}
    </div>
  );
};
