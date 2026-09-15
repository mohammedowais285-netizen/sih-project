/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  AppLanguage,
  ViewMode,
  WorkerProfile,
  CustomerLocation,
  AuthenticatedUser,
  ClientProfile,
} from './types';
import { NEARBY_WORKERS } from './data/mockData';
import { DEFAULT_CUSTOMER_LOCATION } from './data/hyderabadLocations';
import { DEFAULT_CLIENT_PROFILE, DEFAULT_AUTHENTICATED_USERS } from './data/defaultProfile';
import { useLiveLocationTracker } from './hooks/useLiveLocationTracker';

import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { UnifiedLogin } from './components/auth/UnifiedLogin';
import { UserProfile } from './components/customer/UserProfile';
import { CustomerHome } from './components/customer/CustomerHome';
import { BookingModal } from './components/customer/BookingModal';
import { EmergencyModal } from './components/customer/EmergencyModal';
import { CustomerBookings } from './components/customer/CustomerBookings';
import { CoopView } from './components/customer/CoopView';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // Application Language & View Mode
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [viewMode, setViewMode] = useState<ViewMode>('responsive');

  // Real-Time Live Location Tracking across Hyderabad
  const {
    currentLocation,
    telemetry,
    requestGpsFix,
    setExplicitLocation,
  } = useLiveLocationTracker();

  // Authentication State
  // Default to null so user enters login details and selects what they are (worker, admin, client)
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const saved = localStorage.getItem('helperzzz_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Auth Page Mode: separate 'signin' page vs separate 'register' page
  const [authPageMode, setAuthPageMode] = useState<'signin' | 'register'>('signin');

  // Client Profile State
  const [clientProfile, setClientProfile] = useState<ClientProfile>(() => {
    try {
      const saved = localStorage.getItem('helperzzz_client_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CLIENT_PROFILE;
  });

  // Current active domain role
  // Restricted: Client can only view 'customer', Worker can only view 'worker'. Only Admin can access all 3!
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'customer';
  });

  // Navigation tab for Customer domain
  const [customerTab, setCustomerTab] = useState<'home' | 'bookings' | 'coop' | 'profile' | 'account'>('home');

  // Booking & Emergency states
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<WorkerProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLiveTrackingMode, setIsLiveTrackingMode] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState('Electric Shock');

  // Global notification toast
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3500);
  };

  // Sync role whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      // If current role is not allowed for this user, force their assigned role
      if (currentUser.role !== 'admin') {
        setCurrentRole(currentUser.role);
      }
      try {
        localStorage.setItem('helperzzz_current_user', JSON.stringify(currentUser));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem('helperzzz_current_user');
    }
  }, [currentUser]);

  // Handle Role Change with strict Access Control:
  // "only admin can access all three domains. and worker and client can access individually"
  const handleRoleChange = (targetRole: UserRole) => {
    if (!currentUser) {
      triggerToast('Please authenticate first to access cooperative domains.');
      return;
    }

    if (currentUser.role === 'admin') {
      // Admin has super-clearance to all 3 domains
      setCurrentRole(targetRole);
      triggerToast(
        `Admin Clearance: Switched to ${
          targetRole === 'customer'
            ? 'Client Doorstep'
            : targetRole === 'worker'
            ? 'Worker Dispatch'
            : 'Federation Secretariat'
        } domain.`
      );
    } else if (currentUser.role === targetRole) {
      setCurrentRole(targetRole);
    } else {
      triggerToast(
        `Access Denied: ${currentUser.role.toUpperCase()} accounts cannot switch to the ${targetRole.toUpperCase()} domain. Only Federation Administrators possess multi-domain clearance.`
      );
    }
  };

  // Login handler
  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setCustomerTab('home');
    triggerToast(`Welcome, ${user.name}! Authenticated as ${user.role.toUpperCase()}.`);
  };

  // New Worker KYC registration notification
  const handleRegisterWorkerKyc = (newWorker: any) => {
    triggerToast(`Aadhaar KYC verified for ${newWorker.name}! Welcome to ${newWorker.society}.`);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Logged out securely. Session ended.');
  };

  // Update client profile handler
  const handleUpdateProfile = (updated: ClientProfile) => {
    setClientProfile(updated);
    try {
      localStorage.setItem('helperzzz_client_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
    // Update currentUser name & phone as well
    if (currentUser && currentUser.role === 'customer') {
      const updatedUser: AuthenticatedUser = {
        ...currentUser,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        locality: updated.locality || updated.address,
      };
      setCurrentUser(updatedUser);
    }
    triggerToast('Citizen profile and doorstep preferences updated successfully.');
  };

  // Open booking modal
  const handleSelectWorker = (worker: WorkerProfile) => {
    setSelectedWorkerForBooking(worker);
    setIsLiveTrackingMode(false);
    setIsBookingModalOpen(true);
  };

  // Open live tracking directly
  const handleOpenLiveTracking = () => {
    setSelectedWorkerForBooking(NEARBY_WORKERS[0]);
    setIsLiveTrackingMode(true);
    setIsBookingModalOpen(true);
  };

  // Open emergency modal
  const handleTriggerEmergency = (type: string) => {
    setEmergencyType(type);
    setIsEmergencyModalOpen(true);
  };

  const handleConfirmEmergency = (type: string) => {
    triggerToast(`Emergency Dispatch Broadcasted for ${type}! SLA: 15 Mins Guaranteed.`);
    setSelectedWorkerForBooking(NEARBY_WORKERS[0]);
    setIsLiveTrackingMode(true);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (worker: WorkerProfile, service: string, time: string) => {
    setIsBookingModalOpen(false);
    triggerToast(`Booked ${worker.name} for ${service} (${time}). Order #HP-9104 active!`);
  };

  // Synchronize customer location change
  const handleCustomerLocationChange = (newLoc: CustomerLocation) => {
    setExplicitLocation(newLoc);
    triggerToast(`Doorstep locked: ${newLoc.name} (${newLoc.latitude.toFixed(4)}° N, ${newLoc.longitude.toFixed(4)}° E)`);
  };

  // Compute title suffix based on current active view
  const titleSuffix =
    currentRole === 'customer'
      ? customerTab === 'profile' || customerTab === 'account'
        ? 'Citizen Profile'
        : 'Client Doorstep'
      : currentRole === 'worker'
      ? 'Artisan Dispatch Deck'
      : 'Federation Command';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Global Header with Role-Based Domain Switching */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={setLanguage}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'responsive' ? 'mobile-frame' : 'responsive')}
        titleSuffix={titleSuffix}
        currentUser={currentUser}
        onOpenProfile={() => {
          if (currentUser?.role === 'customer') {
            setCustomerTab('profile');
          } else {
            triggerToast('Profile editing is enabled for Client accounts.');
          }
        }}
        onLogout={handleLogout}
        onLoginClick={() => {
          setCurrentUser(null);
          setAuthPageMode('signin');
        }}
        onRegisterClick={() => {
          setCurrentUser(null);
          setAuthPageMode('register');
        }}
      />

      {/* Main Container / Responsive Viewport */}
      <main className="flex-1 flex flex-col items-center justify-start w-full py-2">
        <div
          className={`w-full transition-all duration-300 ${
            viewMode === 'mobile-frame'
              ? 'max-w-[420px] min-h-[840px] my-3 rounded-[38px] border-[8px] border-surface-container-highest shadow-2xl overflow-hidden relative bg-surface'
              : 'max-w-7xl mx-auto'
          }`}
        >
          {/* Mobile device speaker bar (if framed) */}
          {viewMode === 'mobile-frame' && (
            <div className="w-full flex justify-center pt-2 pb-1 bg-surface-container-lowest border-b border-surface-container/40">
              <div className="w-16 h-1 rounded-full bg-surface-container-highest" />
            </div>
          )}

          {/* If user is logged out, present the separate Sign In or Registration Page */}
          {!currentUser ? (
            <UnifiedLogin
              key={authPageMode}
              initialMode={authPageMode}
              language={language}
              onLanguageChange={setLanguage}
              onLogin={handleLoginSuccess}
              currentLocation={currentLocation}
              onRequestGpsFix={requestGpsFix}
              onRegisterWorkerKyc={handleRegisterWorkerKyc}
            />
          ) : (
            <>
              {/* DOMAIN 1: CLIENT / CUSTOMER */}
              {currentRole === 'customer' && (
                <>
                  {(customerTab === 'profile' || customerTab === 'account') ? (
                    <UserProfile
                      profile={clientProfile}
                      onUpdateProfile={handleUpdateProfile}
                      currentLocation={currentLocation}
                      telemetry={telemetry}
                      onRequestGpsFix={requestGpsFix}
                      onLogout={handleLogout}
                      onBack={() => setCustomerTab('home')}
                      language={language}
                      onLanguageChange={setLanguage}
                    />
                  ) : customerTab === 'bookings' ? (
                    <CustomerBookings
                      onSelectWorker={handleSelectWorker}
                      onOpenLiveTracking={handleOpenLiveTracking}
                    />
                  ) : customerTab === 'coop' ? (
                    <CoopView />
                  ) : (
                    <CustomerHome
                      onSelectWorker={handleSelectWorker}
                      onTriggerEmergency={handleTriggerEmergency}
                      onOpenLiveTracking={handleOpenLiveTracking}
                      customerLocation={currentLocation}
                      onUpdateCustomerLocation={handleCustomerLocationChange}
                      onOpenProfile={() => setCustomerTab('profile')}
                    />
                  )}
                </>
              )}

              {/* DOMAIN 2: GIG WORKER PARTNER */}
              {currentRole === 'worker' && (
                <WorkerDashboard
                  onAcceptJob={(jobId) => {
                    triggerToast(`Emergency Dispatch ${jobId} accepted! Municipal route locked.`);
                  }}
                  currentLocation={currentLocation}
                />
              )}

              {/* DOMAIN 3: FEDERATION ADMIN */}
              {currentRole === 'admin' && (
                <AdminDashboard
                  onLogout={handleLogout}
                  currentLocation={currentLocation}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Persistent Bottom Navigation (Shown only for Client domain when logged in) */}
      {currentUser && currentRole === 'customer' && (
        <BottomNav
          activeTab={customerTab === 'profile' ? 'account' : customerTab}
          onSelectTab={(tab) => {
            if (tab === 'emergency') {
              handleTriggerEmergency('Electric Shock');
            } else if (tab === 'dispatch') {
              handleOpenLiveTracking();
            } else if (tab === 'services' || tab === 'home') {
              setCustomerTab('home');
            } else if (tab === 'bookings') {
              setCustomerTab('bookings');
            } else if (tab === 'co-op' || tab === 'coop') {
              setCustomerTab('coop');
            } else if (tab === 'account') {
              setCustomerTab('account');
            }
          }}
          onTabChange={(tab) => {
            if (tab === 'emergency') {
              handleTriggerEmergency('Electric Shock');
            } else if (tab === 'dispatch') {
              handleOpenLiveTracking();
            } else if (tab === 'services' || tab === 'home') {
              setCustomerTab('home');
            } else if (tab === 'bookings') {
              setCustomerTab('bookings');
            } else if (tab === 'co-op' || tab === 'coop') {
              setCustomerTab('coop');
            } else if (tab === 'account') {
              setCustomerTab('account');
            }
          }}
          hasActiveDispatch={true}
        />
      )}

      {/* Interactive Booking & Live Tracking Modal */}
      <BookingModal
        worker={selectedWorkerForBooking}
        isOpen={isBookingModalOpen}
        isLiveTracking={isLiveTrackingMode}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
        customerLocation={currentLocation}
      />

      {/* Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        defaultType={emergencyType}
        onClose={() => setIsEmergencyModalOpen(false)}
        onConfirmSos={handleConfirmEmergency}
        customerLocation={currentLocation}
      />

      {/* Global Toast Notification */}
      {globalToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-surface-container-high">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{globalToast}</span>
        </div>
      )}
    </div>
  );
}
