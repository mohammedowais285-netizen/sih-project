/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClientProfile, CustomerLocation, SavedAddress, AppLanguage } from '../../types';
import { LiveTelemetry } from '../../hooks/useLiveLocationTracker';

interface UserProfileProps {
  profile: ClientProfile;
  currentLocation: CustomerLocation;
  telemetry: LiveTelemetry;
  onUpdateProfile: (updated: ClientProfile) => void;
  onRequestGpsFix: () => void;
  onSelectSavedAddress: (addr: SavedAddress) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  onTriggerToast: (msg: string) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  currentLocation,
  telemetry,
  onUpdateProfile,
  onRequestGpsFix,
  onSelectSavedAddress,
  onNavigateHome,
  onLogout,
  onTriggerToast,
  language,
  onLanguageChange,
}) => {
  // Form State initialized from profile
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    locality: profile.locality,
    wardNumber: profile.wardNumber,
    pinCode: profile.pinCode,
    emergencyContactName: profile.emergencyContactName,
    emergencyContactPhone: profile.emergencyContactPhone,
    smsAlerts: profile.preferences.smsAlerts,
    whatsappUpdates: profile.preferences.whatsappUpdates,
    safetyPinRequired: profile.preferences.safetyPinRequired,
    ecoFriendlyArtisans: profile.preferences.ecoFriendlyArtisans,
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(profile.savedAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Office' | 'Parents' | 'Other'>('Office');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrWard, setNewAddrWard] = useState('Ward 108 (Madhapur)');
  const [newAddrPin, setNewAddrPin] = useState('500081');

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onTriggerToast('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      onTriggerToast('Please enter a valid contact phone number');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updated: ClientProfile = {
        ...profile,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        locality: formData.locality,
        wardNumber: formData.wardNumber,
        pinCode: formData.pinCode,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        savedAddresses,
        preferences: {
          ...profile.preferences,
          language,
          smsAlerts: formData.smsAlerts,
          whatsappUpdates: formData.whatsappUpdates,
          safetyPinRequired: formData.safetyPinRequired,
          ecoFriendlyArtisans: formData.ecoFriendlyArtisans,
        },
      };

      onUpdateProfile(updated);
      setIsSaving(false);
      setHasUnsavedChanges(false);
      onTriggerToast('Profile & Doorstep credentials saved successfully!');
    }, 400);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      address: newAddrText.trim(),
      ward: newAddrWard,
      pinCode: newAddrPin,
      isPrimary: false,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    };

    const updatedList = [...savedAddresses, newAddr];
    setSavedAddresses(updatedList);
    setIsAddingAddress(false);
    setNewAddrText('');
    setHasUnsavedChanges(true);
    onTriggerToast(`Added "${newAddrLabel}" to saved doorsteps`);
  };

  const handleSetPrimaryAddress = (addrId: string) => {
    const updated = savedAddresses.map((a) => ({
      ...a,
      isPrimary: a.id === addrId,
    }));
    setSavedAddresses(updated);
    const selected = updated.find((a) => a.id === addrId);
    if (selected) {
      onSelectSavedAddress(selected);
      handleInputChange('address', selected.address);
      handleInputChange('wardNumber', selected.ward);
      handleInputChange('pinCode', selected.pinCode);
      onTriggerToast(`Set ${selected.label} as active doorstep!`);
    }
  };

  const handleDeleteAddress = (addrId: string) => {
    if (savedAddresses.length <= 1) {
      onTriggerToast('You must have at least one saved doorstep');
      return;
    }
    setSavedAddresses((prev) => prev.filter((a) => a.id !== addrId));
    setHasUnsavedChanges(true);
    onTriggerToast('Address removed');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-5 pb-24 animate-fadeIn">
      {/* Top Breadcrumb & Return Nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-container transition-colors py-1 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Doorstep Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>Single Client Domain</span>
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 text-xs font-bold text-error hover:bg-error-container/20 py-1 px-2.5 rounded-lg transition-colors"
            title="Sign out of customer portal"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container p-0.5 shadow-md">
              <img
                src={profile.avatar}
                alt={formData.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold border-2 border-surface">
              ✓
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-on-surface truncate">
                {formData.name || 'Client Citizen'}
              </h1>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Patron Member
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-primary">mail</span>
              <span className="truncate">{formData.email}</span>
              <span className="text-outline-variant">•</span>
              <span className="truncate">{formData.phone}</span>
            </p>
            <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
              <span className="truncate font-medium">{currentLocation.locality}, Hyderabad</span>
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-surface-container">
          <span className="text-[11px] text-on-surface-variant font-medium">Cooperative ID</span>
          <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/60 px-2 py-0.5 rounded">
            {profile.membershipId}
          </span>
          <span className="text-[10px] text-on-surface-variant/80 mt-0.5 hidden sm:block">
            Member since {profile.registeredDate}
          </span>
        </div>
      </div>

      {/* Cooperative Household Digital Pass */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg border border-slate-700">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-emerald-400 text-[22px]">verified_user</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                  Hyderabad Multi-State Labour Federation
                </span>
                <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Household Sovereign Protection Pass
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                0% Middleman Margin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Doorstep Orders</span>
              <span className="text-base font-bold text-white">{profile.totalBookings} Completed</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Direct Welfare Pool</span>
              <span className="text-base font-bold text-emerald-300">₹{profile.welfareContribution}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block uppercase">Patron Tier</span>
              <span className="text-base font-bold text-amber-300">Silver Patron</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Secured via TS Cooperative Registry #TS-COOP-4102</span>
            <span className="text-white font-mono">{formData.phone}</span>
          </div>
        </div>
      </div>

      {/* Live GPS Tracking Station Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Continuous GPS Tracking Station</h2>
              <p className="text-[11px] text-on-surface-variant">Live coordinate sync across all municipal dispatchers</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestGpsFix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container active:scale-98 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">my_location</span>
            <span>Calibrate GPS</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
            <span className="text-on-surface-variant">Tracked Coordinates:</span>
            <span className="font-mono font-bold text-primary">
              {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E
            </span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
            <span className="text-on-surface-variant">GPS Accuracy:</span>
            <span className="font-semibold text-on-surface">±{currentLocation.accuracyMeters || 5}m (High Precision)</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
            <span className="text-on-surface-variant">GHMC Municipal Zone:</span>
            <span className="font-semibold text-on-surface">{currentLocation.ghmcZone}</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
            <span className="text-on-surface-variant">Tracking Heartbeat:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{telemetry.lastUpdated}</span>
            </span>
          </div>
        </div>

        <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-xl flex items-center gap-2 border border-emerald-200">
          <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          <span>
            When you request emergency or scheduled artisans, dispatchers lock to these coordinates for sub-15 min ETA.
          </span>
        </div>
      </div>

      {/* Editable Profile Information Form */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <h2 className="text-sm font-bold text-on-surface">Client & Household Information</h2>
            </div>
            {hasUnsavedChanges && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                placeholder="Mohammed Owais"
                required
              />
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Primary Mobile Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                placeholder="mohammedowais285@gmail.com"
                required
              />
            </div>

            {/* Doorstep PIN Code */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Postal PIN Code (Hyderabad)
              </label>
              <input
                type="text"
                value={formData.pinCode}
                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium font-mono"
                placeholder="500033"
              />
            </div>
          </div>

          {/* Current Doorstep Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Primary Doorstep Street Address
              </label>
              <button
                type="button"
                onClick={() => handleInputChange('address', currentLocation.address)}
                className="text-[11px] text-primary font-bold hover:underline"
              >
                Use Tracked GPS Address
              </button>
            </div>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium resize-none"
              placeholder="Villa 14B, Road No. 36, Jubilee Hills, Hyderabad"
            />
          </div>

          {/* Emergency SOS Contact Section */}
          <div className="pt-2 border-t border-surface-container space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-error">
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>Emergency SOS Guardian / Alternate Contact</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-on-surface-variant font-medium mb-1">
                  Guardian / Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  placeholder="Fatima Owais (Spouse)"
                />
              </div>
              <div>
                <label className="block text-[11px] text-on-surface-variant font-medium mb-1">
                  Guardian Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  placeholder="+91 94401 23456"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Doorsteps Manager */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">home_work</span>
              <h2 className="text-sm font-bold text-on-surface">Saved Doorstep Locations</h2>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">{isAddingAddress ? 'close' : 'add'}</span>
              <span>{isAddingAddress ? 'Cancel' : 'Add New Doorstep'}</span>
            </button>
          </div>

          {/* New address form */}
          {isAddingAddress && (
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container space-y-2.5 animate-fadeIn">
              <div className="flex gap-2">
                {(['Home', 'Office', 'Parents', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewAddrLabel(lbl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      newAddrLabel === lbl
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={newAddrText}
                onChange={(e) => setNewAddrText(e.target.value)}
                placeholder="Full address (e.g. Floor 6, Cyber Heights, Sector 2, Madhapur)"
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newAddrWard}
                  onChange={(e) => setNewAddrWard(e.target.value)}
                  placeholder="Ward (e.g. Ward 108)"
                  className="px-3 py-1.5 text-xs rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface"
                />
                <input
                  type="text"
                  value={newAddrPin}
                  onChange={(e) => setNewAddrPin(e.target.value)}
                  placeholder="PIN code (e.g. 500081)"
                  className="px-3 py-1.5 text-xs rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleAddAddress}
                className="w-full py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold"
              >
                Save Location
              </button>
            </div>
          )}

          {/* List of saved addresses */}
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  addr.isPrimary
                    ? 'bg-primary-fixed/40 border-primary text-on-surface'
                    : 'bg-surface-container-low border-surface-container hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      addr.isPrimary ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {addr.label === 'Home' ? 'home' : addr.label === 'Office' ? 'apartment' : 'pin_drop'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{addr.label}</span>
                      {addr.isPrimary && (
                        <span className="text-[10px] bg-primary text-on-primary px-1.5 py-0.2 rounded font-bold">
                          Primary Doorstep
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{addr.address}</p>
                    <p className="text-[10px] text-outline truncate">
                      {addr.ward} • PIN {addr.pinCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!addr.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryAddress(addr.id)}
                      className="text-[11px] font-bold text-primary hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="w-7 h-7 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center transition-colors"
                    title="Remove address"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Service Preferences */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">security</span>
            <h2 className="text-sm font-bold text-on-surface">Preferences & Safety Verification</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Preferred Language */}
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
              <div>
                <span className="font-bold block">Preferred Language</span>
                <span className="text-[11px] text-on-surface-variant">For SMS dispatch alerts & voice IVR</span>
              </div>
              <div className="flex gap-1">
                {(['en', 'hi', 'te'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onLanguageChange(l)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      language === l ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety PIN */}
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
              <div>
                <span className="font-bold block">Digital Doorstep PIN Clearance</span>
                <span className="text-[11px] text-on-surface-variant">
                  Technician must verify 4-digit OTP before crossing your threshold
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.safetyPinRequired}
                onChange={(e) => handleInputChange('safetyPinRequired', e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {/* WhatsApp Updates */}
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
              <div>
                <span className="font-bold block">WhatsApp Live Tracking Route</span>
                <span className="text-[11px] text-on-surface-variant">
                  Receive live map tracking link & worker photo on WhatsApp
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.whatsappUpdates}
                onChange={(e) => handleInputChange('whatsappUpdates', e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            {/* Eco-Friendly Artisans */}
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl">
              <div>
                <span className="font-bold block">Green Fleet & EV Priority</span>
                <span className="text-[11px] text-on-surface-variant">
                  Prefer artisans commuting via electric mopeds / metro corridors
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.ecoFriendlyArtisans}
                onChange={(e) => handleInputChange('ecoFriendlyArtisans', e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Floating Save Action Bar */}
        <div className="sticky bottom-16 sm:bottom-4 z-30 bg-surface/95 backdrop-blur-md p-3 rounded-2xl border border-surface-container shadow-lg flex items-center justify-between gap-3">
          <div className="text-xs">
            {hasUnsavedChanges ? (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>You have unsaved edits</span>
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Profile synchronized</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container active:scale-98 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
