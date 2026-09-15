import React, { useState } from 'react';
import { WorkerProfile } from '../../types';

interface CustomerBookingsProps {
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenLiveTracking: () => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({
  onSelectWorker,
  onOpenLiveTracking,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const bookings = [
    {
      id: 'HP-9104',
      service: 'Emergency Short Circuit Isolation',
      workerName: 'Ramesh K.',
      trade: 'Master Electrician',
      status: 'active',
      date: 'Today, 11:15 AM',
      amount: 199,
      workerCut: 169,
      welfareCut: 20,
      platformCut: 10,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClGX2ZRSIvx93yyA_ZIiQfP6juTkIJo5CYZUZq4bW6nTvnBqmV-ZAefI9_8WkZ44I_ons3vcUKmNAoZyTR-h4Vcfdec9ppbVF129Pa9byXHZqOWxKZEeo-yCo196gu3cTzkghWYXiSR9yrclCVuWaKeEXM6m3YVK9Qr0PMK8cPFJvIfCsZc1OyMcRciFZXFiWOQVMRQEK9KOePft9ohVAei2zeGPZWNhe6CxrfWJdswHlz5R9L8e4ZdA',
      rating: 5,
    },
    {
      id: 'HP-8419',
      service: 'Eco Deep Kitchen Degreasing & Sanitization',
      workerName: 'Sunita Devi',
      trade: 'Sanitation Guild Lead',
      status: 'completed',
      date: '02 Sep 2024, 03:30 PM',
      amount: 399,
      workerCut: 339,
      welfareCut: 40,
      platformCut: 20,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLy_H0wH5W17d84860R11mBvX6p5h5gJ88C6F1k0K3lq4c7w6E7d4R5t8Y9u1I3o5P7a9S2d4F6g8H0j2K4l6Z8x0C2v4B6n8M0Q2W4E6R8T0Y2U4I6O8P0A2S4D6F8G0H2J4K6L8Z0X2C4V6B8N0M2Q4W6E8R0T2Y4U6I8O0P',
      rating: 5,
    },
    {
      id: 'HP-7102',
      service: 'Custom Teak Bookshelf Joint Alignment',
      workerName: 'Vikram Rao',
      trade: 'Master Carpenter',
      status: 'completed',
      date: '28 Aug 2024, 11:00 AM',
      amount: 450,
      workerCut: 382,
      welfareCut: 45,
      platformCut: 23,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_h209440626hBw_wR9t482017rT9Y8e2vX0K3lq4c7w6E7d4R5t8Y9u1I3o5P7a9S2d4F6g8H0j2K4l6Z8x0C2v4B6n8M0Q2W4E6R8T0Y2U4I6O8P0A2S4D6F8G0H2J4K6L8Z0X2C4V6B8N0M2Q4W6E8R0T2Y4U6I8O0P',
      rating: 4.8,
    },
  ];

  const filtered = bookings.filter((b) => {
    if (filter === 'active') return b.status === 'active';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
            Doorstep Bookings & Receipts
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Tamper-evident cooperative escrow invoices
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-surface-container p-0.5 rounded-lg text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${filter === 'all' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 rounded-md transition-all ${filter === 'active' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 rounded-md transition-all ${filter === 'completed' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'}`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Bookings Stack */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.workerName}
                  className="w-12 h-12 rounded-full object-cover border border-surface-container-highest"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
                      {item.service}
                    </h3>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {item.workerName} • {item.trade}
                  </p>
                  <span className="text-[11px] text-outline">{item.date}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  item.status === 'active'
                    ? 'bg-primary-fixed text-primary animate-pulse'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {item.status === 'active' ? 'En Route' : 'Completed'}
              </span>
            </div>

            {/* Cooperative Pricing Transparency */}
            <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container text-xs space-y-1">
              <div className="flex justify-between font-bold text-on-surface">
                <span>Receipt #{item.id}</span>
                <span className="text-primary">₹{item.amount}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-[11px]">
                <span>Paid Directly to {item.workerName} (85%):</span>
                <span className="font-semibold text-primary">₹{item.workerCut}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-[11px]">
                <span>Co-op Healthcare & Welfare Pool (10%):</span>
                <span>₹{item.welfareCut}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-0.5">
              {item.status === 'active' ? (
                <button
                  onClick={onOpenLiveTracking}
                  className="w-full py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">navigation</span>
                  <span>Track Live Artisan Location</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => showToast(`Re-booking request sent to ${item.workerName} via cooperative dispatch!`)}
                  className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">repeat</span>
                  <span>Book {item.workerName} Again</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-surface-container-high animate-fade-in max-w-[90vw]">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">check_circle</span>
          <span className="truncate">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
