/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole, AppLanguage, ViewMode, AuthenticatedUser } from '../../types';
import { BRAND_LOGO_URL } from '../../data/mockData';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  titleSuffix?: string;
  currentUser: AuthenticatedUser | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  viewMode,
  onToggleViewMode,
  titleSuffix = 'Federation Hub',
  currentUser,
  onOpenProfile,
  onLogout,
  onLoginClick,
  onRegisterClick,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(15,41,66,0.04)]">
      {/* Top Utility Belt on Desktop / Tablet */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 bg-surface-container-low text-xs border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[15px]">verified_user</span>
          <span className="font-semibold text-on-surface">Multi-State Labour Cooperative Federation Portal</span>
          <span className="text-outline-variant">•</span>
          <span className="text-secondary font-medium">Hyderabad Municipal District #TS-COOP-4102</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-surface-container p-0.5 rounded-full">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                language === 'en' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                language === 'hi' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                language === 'te' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Device Frame / Responsive Switcher */}
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-highest hover:bg-surface-container text-on-surface font-semibold transition-colors"
            title="Toggle between Mobile Handset Preview & Full Desktop Canvas"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {viewMode === 'mobile-frame' ? 'desktop_windows' : 'smartphone'}
            </span>
            <span>{viewMode === 'mobile-frame' ? 'Expand Desktop' : 'Mobile Shell'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Brand Logo & Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              alt="HelPerzzz Brand Logo"
              className="h-9 w-9 object-contain rounded-lg shadow-xs bg-surface-container-lowest p-0.5"
              src={BRAND_LOGO_URL}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary flex items-center justify-center text-on-primary text-[8px] border border-surface">
              ✓
            </span>
          </div>

          <div className="flex flex-col truncate">
            <span className="font-headline-md text-base sm:text-lg text-on-surface font-extrabold leading-tight truncate">
              HelPerzzz
            </span>
            <span className="font-label-sm text-xs text-primary flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="truncate">{titleSuffix}</span>
            </span>
          </div>
        </div>

        {/* Access Control Navigation:
            - If ADMIN: Only admin can access all three domains (Client, Worker, Admin).
            - If CLIENT: Shows single domain status + quick Profile trigger.
            - If WORKER: Shows single domain status.
            - If LOGGED OUT: Shows login prompt. */}
        {isAdmin ? (
          <div className="flex items-center gap-1.5">
            <div className="bg-surface-container-high p-1 rounded-full flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => onRoleChange('customer')}
                className={`py-1 px-2.5 sm:px-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'customer'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">person</span>
                <span>Client</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('worker')}
                className={`py-1 px-2.5 sm:px-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'worker'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">engineering</span>
                <span>Worker</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('admin')}
                className={`py-1 px-2.5 sm:px-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'admin'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                <span>Admin</span>
              </button>
            </div>
            <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
              Admin All-Domain Clearance
            </span>
          </div>
        ) : currentUser?.role === 'customer' ? (
          /* Client Single Domain Badge */
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary border border-primary/20 py-1 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="hidden sm:inline">Client Portal • Doorstep Services</span>
              <span className="sm:hidden">Client</span>
            </div>
            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden md:flex items-center gap-1 text-xs font-semibold text-primary hover:bg-surface-container py-1 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>My Profile</span>
            </button>
            {onLoginClick && (
              <button
                type="button"
                onClick={onLoginClick}
                className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container py-1 px-2 rounded-lg transition-colors cursor-pointer"
                title="Open Login & Role Switcher"
              >
                <span className="material-symbols-outlined text-[15px]">sync_alt</span>
                <span className="hidden sm:inline">Switch Role</span>
              </button>
            )}
          </div>
        ) : currentUser?.role === 'worker' ? (
          /* Worker Single Domain Badge */
          <div className="flex items-center gap-2">
            <div className="bg-secondary-container text-on-secondary-container py-1 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="material-symbols-outlined text-primary text-[15px]">engineering</span>
              <span className="hidden sm:inline">
                {currentUser.name} • {currentUser.trade || 'Master Electrician'}
              </span>
              <span className="sm:hidden">Worker Radar</span>
              {currentUser.aadhaarVerified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                  ✓ Aadhaar
                </span>
              )}
            </div>
            {onLoginClick && (
              <button
                type="button"
                onClick={onLoginClick}
                className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container py-1 px-2 rounded-lg transition-colors cursor-pointer"
                title="Open Login & Role Switcher"
              >
                <span className="material-symbols-outlined text-[15px]">sync_alt</span>
                <span className="hidden sm:inline">Switch Role</span>
              </button>
            )}
          </div>
        ) : (
          /* Logged out state with separate Sign In and Register buttons */
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign in with your username and password"
            >
              <span className="material-symbols-outlined text-[15px]">login</span>
              <span>Sign In</span>
            </button>
            {onRegisterClick && (
              <button
                type="button"
                onClick={onRegisterClick}
                className="px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="Create a new account with username and password"
              >
                <span className="material-symbols-outlined text-[15px]">person_add</span>
                <span className="hidden sm:inline">Register</span>
              </button>
            )}
          </div>
        )}

        {/* Right Status Badge & User Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Profile Avatar Trigger */}
              <button
                type="button"
                onClick={currentUser.role === 'customer' ? onOpenProfile : undefined}
                className={`flex items-center gap-1.5 p-1 rounded-full transition-all ${
                  currentUser.role === 'customer' ? 'hover:ring-2 hover:ring-primary cursor-pointer' : ''
                }`}
                title={currentUser.role === 'customer' ? 'Click to open Profile page' : currentUser.name}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-primary shadow-xs"
                />
                <span className="hidden md:block text-xs font-bold text-on-surface max-w-[110px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* Logout Button */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Sign Out / Switch Domain"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="hidden sm:inline text-[11px]">Sign Out</span>
                </button>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </div>
          )}

          {/* Quick Language Switch on Mobile */}
          <div className="sm:hidden flex items-center bg-surface-container p-0.5 rounded-full">
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en')}
              className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container-lowest text-primary uppercase"
            >
              {language}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
