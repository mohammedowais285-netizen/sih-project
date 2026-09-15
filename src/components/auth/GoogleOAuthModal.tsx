/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthenticatedUser, UserRole } from '../../types';
import { DEFAULT_AUTHENTICATED_USERS, DEFAULT_CLIENT_PROFILE } from '../../data/defaultProfile';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthenticatedUser, oauthToken: string) => void;
  targetRole?: UserRole;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRole = 'customer',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<'primary' | 'artisan' | 'work'>('primary');

  if (!isOpen) return null;

  const accounts = [
    {
      id: 'primary',
      name: 'Mohammed Owais',
      email: 'mohammedowais285@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Google Account • Primary',
      recommendedRole: 'customer' as UserRole,
    },
    {
      id: 'artisan',
      name: 'Ramesh Kumar (Artisan)',
      email: 'ramesh.artisan@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArkEIb8owwJnrwrbTTBUtlA8oUK2Fw0YpAIdxUXKmMqv6wQ5dvhn0fCxCOSdbvoQ65Jl02b0AUCTG26HskFAugF3wJVuadzgsbCs0GGviVkGtrBD2CV9gqQtQY1C82oZM2Egvt8zU1P-mpPehWESMletfOUcAgT8JM0GaCRbcQfcz158ZBtqluClZ_hmCpQJdK_mtQgMLkleiVNnI8ZzYDKBGnnIZFI8XTSOmCEN0weIiWQcdun6Le2g',
      badge: 'Google Workspace • Artisan Guild',
      recommendedRole: 'worker' as UserRole,
    },
    {
      id: 'work',
      name: 'Dr. K. Srinivas Rao, IAS',
      email: 'registrar.telanganacoop@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'Google Enterprise • Secretariat',
      recommendedRole: 'admin' as UserRole,
    },
  ];

  const handleSelectAndAuthorize = () => {
    setIsProcessing(true);
    const chosen = accounts.find((a) => a.id === selectedAccount) || accounts[0];
    const roleToAssign: UserRole = targetRole || chosen.recommendedRole;

    setTimeout(() => {
      setIsProcessing(false);
      const simulatedOAuthToken = `ya29.a0AfH6SM_${Math.random().toString(36).slice(2, 12)}_${Date.now()}`;

      const user: AuthenticatedUser = {
        id: `oauth-g-${chosen.id}-${Date.now().toString().slice(-4)}`,
        name: chosen.name,
        username: chosen.email.split('@')[0],
        email: chosen.email,
        phone: '+91 98765 43210',
        role: roleToAssign,
        avatar: chosen.avatar,
        designation:
          roleToAssign === 'customer'
            ? 'Verified Google Patron'
            : roleToAssign === 'worker'
            ? 'Master Electrician (Google Auth)'
            : 'Cooperative Registrar',
        locality: 'Jubilee Hills, Circle 18 (Hyderabad)',
        ward: 'Ward 8 (Jubilee Hills)',
        aadhaarVerified: roleToAssign === 'worker',
      };

      onSuccess(user, simulatedOAuthToken);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-surface-container relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
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
          <div>
            <h2 className="text-base font-black text-on-surface">Sign in with Google</h2>
            <p className="text-xs text-on-surface-variant">OAuth 2.0 Single Sign-On Handshake</p>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
          Choose a Google Account to authenticate with the <strong>HelPerzzz Cooperative Portal</strong>. Two-step verification will secure your domain access.
        </p>

        {/* Accounts List */}
        <div className="space-y-2 mb-5">
          {accounts.map((acc) => {
            const isSelected = selectedAccount === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedAccount(acc.id as any)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-surface-container bg-surface hover:bg-surface-container-low'
                }`}
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-10 h-10 rounded-full object-cover border border-surface-container shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface truncate">{acc.name}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono truncate">
                    {acc.email}
                  </div>
                  <div className="text-[10px] text-primary font-semibold mt-0.5">{acc.badge}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* OAuth Permissions details */}
        <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container text-[11px] text-on-surface-variant space-y-1 mb-5">
          <div className="flex items-center gap-1.5 font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-[14px]">security</span>
            <span>Requested Scopes:</span>
          </div>
          <p>• openid, profile, email (OAuth 2.0 Auth Code flow)</p>
          <p>• Google Authenticator OTP verification handshake</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSelectAndAuthorize}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span>Continue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
