import React, { useState } from 'react';
import { ServiceCategory, WorkerProfile, ActiveJobRequest, CustomerLocation } from '../../types';
import { SERVICE_CATEGORIES, NEARBY_WORKERS } from '../../data/mockData';
import { DEFAULT_CUSTOMER_LOCATION, HYDERABAD_POPULAR_WARDS } from '../../data/hyderabadLocations';
import { HyderabadLocationModal } from './HyderabadLocationModal';
import { HyderabadInteractiveMap } from './HyderabadInteractiveMap';

interface CustomerHomeProps {
  onSelectWorker: (worker: WorkerProfile) => void;
  onTriggerEmergency: (emergencyType: string) => void;
  onOpenLiveTracking: () => void;
  activeDispatch?: ActiveJobRequest | null;
  customerLocation?: CustomerLocation;
  onUpdateCustomerLocation?: (loc: CustomerLocation) => void;
  onOpenProfile?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onSelectWorker,
  onTriggerEmergency,
  onOpenLiveTracking,
  activeDispatch,
  customerLocation: propCustomerLocation,
  onUpdateCustomerLocation,
  onOpenProfile,
}) => {
  const [internalLocation, setInternalLocation] = useState<CustomerLocation>(DEFAULT_CUSTOMER_LOCATION);
  const activeLocation = propCustomerLocation || internalLocation;

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [showWardMenu, setShowWardMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isCallingWorker, setIsCallingWorker] = useState(false);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3500);
  };

  const handleLocationChange = (newLoc: CustomerLocation) => {
    setInternalLocation(newLoc);
    onUpdateCustomerLocation?.(newLoc);
  };

  // Filter workers based on search & category
  const filteredWorkers = NEARBY_WORKERS.filter((w) => {
    const matchesSearch =
      searchQuery === '' ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.subTrade?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (selectedCategory === 'electrician' && w.trade.toLowerCase().includes('electrician')) ||
      (selectedCategory === 'deep-clean' && w.trade.toLowerCase().includes('clean')) ||
      (selectedCategory === 'carpenter' && w.trade.toLowerCase().includes('wood') || w.trade.toLowerCase().includes('carpenter'));

    return matchesSearch && matchesCategory;
  });

  const handleCall = () => {
    setIsCallingWorker(true);
    setTimeout(() => {
      setIsCallingWorker(false);
      showToast('Connecting to Ramesh K. via HelPerzzz encrypted VoIP line (+91 98490 28141)...');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Location Selector & Notification Pill */}
      <div className="flex items-center justify-between gap-3 relative">
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-1.5 w-full bg-surface-container-low p-1 rounded-2xl border border-surface-container">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 flex-1 min-w-0 py-1 px-2.5 rounded-xl hover:bg-surface-container active:scale-98 transition-all text-left"
              title="Click to change Hyderabad doorstep or detect GPS"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-[11px] text-primary font-bold leading-none">
                    Hyderabad Doorstep
                  </span>
                  <span className="text-[9px] bg-primary-fixed text-on-primary-fixed px-1.5 py-0.2 rounded font-mono font-bold">
                    {activeLocation.latitude.toFixed(4)}° N, {activeLocation.longitude.toFixed(4)}° E
                  </span>
                </div>
                <span className="font-label-lg text-xs sm:text-sm text-on-surface truncate font-bold">
                  {activeLocation.address}
                </span>
              </div>
            </button>

            {/* Quick wards dropdown trigger */}
            <button
              type="button"
              onClick={() => setShowWardMenu(!showWardMenu)}
              className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface shrink-0"
              title="Quick Hyderabad Ward List"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showWardMenu ? 'expand_less' : 'tune'}
              </span>
            </button>
          </div>

          {/* Dropdown Menu for Wards */}
          {showWardMenu && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-highest p-2 z-30 space-y-1">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Hyderabad Municipal Localities
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowWardMenu(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">map</span>
                  <span>Full Map & GPS</span>
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1">
                {HYDERABAD_POPULAR_WARDS.map((ward) => (
                  <button
                    key={ward.id}
                    type="button"
                    onClick={() => {
                      handleLocationChange(ward);
                      setShowWardMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      activeLocation.id === ward.id
                        ? 'bg-primary-fixed/50 text-primary font-bold'
                        : 'hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="truncate block font-semibold">{ward.name}</span>
                      <span className="text-[10px] text-on-surface-variant truncate block">
                        {ward.wardNumber} • {ward.ghmcZone} ({ward.latitude.toFixed(4)}° N, {ward.longitude.toFixed(4)}° E)
                      </span>
                    </div>
                    {activeLocation.id === ward.id && (
                      <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenProfile && (
            <button
              aria-label="My Profile"
              className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors border border-surface-container shadow-xs"
              type="button"
              onClick={onOpenProfile}
              title="Open Citizen Profile"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          )}

          <button
            aria-label="Notifications"
            className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors border border-surface-container relative cursor-pointer"
            type="button"
            onClick={() => showToast('Cooperative Bulletin: Monsoon electric grid maintenance scheduled for 5:00 PM – 8:00 PM in Ward 12.')}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error"></span>
          </button>
        </div>
      </div>

      {/* Search Input Bar with Voice Icon */}
      <div className="relative flex items-center w-full shadow-xs rounded-xl bg-surface-container-lowest border border-surface-container">
        <span className="material-symbols-outlined absolute left-3 text-outline text-[22px] pointer-events-none">
          search
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search electrician, plumber, cleaner, carpenter..."
          className="w-full h-12 pl-11 pr-11 bg-transparent text-on-surface font-body-md text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-low rounded-xl transition-colors"
        />
        <button
          aria-label="Voice Search"
          onClick={() => {
            setSearchQuery('electrician emergency');
          }}
          className="absolute right-2 w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary-fixed/30 active:scale-90 transition-transform"
          title="Simulate Voice Prompt Search"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
        </button>
      </div>

      {/* HIGH-PRIORITY EMERGENCY DISPATCH BANNER */}
      <div className="relative overflow-hidden rounded-xl bg-tertiary-container text-on-tertiary-container p-4 sm:p-5 shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-on-tertiary"></span>
            </span>
            <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-tertiary-fixed">
              Rapid SOS Guarantee
            </span>
          </div>

          <span className="font-label-sm text-xs bg-on-tertiary/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">timer</span> 15 Min Arrival
          </span>
        </div>

        <div className="mt-1">
          <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-tertiary leading-snug">
            Doorstep Emergency Dispatch
          </h2>
          <p className="font-body-sm text-xs sm:text-sm text-on-tertiary/90 mt-0.5">
            Instant mutual-aid sirens routed to certified nearby guild workers.
          </p>
        </div>

        {/* Quick Emergency Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          <button
            type="button"
            onClick={() => onTriggerEmergency('Electric Shock')}
            className="flex items-center gap-2 p-2 rounded-lg bg-on-tertiary/15 hover:bg-on-tertiary/25 active:scale-95 text-left transition-all backdrop-blur-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-error flex items-center justify-center text-on-error shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-xs font-bold block text-on-tertiary truncate">Electric Shock</span>
              <span className="font-label-sm text-on-tertiary/80 text-[10px] block leading-none">Immediate Cutoff</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTriggerEmergency('Burst Pipe')}
            className="flex items-center gap-2 p-2 rounded-lg bg-on-tertiary/15 hover:bg-on-tertiary/25 active:scale-95 text-left transition-all backdrop-blur-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-on-secondary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">water_damage</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-xs font-bold block text-on-tertiary truncate">Burst Pipe</span>
              <span className="font-label-sm text-on-tertiary/80 text-[10px] block leading-none">Isolation Seal</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTriggerEmergency('Gas Leak')}
            className="flex items-center gap-2 p-2 rounded-lg bg-on-tertiary/15 hover:bg-on-tertiary/25 active:scale-95 text-left transition-all backdrop-blur-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-tertiary flex items-center justify-center text-on-tertiary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">mode_heat</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-xs font-bold block text-on-tertiary truncate">Gas Leak</span>
              <span className="font-label-sm text-on-tertiary/80 text-[10px] block leading-none">HazMat Trained</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTriggerEmergency('Door Lockout')}
            className="flex items-center gap-2 p-2 rounded-lg bg-on-tertiary/15 hover:bg-on-tertiary/25 active:scale-95 text-left transition-all backdrop-blur-xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-inverse-surface flex items-center justify-center text-inverse-on-surface shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-xs font-bold block text-on-tertiary truncate">Door Lockout</span>
              <span className="font-label-sm text-on-tertiary/80 text-[10px] block leading-none">ID Verified Lock</span>
            </div>
          </button>
        </div>
      </div>

      {/* ACTIVE LIVE DISPATCH CARD (Screen 2 feature) */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-sm text-xs text-primary font-bold uppercase tracking-wide">
              Live Dispatch #HP-9104
            </span>
          </div>

          <div className="flex items-center gap-1 bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-label-sm text-xs font-bold">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            <span>8 mins ETA</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="relative shrink-0">
            <img
              className="w-14 h-14 rounded-full object-cover bg-surface-container border-2 border-primary-fixed"
              alt="Ramesh Kumar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClGX2ZRSIvx93yyA_ZIiQfP6juTkIJo5CYZUZq4bW6nTvnBqmV-ZAefI9_8WkZ44I_ons3vcUKmNAoZyTR-h4Vcfdec9ppbVF129Pa9byXHZqOWxKZEeo-yCo196gu3cTzkghWYXiSR9yrclCVuWaKeEXM6m3YVK9Qr0PMK8cPFJvIfCsZc1OyMcRciFZXFiWOQVMRQEK9KOePft9ohVAei2zeGPZWNhe6CxrfWJdswHlz5R9L8e4ZdA"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[10px]">electric_bolt</span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface truncate">
                Ramesh K.
              </h3>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-[11px] font-label-sm px-2 py-0.5 rounded-full font-semibold">
                Society #41
              </span>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant truncate">
              Master Electrician • En Route (Indiranagar)
            </p>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-tertiary">star</span>
              <span className="font-label-sm text-xs font-bold text-on-surface">4.94</span>
              <span className="text-outline text-xs font-label-sm">• 1,420 jobs completed</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
          <button
            type="button"
            onClick={handleCall}
            disabled={isCallingWorker}
            className="h-10 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>{isCallingWorker ? 'Calling...' : 'Direct Line'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenLiveTracking}
            className="h-10 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">navigation</span>
            <span>Track Live</span>
          </button>
        </div>
      </div>

      {/* COOPERATIVE GUILDS CATEGORIES (8 Guild Cards) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
              Cooperative Guilds
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Standardized rate card • Zero surge pricing
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`flex flex-col items-center p-2 rounded-xl text-center shadow-xs border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary-container text-on-primary border-primary ring-2 ring-primary/40'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1 ${
                    isSelected ? 'bg-primary-fixed text-on-primary-fixed' : `${cat.bgClass} ${cat.textClass}`
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                </div>
                <span className={`font-label-sm text-xs font-bold truncate w-full ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
                  {cat.title}
                </span>
                <span
                  className={`font-label-sm text-[11px] font-semibold mt-0.5 ${
                    isSelected ? 'text-on-primary/90' : 'text-primary'
                  }`}
                >
                  from ₹{cat.startingPrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NEARBY COOPERATIVE WORKERS (List / Map View) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="min-w-0">
            <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface truncate">
              Verified Workers Nearby
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Vetted by local residential federation • {filteredWorkers.length} available
            </p>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center bg-surface-container p-0.5 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'list'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_agenda</span>
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="w-full h-72 rounded-xl overflow-hidden shadow-xs relative mb-3 border border-surface-container">
            <HyderabadInteractiveMap
              customerLocation={activeLocation}
              workers={filteredWorkers}
              onSelectWorker={onSelectWorker}
              interactive={true}
            />
          </div>
        )}

        {/* Worker Cards Stack */}
        <div className="space-y-2.5">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="p-3 sm:p-4 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex flex-col gap-2 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      className="w-12 h-12 rounded-full object-cover bg-surface-container border border-surface-container-highest"
                      alt={worker.name}
                      src={worker.avatar}
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-headline-md text-sm font-bold text-on-surface truncate">
                        {worker.name}
                      </span>
                      <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                    </div>

                    <span className="font-body-sm text-xs text-on-surface-variant block truncate">
                      {worker.society}
                    </span>

                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="flex items-center text-tertiary font-bold">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        <span>{worker.rating}</span>
                      </span>
                      <span className="text-outline">• {worker.completedJobs} orders</span>
                      <span className="text-primary font-bold">• {worker.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-label-sm text-[10px] text-on-surface-variant block">Base</span>
                  <span className="font-headline-md text-base font-bold text-primary">
                    ₹{worker.basePrice}
                  </span>
                </div>
              </div>

              {/* Badges & Action */}
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {worker.badges.slice(0, 2).map((badge, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container-low text-on-surface-variant text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectWorker(worker)}
                  className="h-9 px-3.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-xs font-bold active:scale-95 transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Book Doorstep</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY HELPERZZZ TRUST BANNER */}
      <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
          </div>
          <div>
            <h3 className="font-headline-md text-sm sm:text-base font-bold leading-tight text-on-secondary-container">
              Why HelPerzzz?
            </h3>
            <p className="font-label-sm text-xs text-on-secondary-container/80">
              Fair wages • Transparent pricing • Mutual accountability
            </p>
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="p-2 rounded-lg bg-surface-container-lowest/80 backdrop-blur-xs flex flex-col justify-center">
            <span className="font-headline-md text-base sm:text-lg font-extrabold text-primary">0%</span>
            <span className="font-label-sm text-[11px] font-semibold text-on-surface leading-tight mt-0.5">
              Exploitative Cuts
            </span>
          </div>

          <div className="p-2 rounded-lg bg-surface-container-lowest/80 backdrop-blur-xs flex flex-col justify-center">
            <span className="font-headline-md text-base sm:text-lg font-extrabold text-primary">85%</span>
            <span className="font-label-sm text-[11px] font-semibold text-on-surface leading-tight mt-0.5">
              Direct to Worker
            </span>
          </div>

          <div className="p-2 rounded-lg bg-surface-container-lowest/80 backdrop-blur-xs flex flex-col justify-center">
            <span className="font-headline-md text-base sm:text-lg font-extrabold text-primary">100%</span>
            <span className="font-label-sm text-[11px] font-semibold text-on-surface leading-tight mt-0.5">
              State Insured
            </span>
          </div>
        </div>

        <p className="font-body-sm text-xs text-on-secondary-container/90 leading-relaxed">
          Every service booked directly funds the Hyderabad Labour Federation Welfare Pool, healthcare premiums, and apprentice toolkits.
        </p>
      </div>

      {/* Hyderabad Doorstep & GPS Geolocation Modal */}
      <HyderabadLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={activeLocation}
        onSelectLocation={handleLocationChange}
        workers={filteredWorkers}
      />

      {/* In-app Toast Banner */}
      {localToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-surface-container-high animate-fade-in max-w-[90vw]">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">info</span>
          <span className="truncate">{localToast}</span>
        </div>
      )}
    </div>
  );
};
