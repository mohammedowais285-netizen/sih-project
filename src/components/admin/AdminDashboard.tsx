import React, { useState } from 'react';
import { PENDING_VERIFICATIONS, MOCK_DISPATCH_INCIDENTS } from '../../data/mockData';
import { CustomerLocation } from '../../types';
import { DEFAULT_CUSTOMER_LOCATION } from '../../data/hyderabadLocations';
import { AdminGisMap } from './AdminGisMap';

interface AdminDashboardProps {
  onLogout: () => void;
  currentLocation?: CustomerLocation;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  currentLocation = DEFAULT_CUSTOMER_LOCATION,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dispatch' | 'kyc' | 'tariffs' | 'welfare'>('overview');
  const [verifications, setVerifications] = useState(() => {
    try {
      const custom = localStorage.getItem('helperzzz_custom_verifications');
      if (custom) {
        return [...JSON.parse(custom), ...PENDING_VERIFICATIONS];
      }
    } catch {
      // ignore
    }
    return PENDING_VERIFICATIONS;
  });
  const [incidents, setIncidents] = useState(MOCK_DISPATCH_INCIDENTS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Rate card state
  const [electricianFloor, setElectricianFloor] = useState(199);
  const [plumberFloor, setPlumberFloor] = useState(249);
  const [cleanerFloor, setCleanerFloor] = useState(399);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApproveKyc = (id: string, name: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'approved' as const } : v))
    );
    showToast(`Approved ${name} — Registered under Hyderabad Co-op Charter #41`);
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'resolved' as const } : inc))
    );
    showToast(`Incident ${id} marked Resolved on cooperative municipal log.`);
  };

  return (
    <div className="flex flex-col w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-4 pb-28 pt-2 space-y-4">
      {/* Admin Masthead */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_person
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-headline-md text-base sm:text-lg font-bold text-on-surface truncate">
                Federation Secretariat Console
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                Ward 12 & 14 Node
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant truncate">
              Hyderabad Central Labour Union (#14) • MSCS Act Registered
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: 'dashboard' },
          { id: 'dispatch', label: 'Live Municipal Dispatch', icon: 'emergency' },
          { id: 'kyc', label: 'Artisan e-KYC Queue', icon: 'verified_user' },
          { id: 'tariffs', label: 'Wage Floors & Tariffs', icon: 'payments' },
          { id: 'welfare', label: 'Welfare & Solidarity Pool', icon: 'health_and_safety' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* 4 Core Federation KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-xs font-bold uppercase tracking-wider">Active Artisans</span>
                <span className="material-symbols-outlined text-primary text-[18px]">engineering</span>
              </div>
              <div className="font-headline-lg-mobile text-xl font-bold text-on-surface">14,280</div>
              <div className="text-[11px] text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                <span>+142 enrolled this week</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-xs font-bold uppercase tracking-wider">SOS Emergency</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">emergency</span>
              </div>
              <div className="font-headline-lg-mobile text-xl font-bold text-tertiary">38 Calls</div>
              <div className="text-[11px] text-on-surface-variant font-semibold">
                Avg Response: 9.2 mins (100% SLA)
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-xs font-bold uppercase tracking-wider">Daily Volume</span>
                <span className="material-symbols-outlined text-secondary text-[18px]">currency_rupee</span>
              </div>
              <div className="font-headline-lg-mobile text-xl font-bold text-on-surface">₹4,82,400</div>
              <div className="text-[11px] text-primary font-semibold">
                85% (₹4.10L) paid directly to workers
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-xs font-bold uppercase tracking-wider">Welfare Reserves</span>
                <span className="material-symbols-outlined text-primary text-[18px]">shield_with_heart</span>
              </div>
              <div className="font-headline-lg-mobile text-xl font-bold text-primary">₹1.42 Cr</div>
              <div className="text-[11px] text-on-surface-variant font-semibold">
                +₹48,240 added to pool today
              </div>
            </div>
          </div>

          {/* Real-Time Municipal Dispatch Map & Status */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
                  Hyderabad Municipal Command GIS Grid: {currentLocation.wardNumber || 'West Zone'}
                </h3>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                14 Guild Units Patrolling
              </span>
            </div>

            <AdminGisMap
              currentLocation={currentLocation}
              activeArtisansCount={14280}
              activeIncidentCount={incidents.length}
            />
          </div>

          {/* Quick Shortcuts to Sub-systems */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setActiveTab('kyc')}
              className="p-3.5 bg-surface-container-low hover:bg-surface-container rounded-xl border border-surface-container cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Review Artisan Applications</h4>
                  <p className="text-[11px] text-on-surface-variant">3 workers awaiting guild certificate audit</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
            </div>

            <div
              onClick={() => setActiveTab('welfare')}
              className="p-3.5 bg-surface-container-low hover:bg-surface-container rounded-xl border border-surface-container cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">healing</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Labour Welfare Disbursements</h4>
                  <p className="text-[11px] text-on-surface-variant">Accident cover & apprentice tool subsidies</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[18px]">arrow_forward</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE DISPATCH CONSOLE */}
      {activeTab === 'dispatch' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-base font-bold text-on-surface">
              Active Municipal Incidents ({incidents.length})
            </h3>
            <span className="text-xs text-on-surface-variant">Priority 1 Doorstep Dispatches</span>
          </div>

          <div className="space-y-2.5">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        inc.status === 'resolved'
                          ? 'bg-outline'
                          : inc.priority === 'critical'
                          ? 'bg-error animate-ping'
                          : 'bg-tertiary animate-pulse'
                      }`}
                    />
                    <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
                      {inc.id} • {inc.type}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      inc.status === 'resolved'
                        ? 'bg-surface-container text-on-surface-variant'
                        : inc.status === 'en-route'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-headline-md text-sm font-bold text-on-surface">{inc.title}</h4>
                  <p className="text-xs text-on-surface-variant">{inc.location}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-container-low flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    <span>Assigned: <strong className="text-on-surface">{inc.assignedWorker}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-outline text-[11px]">SLA: {inc.slaTime}</span>
                    {inc.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleResolveIncident(inc.id)}
                        className="px-2.5 py-1 rounded bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors"
                      >
                        Confirm Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARTISAN E-KYC QUEUE */}
      {activeTab === 'kyc' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-base font-bold text-on-surface">
              Artisan e-KYC & Guild Registration Queue
            </h3>
            <span className="text-xs text-on-surface-variant">Aadhaar + ITI Sovereign Match</span>
          </div>

          <div className="space-y-3">
            {verifications.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border border-surface-container-highest"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-headline-md text-sm font-bold text-on-surface">{item.name}</h4>
                        <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.trade}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.society}</p>
                      <p className="text-[11px] text-outline font-mono">Aadhaar: {item.aadhaarNumber}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      item.status === 'approved'
                        ? 'bg-primary-fixed text-primary'
                        : item.status === 'under-review'
                        ? 'bg-secondary-container text-secondary'
                        : 'bg-tertiary-container text-on-tertiary'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-lg text-xs space-y-1 border border-surface-container">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Certification:</span>
                    <span className="font-semibold text-on-surface">{item.certificateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Submitted Date:</span>
                    <span className="text-on-surface">{item.submittedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tribunal Standing:</span>
                    <span className="text-primary font-bold">100% Peer Clear • 0 Complaints</span>
                  </div>
                </div>

                {item.status !== 'approved' ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => showToast(`Requested re-upload of NCVT & Aadhaar credentials for ${item.name}`)}
                      className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors"
                    >
                      Request Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveKyc(item.id, item.name)}
                      className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors"
                    >
                      Approve & Grant Guild Charter
                    </button>
                  </div>
                ) : (
                  <div className="p-2 bg-primary-fixed/30 text-primary rounded-lg text-xs font-bold text-center">
                    ✓ Verified Member of Labour Co-op Federation #41
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WAGE FLOORS & TARIFFS */}
      {activeTab === 'tariffs' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-3">
            <div>
              <h3 className="font-headline-md text-base font-bold text-on-surface">
                Municipal Fair Wage Floor Controller
              </h3>
              <p className="text-xs text-on-surface-variant">
                Regulated under MSCS Act Section 42. Prevents algorithmic undercutting and predatory price wars.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-surface-container">
                <div>
                  <span className="text-xs font-bold text-on-surface block">Master Electrician Base Tariff</span>
                  <span className="text-[11px] text-on-surface-variant">85% directly to worker • 15 min rapid dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-primary">₹</span>
                  <input
                    type="number"
                    value={electricianFloor}
                    onChange={(e) => setElectricianFloor(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-surface-container-lowest text-on-surface font-bold text-sm rounded border border-surface-container text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-surface-container">
                <div>
                  <span className="text-xs font-bold text-on-surface block">Certified Plumber Base Tariff</span>
                  <span className="text-[11px] text-on-surface-variant">Pipeline diagnostics & pressure isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-primary">₹</span>
                  <input
                    type="number"
                    value={plumberFloor}
                    onChange={(e) => setPlumberFloor(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-surface-container-lowest text-on-surface font-bold text-sm rounded border border-surface-container text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-surface-container">
                <div>
                  <span className="text-xs font-bold text-on-surface block">Sanitation & Deep Clean Floor</span>
                  <span className="text-[11px] text-on-surface-variant">Eco-certified detergents & machine tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-primary">₹</span>
                  <input
                    type="number"
                    value={cleanerFloor}
                    onChange={(e) => setCleanerFloor(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-surface-container-lowest text-on-surface font-bold text-sm rounded border border-surface-container text-center"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Rate cards synchronized across Ward 12 & 14 dispatch nodes.')}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors"
            >
              Publish Updated Municipal Rate Card
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: WELFARE & SOLIDARITY POOL */}
      {activeTab === 'welfare' && (
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Solidarity Welfare Pool Ledger
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Funded by 10% co-op allocations on every customer booking
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-outline block">Total Balance</span>
                <span className="text-lg font-bold text-primary font-headline-lg-mobile">₹1,42,80,950</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="p-3 bg-secondary-container/40 rounded-xl border border-secondary-container text-center space-y-1">
                <span className="material-symbols-outlined text-secondary text-[24px]">local_hospital</span>
                <h4 className="text-xs font-bold text-on-surface">Medical & Accident Shield</h4>
                <p className="text-xs font-bold text-primary">₹68,40,000 Allocated</p>
                <p className="text-[10px] text-on-surface-variant">Active for 14,280 artisans</p>
              </div>

              <div className="p-3 bg-tertiary-container/40 rounded-xl border border-tertiary-container text-center space-y-1">
                <span className="material-symbols-outlined text-tertiary text-[24px]">construction</span>
                <h4 className="text-xs font-bold text-on-surface">Apprentice Tool Grant</h4>
                <p className="text-xs font-bold text-primary">₹32,10,000 Allocated</p>
                <p className="text-[10px] text-on-surface-variant">0% interest toolkit micro-loans</p>
              </div>

              <div className="p-3 bg-primary-fixed/30 rounded-xl border border-primary-fixed text-center space-y-1">
                <span className="material-symbols-outlined text-primary text-[24px]">savings</span>
                <h4 className="text-xs font-bold text-on-surface">Annual Member Dividend</h4>
                <p className="text-xs font-bold text-primary">₹42,30,950 Accrued</p>
                <p className="text-[10px] text-on-surface-variant">Disbursed on Diwali AGM</p>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container space-y-1 text-xs">
              <span className="font-bold text-on-surface block">Recent Welfare Disbursal Log</span>
              <div className="flex justify-between py-1 border-b border-surface-container text-[11px]">
                <span>Sunita Devi (Cleaning Guild #12) • Maternity Grant</span>
                <span className="font-bold text-primary">₹15,000 Direct Disbursal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container text-[11px]">
                <span>Vikram Rao (Woodcraft #41) • Tool Modernization Subsidy</span>
                <span className="font-bold text-primary">₹8,500 Direct Disbursal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-surface-container-high">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
