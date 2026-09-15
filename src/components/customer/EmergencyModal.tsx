import React, { useState } from 'react';
import { CustomerLocation } from '../../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: string;
  onConfirmSos: (type: string, note: string) => void;
  customerLocation?: CustomerLocation | null;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'Electric Shock',
  onConfirmSos,
  customerLocation,
}) => {
  const [selectedEmergency, setSelectedEmergency] = useState(defaultType);
  const [notes, setNotes] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  if (!isOpen) return null;

  const emergencies = [
    { id: 'Electric Shock', icon: 'bolt', action: 'Immediate Cutoff', desc: 'Main breaker sparking or exposed line' },
    { id: 'Burst Pipe', icon: 'water_damage', action: 'Isolation Seal', desc: 'Flooding risk or ruptured municipal line' },
    { id: 'Gas Leak', icon: 'mode_heat', action: 'HazMat Trained', desc: 'LPG cylinder odor or stove valve fail' },
    { id: 'Door Lockout', icon: 'lock_open', action: 'ID Verified Lock', desc: 'Child/elder inside, rapid non-destructive entry' },
  ];

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastDone(true);
      setTimeout(() => {
        onConfirmSos(selectedEmergency, notes);
        setBroadcastDone(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border-2 border-tertiary overflow-hidden flex flex-col relative">
        {/* Urgent Pulsating Siren Header */}
        <div className="bg-tertiary text-on-tertiary p-4 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-2.5 z-10">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-on-tertiary"></span>
            </span>
            <div>
              <h3 className="font-headline-md text-base font-extrabold uppercase tracking-wide">
                Rapid SOS Guild Dispatch
              </h3>
              <p className="font-label-sm text-xs text-on-tertiary/90">
                15-Minute Guaranteed Arrival SLA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-on-tertiary/20 text-on-tertiary flex items-center justify-center hover:bg-on-tertiary/30 transition-colors z-10"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-3.5">
          {/* Location Verification */}
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container flex items-center gap-2.5 text-xs">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0">location_on</span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                Dispatch Target Doorstep (Hyderabad GHMC)
              </span>
              <span className="font-bold text-on-surface truncate block">
                {customerLocation ? customerLocation.address : 'Villa 14B, Road No. 36, Jubilee Hills (Ward 8)'}
              </span>
              <span className="text-[10px] font-mono text-primary block">
                {customerLocation
                  ? `${customerLocation.latitude.toFixed(4)}° N, ${customerLocation.longitude.toFixed(4)}° E • PIN ${customerLocation.pinCode}`
                  : '17.4319° N, 78.4073° E • PIN 500033'}
              </span>
            </div>
          </div>

          {/* Emergency Type Selector */}
          <div>
            <label className="font-label-md text-xs font-bold text-on-surface block mb-1.5">
              Select Emergency Hazard
            </label>
            <div className="grid grid-cols-2 gap-2">
              {emergencies.map((e) => {
                const isSelected = selectedEmergency === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setSelectedEmergency(e.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary ring-2 ring-tertiary/50'
                        : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[20px]">{e.icon}</span>
                      <span className="text-[10px] font-bold uppercase">{e.action}</span>
                    </div>
                    <span className="text-xs font-bold">{e.id}</span>
                    <span className="text-[10px] opacity-80 leading-none">{e.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="font-label-md text-xs font-bold text-on-surface block mb-1">
              Specific Hazard / Landmark Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Smoke visible in hall distribution box"
              className="w-full h-10 px-3 bg-surface-container-low text-xs rounded-xl border border-surface-container text-on-surface focus:outline-none focus:bg-surface-container"
            />
          </div>

          {/* Rapid Safety Guidelines */}
          <div className="bg-error-container/40 p-2.5 rounded-xl border border-error-container text-xs text-on-error-container space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
              <span>Immediate Pre-Arrival Instructions:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If safe, switch off main MCB breaker or water inlet valve. Maintain 3-meter clearance from exposed surfaces.
            </p>
          </div>

          {/* Dispatch CTA Button */}
          <button
            type="button"
            onClick={handleBroadcast}
            disabled={isBroadcasting || broadcastDone}
            className="w-full h-12 bg-tertiary hover:bg-tertiary-container text-on-tertiary rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            {isBroadcasting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Broadcasting to Nearest 3 Guild Artisans...</span>
              </>
            ) : broadcastDone ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Ramesh Kumar Accepted • ETA 8 Mins!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">siren</span>
                <span>Broadcast Emergency Signal • ₹199 Base</span>
              </>
            )}
          </button>

          {/* Co-op Speed Dial */}
          <div className="text-center pt-1">
            <a
              href="tel:18004192667"
              className="text-xs text-on-surface-variant hover:text-primary inline-flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>Need Telephone Dispatcher? Call 1800-419-COOP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
