import React, { useState } from 'react';
import { BRAND_LOGO_URL } from '../../data/mockData';

export const CoopView: React.FC = () => {
  const [dividendCalcJobs, setDividendCalcJobs] = useState(120);

  // Approximate dividend estimate: ~₹18 per job completed from federation profit reserves
  const estimatedDividend = dividendCalcJobs * 18;

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Cooperative Federation Hero */}
      <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-container-lowest p-2 shadow-xs border border-secondary shrink-0">
            <img src={BRAND_LOGO_URL} alt="HelPerzzz" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary text-on-secondary px-2 py-0.5 rounded-full">
              Sovereign Gig Cooperative
            </span>
            <h1 className="font-headline-md text-lg sm:text-xl font-bold text-on-secondary-container mt-0.5">
              HelPerzzz Federation Charter
            </h1>
          </div>
        </div>

        <p className="text-xs text-on-secondary-container/90 leading-relaxed">
          Registered under the <strong>Multi-State Cooperative Societies Act, 2002 (MSCS/ND/2023/881)</strong>. We replace VC extraction with worker democracy, municipal rate protections, and mutual healthcare shields.
        </p>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2 bg-surface-container-lowest/80 rounded-xl">
            <span className="text-base font-extrabold text-primary block">14,280+</span>
            <span className="text-[10px] text-on-surface font-semibold">Artisan Owners</span>
          </div>
          <div className="p-2 bg-surface-container-lowest/80 rounded-xl">
            <span className="text-base font-extrabold text-primary block">₹1.42 Cr</span>
            <span className="text-[10px] text-on-surface font-semibold">Welfare Pool</span>
          </div>
          <div className="p-2 bg-surface-container-lowest/80 rounded-xl">
            <span className="text-base font-extrabold text-primary block">0%</span>
            <span className="text-[10px] text-on-surface font-semibold">Private Equity Cuts</span>
          </div>
        </div>
      </div>

      {/* 4 Democratic Tenets */}
      <div className="space-y-2">
        <h2 className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
          Cooperative Governance Tenets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">how_to_vote</span>
              <h3 className="text-xs font-bold text-on-surface">One Worker, One Vote</h3>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Every verified guild artisan holds equal voting weight in rate floor revisions, executive elections, and dispatch rule changes.
            </p>
          </div>

          <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">gavel</span>
              <h3 className="text-xs font-bold text-on-surface">Peer Tribunal Due Process</h3>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Zero algorithmic deactivations. Customer complaints are arbitrated by a 3-member elected peer bench before any action.
            </p>
          </div>

          <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">balance</span>
              <h3 className="text-xs font-bold text-on-surface">Statutory Wage Floors</h3>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Tariffs are strictly pegged to state minimum artisan guidelines. No predatory price slicing or surge inflation.
            </p>
          </div>

          <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">savings</span>
              <h3 className="text-xs font-bold text-on-surface">Annual Solidarity Dividend</h3>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              All year-end platform surpluses after server costs are credited to worker bank accounts on Diwali.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Annual Dividend Simulator */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-on-surface">
              Annual Member Dividend Simulator
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Calculate member dividend share based on completed cooperative orders
            </p>
          </div>
          <span className="text-primary font-bold text-sm">₹{estimatedDividend} Est.</span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-on-surface mb-1">
            <span>Completed Orders this Year</span>
            <span>{dividendCalcJobs} Jobs</span>
          </div>
          <input
            type="range"
            min="10"
            max="600"
            step="10"
            value={dividendCalcJobs}
            onChange={(e) => setDividendCalcJobs(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <p className="text-[11px] text-on-surface-variant bg-surface-container-low p-2 rounded-lg leading-relaxed">
          *Surplus dividend distribution ratified at the Annual General Meeting (AGM) under MSCS Act guidelines.
        </p>
      </div>

      {/* Federation Network Chapters */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-2">
        <h3 className="text-xs sm:text-sm font-bold text-on-surface">
          Affiliated Federation Chapters
        </h3>
        <div className="space-y-1.5 text-xs">
          <div className="p-2 bg-surface-container-low rounded-lg flex justify-between items-center">
            <span className="font-semibold text-on-surface">Bengaluru Urban Artisan Guild (#09)</span>
            <span className="text-primary font-bold">4,120 Artisans</span>
          </div>
          <div className="p-2 bg-surface-container-low rounded-lg flex justify-between items-center">
            <span className="font-semibold text-on-surface">Hyderabad Central Labour Union (#14)</span>
            <span className="text-primary font-bold">3,890 Artisans</span>
          </div>
          <div className="p-2 bg-surface-container-low rounded-lg flex justify-between items-center">
            <span className="font-semibold text-on-surface">Mumbai Suburban Technicians Union (#04)</span>
            <span className="text-primary font-bold">3,420 Artisans</span>
          </div>
          <div className="p-2 bg-surface-container-low rounded-lg flex justify-between items-center">
            <span className="font-semibold text-on-surface">Delhi NCR Cooperative Dispatch Federation (#22)</span>
            <span className="text-primary font-bold">2,850 Artisans</span>
          </div>
        </div>
      </div>
    </div>
  );
};
