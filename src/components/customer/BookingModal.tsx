import React, { useState, useEffect } from 'react';
import { WorkerProfile, CustomerLocation } from '../../types';

interface BookingModalProps {
  worker: WorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (worker: WorkerProfile, serviceName: string, scheduledTime: string) => void;
  isLiveTracking?: boolean;
  customerLocation?: CustomerLocation | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  worker,
  isOpen,
  onClose,
  onConfirmBooking,
  isLiveTracking = false,
  customerLocation,
}) => {
  const [selectedTask, setSelectedTask] = useState('Standard Inspection & Repair');
  const [scheduledTime, setScheduledTime] = useState('Immediate (Under 15 Mins)');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'escrow'>('upi');
  const [trackingStep, setTrackingStep] = useState(2); // 0: Created, 1: Assigned, 2: On the Way, 3: Arrived, 4: Completed
  const [etaMinutes, setEtaMinutes] = useState(7);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isServiceDone, setIsServiceDone] = useState(false);
  const [chatNotice, setChatNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isLiveTracking && trackingStep === 2) {
      const timer = setInterval(() => {
        setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isLiveTracking, trackingStep]);

  if (!isOpen || !worker) return null;

  const basePrice = worker.basePrice || 199;
  const workerCut = Math.round(basePrice * 0.85);
  const welfareCut = Math.round(basePrice * 0.10);
  const platformCut = Math.round(basePrice * 0.05);

  const steps = [
    { title: 'Booking Created', desc: 'Received by Federation Guild Dispatcher', time: '11:15 AM' },
    { title: 'Worker Assigned', desc: `${worker.name} accepted with 0% penalty`, time: '11:16 AM' },
    { title: 'On The Way', desc: 'En route via Jubilee Hills Checkpost & Road 36', time: 'ETA 7 min' },
    { title: 'Arrived at Doorstep', desc: 'Digital OTP clearance required', time: 'Pending' },
    { title: 'Service Completed', desc: 'Direct UPI escrow settlement', time: 'Pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-surface-container max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 border-b border-surface-container flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              {isLiveTracking ? 'navigation' : 'handyman'}
            </span>
            <div>
              <h3 className="font-headline-md text-base font-bold text-on-surface">
                {isLiveTracking ? 'Live Doorstep Tracking' : 'Book Doorstep Artisan'}
              </h3>
              <p className="font-label-sm text-xs text-primary font-semibold">
                {worker.society}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {/* Worker Snapshot Banner */}
          <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex items-center gap-3">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary-fixed shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-headline-md text-base font-bold text-on-surface truncate">
                  {worker.name}
                </h4>
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {worker.trade}
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                {worker.subTrade || 'Certified Cooperative Guildsman'}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-tertiary font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  {worker.rating}
                </span>
                <span className="text-outline">• {worker.completedJobs} completed jobs</span>
                <span className="text-primary font-bold">• {worker.distance}</span>
              </div>
            </div>
          </div>

          {/* LIVE TRACKING TIMELINE (If in tracking mode) */}
          {isLiveTracking ? (
            <div className="space-y-3">
              {/* Map Route Simulation Card */}
              <div className="relative h-44 rounded-xl overflow-hidden shadow-xs border border-surface-container">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAm8Qlbsn-cFzEKUwOqjmVpMjC3wWa8SmgeNExQzqlXCiYARhpFa7tIrhoSt9gP2OnBGhp3KNV7xqHKdk4FB_3_jx8hFPs1tEc7Bm-ez_cDAmXrp6Qpz0rV_vnmfNq94mT7YGHXZ4KHDgBJ_N3ZNyMYFW5XIPRwfXEZMg8Sxvo2e970MFUh54p3Od1mMfAbLtUXKgAVhRzscyXJl6TAQWSbgoF5nrX57SBEr86-INZ8J7n7O5c6uR5oQ')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-primary/15 pointer-events-none"></div>

                <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs text-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="font-bold text-on-surface">Arriving in ~{etaMinutes} mins</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/90 backdrop-blur-md p-2 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                    <span>{customerLocation ? customerLocation.address : 'Villa 14B, Road No. 36, Jubilee Hills (Ward 8)'}</span>
                  </span>
                  <button
                    onClick={() => setTrackingStep(trackingStep < 4 ? trackingStep + 1 : 4)}
                    className="text-[11px] bg-primary text-on-primary font-bold px-2 py-0.5 rounded shadow-xs shrink-0"
                  >
                    Simulate Step
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                  Federation Dispatch Timeline
                </span>
                {steps.map((s, idx) => {
                  const isDone = idx < trackingStep;
                  const isCurrent = idx === trackingStep;
                  return (
                    <div key={idx} className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone
                              ? 'bg-primary text-on-primary'
                              : isCurrent
                              ? 'bg-primary-fixed text-on-primary-fixed ring-2 ring-primary'
                              : 'bg-surface-container-high text-outline'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`w-0.5 h-6 my-0.5 ${isDone ? 'bg-primary' : 'bg-surface-container-high'}`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                            {s.title}
                          </span>
                          <span className="text-outline text-[11px]">{s.time}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant truncate">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Communication Actions */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${worker.phone || '+919849028141'}`}
                  className="h-11 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Call {worker.name}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setChatNotice(`Direct cooperative chat channel opened with ${worker.name}.`)}
                  className="h-11 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Send In-App Message</span>
                </button>
              </div>

              {chatNotice && (
                <div className="p-2.5 bg-secondary-container/40 text-on-secondary-container rounded-lg text-xs font-semibold flex items-center justify-between border border-secondary-container">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">forum</span>
                    <span>{chatNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatNotice(null)}
                    className="text-on-secondary-container/60 hover:text-on-secondary-container"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Complete Service & Feedback */}
              {trackingStep >= 3 && !isServiceDone && (
                <div className="bg-primary-fixed/30 p-3 rounded-xl border border-primary-fixed flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-primary-fixed">
                    Service in Progress at Doorstep
                  </span>
                  <button
                    onClick={() => setIsServiceDone(true)}
                    className="w-full h-10 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container"
                  >
                    Mark Job as Completed & Pay ₹{basePrice}
                  </button>
                </div>
              )}

              {isServiceDone && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-primary space-y-2 text-center">
                  <span className="material-symbols-outlined text-primary text-[36px]">check_circle</span>
                  <h4 className="font-headline-md text-base font-bold text-on-surface">
                    Payment of ₹{basePrice} Settled via UPI
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    ₹{workerCut} credited instantly to {worker.name} • ₹{welfareCut} to Bangalore Labour Pool
                  </p>
                  <div className="flex justify-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-xl ${star <= rating ? 'text-tertiary' : 'text-outline-variant'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write a warm note for fellow co-op member..."
                    className="w-full px-3 py-1.5 bg-surface-container-lowest text-xs rounded-lg border border-surface-container"
                  />
                  <button
                    onClick={onClose}
                    className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
                  >
                    Submit Review & Close
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* BOOKING CONFIGURATION FORM */
            <div className="space-y-3">
              {/* Task Options */}
              <div>
                <label className="font-label-md text-xs font-bold text-on-surface block mb-1.5">
                  Select Required Task
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    'Standard Inspection & Repair',
                    'Comprehensive Installation / Overhaul (+₹150)',
                    'Emergency Fault Isolation & Safety Cutoff (+₹100)',
                  ].map((task) => (
                    <button
                      key={task}
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                        selectedTask === task
                          ? 'bg-primary-fixed/40 border-primary text-on-surface font-bold'
                          : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span>{task}</span>
                      {selectedTask === task && (
                        <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Timing */}
              <div>
                <label className="font-label-md text-xs font-bold text-on-surface block mb-1.5">
                  Schedule Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Immediate (Under 15 Mins)', 'Today Afternoon (02:00 PM)', 'Today Evening (06:00 PM)', 'Tomorrow Morning (10:00 AM)'].map(
                    (time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setScheduledTime(time)}
                        className={`text-left px-2.5 py-2 rounded-lg text-xs border transition-all ${
                          scheduledTime === time
                            ? 'bg-primary-fixed/40 border-primary text-on-surface font-bold'
                            : 'bg-surface-container-low border-surface-container text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Ethical Co-op Pricing Breakdown */}
              <div className="bg-secondary-container/40 p-3 rounded-xl border border-secondary-container text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-on-secondary-container">
                  <span>Standard Tariff Breakdown</span>
                  <span className="text-primary text-sm font-extrabold">₹{basePrice} Total</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Direct to Worker (85% Guaranteed)</span>
                  <span className="font-semibold text-primary">₹{workerCut}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Co-op Solidarity & Healthcare Pool (10%)</span>
                  <span className="font-semibold text-secondary">₹{welfareCut}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Federation Dispatch Infrastructure (5%)</span>
                  <span className="font-semibold">₹{platformCut}</span>
                </div>
                <div className="pt-1 border-t border-secondary-container/60 text-[11px] text-on-secondary-container font-medium">
                  ✓ 0% exploitative commissions • Authorized under MSCS Act
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="font-label-md text-xs font-bold text-on-surface block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-lg text-xs font-bold border flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'upi'
                        ? 'bg-primary-fixed/40 border-primary text-primary'
                        : 'bg-surface-container-low border-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('escrow')}
                    className={`p-2 rounded-lg text-xs font-bold border flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'escrow'
                        ? 'bg-primary-fixed/40 border-primary text-primary'
                        : 'bg-surface-container-low border-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                    <span>Co-op Escrow</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-lg text-xs font-bold border flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'cash'
                        ? 'bg-primary-fixed/40 border-primary text-primary'
                        : 'bg-surface-container-low border-surface-container text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Doorstep Cash</span>
                  </button>
                </div>
              </div>

              {/* Confirm Booking CTA */}
              <button
                type="button"
                onClick={() => onConfirmBooking(worker, selectedTask, scheduledTime)}
                className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 mt-2 active:scale-98 transition-all"
              >
                <span>Confirm Doorstep Booking • ₹{basePrice}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
