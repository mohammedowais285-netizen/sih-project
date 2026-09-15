import React, { useState, useEffect } from 'react';
import { INITIAL_JOB_REQUEST, SCHEDULED_ACTIVITIES } from '../../data/mockData';
import { CustomerLocation } from '../../types';
import { DEFAULT_CUSTOMER_LOCATION } from '../../data/hyderabadLocations';
import { WorkerDispatchMap } from './WorkerDispatchMap';

interface WorkerDashboardProps {
  onAcceptJob?: (jobId: string) => void;
  currentLocation?: CustomerLocation;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  onAcceptJob,
  currentLocation = DEFAULT_CUSTOMER_LOCATION,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [countdown, setCountdown] = useState(18);
  const [jobState, setJobState] = useState<'pending' | 'accepted' | 'passed'>('pending');
  const [earnings, setEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(420);
  const [completedCount, setCompletedCount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (jobState === 'pending' && isOnline) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setJobState('passed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [jobState, isOnline]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAcceptJob = () => {
    setJobState('accepted');
    setEarnings((prev) => prev + 420);
    setPendingEarnings(0);
    setCompletedCount((prev) => prev + 1);
    showToast('Job Accepted! Turn-by-turn navigation launched to Green Meadows Apt 304');
    if (onAcceptJob) onAcceptJob(INITIAL_JOB_REQUEST.id);
  };

  const handlePassJob = () => {
    setJobState('passed');
    showToast('Job distributed to next cooperative member. Rotational equity preserved.');
  };

  const job = INITIAL_JOB_REQUEST;

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Role Context Bar & Status Pill */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold shadow-xs">
          <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            handshake
          </span>
          <span>Labour Co-op Federation #41</span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-on-surface-variant">
            {currentLocation.wardNumber || 'Ward 8 (Jubilee Hills, Hyderabad)'}
          </span>
        </div>
      </div>

      {/* Profile & Duty Switch Header */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-xs border-2 border-primary-fixed">
            <img
              className="w-full h-full object-cover"
              alt="Ramesh Kumar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArkEIb8owwJnrwrbTTBUtlA8oUK2Fw0YpAIdxUXKmMqv6wQ5dvhn0fCxCOSdbvoQ65Jl02b0AUCTG26HskFAugF3wJVuadzgsbCs0GGviVkGtrBD2CV9gqQtQY1C82oZM2Egvt8zU1P-mpPehWESMletfOUcAgT8JM0GaCRbcQfcz158ZBtqluClZ_hmCpQJdK_mtQgMLkleiVNnI8ZzYDKBGnnIZFI8XTSOmCEN0weIiWQcdun6Le2g"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-on-primary text-[10px]">
              ✓
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-headline-md text-base sm:text-lg font-bold text-on-surface truncate">
                Ramesh Kumar
              </h1>
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant truncate">
              Master Electrician • Society #41 (Hyderabad Urban)
            </p>

            <div className="flex items-center gap-2 mt-1 text-xs">
              <div className="inline-flex items-center gap-1 text-on-tertiary-fixed bg-tertiary-fixed px-2 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-[13px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span>4.94</span>
              </div>
              <span className="text-on-surface-variant font-medium">420+ audits done</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Duty Switcher */}
        <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOnline ? 'bg-primary-fixed text-primary' : 'bg-surface-container-high text-outline'}`}>
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="font-label-lg text-xs sm:text-sm font-bold text-on-surface truncate">
                {isOnline ? 'ONLINE - Ready for Dispatch' : 'PAUSED - Resting Period'}
              </span>
              <span className={`font-label-sm text-[11px] truncate ${isOnline ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                {isOnline ? 'Instant priority dispatching in Ward 12' : 'Duty paused • Dispatch queue on hold'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 focus:outline-none p-1 shrink-0 flex items-center cursor-pointer ${
              isOnline ? 'bg-primary' : 'bg-surface-variant'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center transition-all duration-300 transform ${
                isOnline ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <span className="material-symbols-outlined text-primary text-[14px]">
                {isOnline ? 'wifi' : 'wifi_off'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">Today's Earnings</span>
            <div className="w-7 h-7 rounded-full bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">payments</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-headline-lg-mobile text-lg sm:text-xl font-bold text-on-surface">
              ₹{earnings}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-primary font-label-sm text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+₹{pendingEarnings} pending</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">Jobs Completed</span>
            <div className="w-7 h-7 rounded-full bg-secondary-container/50 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[16px]">task_alt</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-headline-lg-mobile text-lg sm:text-xl font-bold text-on-surface">
              {completedCount} <span className="text-on-surface-variant text-xs font-normal">/ 5 goal</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-on-surface-variant font-label-sm text-xs font-medium">
              <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
              <span>4.5 hrs on field</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Fair Wage Floor */}
        <div className="col-span-2 bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-surface-container flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[22px]">balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-xs sm:text-sm font-bold text-on-surface truncate">
                  Co-op Wage Floor Index
                </span>
                <span className="bg-primary text-on-primary font-label-sm text-[10px] px-2 py-0.2 rounded-full font-bold">
                  100%
                </span>
              </div>
              <span className="font-body-sm text-xs text-on-surface-variant truncate">
                Direct 0% deduction • ₹320/hr municipal mandate met
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary text-[24px] shrink-0">verified_user</span>
        </div>
      </div>

      {/* INCOMING / ACTIVE EMERGENCY DISPATCH CARD */}
      {isOnline && jobState === 'pending' && (
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md border-2 border-tertiary/60 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-tertiary"></div>

          {/* Top Badge Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              <span>EMERGENCY DISPATCH</span>
            </div>

            <div className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface">
              <span className="material-symbols-outlined text-[15px] text-tertiary animate-spin" style={{ animationDuration: '3s' }}>
                timer
              </span>
              <span className="font-label-sm text-xs font-bold text-tertiary">{countdown}s</span>
            </div>
          </div>

          {/* Emergency Fault Details */}
          <div>
            <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-tight">
              {job.title}
            </h2>
            <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-error">warning</span>
              <span>{job.description}</span>
            </p>
          </div>

          {/* Customer & Route Micro Map Preview */}
          <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-surface-container-highest"
                  alt={job.customerName}
                  src={job.customerAvatar}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-xs sm:text-sm font-bold text-on-surface truncate">
                    {job.customerName}
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant truncate">
                    {job.distance} • {job.transitTime}
                  </span>
                </div>
              </div>

              <a
                aria-label="Call Customer"
                className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 hover:bg-primary-fixed-dim"
                href={`tel:${job.customerPhone}`}
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs bg-surface-container-lowest px-2.5 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">location_on</span>
              <span className="truncate font-semibold text-on-surface">{job.customerAddress}</span>
            </div>

            {/* Hyderabad Worker Dispatch & Navigation Radar Map */}
            <div className="w-full">
              <WorkerDispatchMap
                currentLocation={currentLocation}
                destinationName={job.customerName}
                destinationAddress={job.customerAddress}
                optimalRouteText={job.optimalRouteText}
                distance={job.distance}
                eta={job.transitTime}
                isOnline={isOnline}
              />
            </div>
          </div>

          {/* Financial Payout Breakdown */}
          <div className="flex items-center justify-between bg-primary-fixed/40 px-3 py-2 rounded-xl border border-primary-fixed">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] text-on-surface-variant">
                Guaranteed Member Payout
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-lg-mobile text-lg font-bold text-primary">₹{job.payout}</span>
                <span className="font-label-sm text-xs text-primary font-semibold">100% Direct to You</span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-primary font-label-sm text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                <span className="material-symbols-outlined text-[12px]">savings</span> 0% Co-op Cut
              </span>
              <p className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Municipal base rate</p>
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAcceptJob}
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">navigation</span>
              <span>Accept & Start Navigation</span>
            </button>

            <button
              type="button"
              onClick={handlePassJob}
              className="w-full h-10 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">shuffle</span>
              <span>Pass to Next Co-op Brother/Sister (Balanced Distribution)</span>
            </button>
          </div>
        </div>
      )}

      {/* ACCEPTED ACTIVE JOB CARD */}
      {jobState === 'accepted' && (
        <div className="bg-primary-fixed/30 rounded-xl p-4 border border-primary space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              En Route to Emergency Task
            </span>
            <span className="text-xs font-bold text-on-surface">ETA: 4 Mins</span>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-on-surface">{job.customerName}</span>
              <span className="text-primary font-bold">₹{job.payout} (Escrow Secured)</span>
            </div>
            <p className="text-xs text-on-surface-variant">{job.customerAddress}</p>
            <div className="flex gap-2 pt-1">
              <a
                href={`tel:${job.customerPhone}`}
                className="flex-1 py-2 rounded-lg bg-surface-container text-center text-xs font-bold"
              >
                Call Customer
              </a>
              <button
                onClick={() => {
                  setJobState('pending');
                  showToast('Service completed and marked closed on guild ledger.');
                }}
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs"
              >
                Mark Arrived & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {jobState === 'passed' && (
        <div className="bg-surface-container-low rounded-xl p-4 text-center border border-surface-container space-y-1">
          <span className="material-symbols-outlined text-primary text-[28px]">people</span>
          <p className="text-xs font-bold text-on-surface">Job Reallocated to Next Available Co-op Member</p>
          <p className="text-[11px] text-on-surface-variant">
            Thank you for fair dispatch adherence. Your standing remains 100%.
          </p>
          <button
            onClick={() => {
              setJobState('pending');
              setCountdown(18);
            }}
            className="text-xs font-bold text-primary hover:underline pt-1 block mx-auto"
          >
            Reset Demo Job
          </button>
        </div>
      )}

      {/* Today's Schedule & Activity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
            Today's Schedule & Activity
          </h3>
          <span className="font-label-sm text-xs text-primary font-bold">Ward Roster</span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col gap-4">
          {SCHEDULED_ACTIVITIES.map((act, index) => (
            <div key={act.id} className="flex items-start gap-3 relative">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    act.type === 'completed'
                      ? 'bg-primary-fixed text-primary'
                      : 'bg-secondary-container text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {act.type === 'completed' ? 'check_circle' : 'schedule'}
                  </span>
                </div>
                {index === 0 && <div className="w-0.5 h-10 bg-surface-container-high my-1" />}
              </div>

              <div className="flex flex-col min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-lg text-xs sm:text-sm font-bold text-on-surface truncate">
                    {act.title}
                  </span>
                  <span className="font-label-sm text-xs font-bold text-primary shrink-0">
                    {act.price}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">{act.time}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded text-[11px] font-semibold">
                    {act.tag}
                  </span>
                  {act.rating && (
                    <span className="text-on-surface-variant text-[11px]">• {act.rating} ★ Rating</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worker Welfare & Solidarity */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">security</span>
            </div>
            <div>
              <h3 className="font-headline-md text-xs sm:text-sm font-bold text-on-surface">
                Worker Welfare & Solidarity
              </h3>
              <p className="font-label-sm text-[11px] text-on-surface-variant">
                HelPerzzz Co-op Federation Guarantee
              </p>
            </div>
          </div>
          <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                health_and_safety
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-on-surface truncate">On-Duty Medical & Accident Cover</span>
                <span className="text-on-surface-variant text-[11px] truncate">
                  Universal coverage up to ₹2,00,000
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">verified</span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                account_balance
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-on-surface truncate">Automated Evening UPI Clearance</span>
                <span className="text-on-surface-variant text-[11px] truncate">
                  8:00 PM auto-credit to SBI A/c ...4810
                </span>
              </div>
            </div>
            <span className="text-secondary text-[11px] font-bold shrink-0">On Schedule</span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0">gavel</span>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-on-surface truncate">
                  Peer Tribunal & Grievance Redressal
                </span>
                <span className="text-on-surface-variant text-[11px] truncate">
                  0 active disputes • No algorithmic penalization
                </span>
              </div>
            </div>
            <span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded">
              Clear
            </span>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-fade-in border border-surface-container-high">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
