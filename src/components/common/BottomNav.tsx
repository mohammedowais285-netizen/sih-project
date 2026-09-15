import React from 'react';

export type NavTab = 'services' | 'dispatch' | 'bookings' | 'co-op' | 'account' | 'home' | 'coop' | 'emergency';

interface BottomNavProps {
  activeTab: string;
  onSelectTab?: (tab: NavTab) => void;
  onTabChange?: (tab: NavTab) => void;
  bookingCount?: number;
  hasActiveDispatch?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onTabChange,
  bookingCount = 1,
  hasActiveDispatch = true,
}) => {
  const tabs: { id: NavTab; label: string; icon: string; count?: number; pulse?: boolean }[] = [
    { id: 'services', label: 'Services', icon: 'handyman' },
    { id: 'dispatch', label: 'Dispatch', icon: 'electric_moped', pulse: hasActiveDispatch },
    { id: 'bookings', label: 'Bookings', icon: 'receipt_long', count: bookingCount },
    { id: 'co-op', label: 'Co-op', icon: 'shield_with_heart' },
    { id: 'account', label: 'Account', icon: 'account_circle' },
  ];

  const handleTabClick = (tabId: NavTab) => {
    if (typeof onSelectTab === 'function') {
      onSelectTab(tabId);
    }
    if (typeof onTabChange === 'function') {
      onTabChange(tabId);
    }
  };

  const isTabActive = (tabId: NavTab) => {
    if (activeTab === tabId) return true;
    if (tabId === 'services' && (activeTab === 'home' || activeTab === 'services')) return true;
    if (tabId === 'co-op' && (activeTab === 'coop' || activeTab === 'co-op')) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-2px_12px_rgba(15,41,66,0.05)]">
      <div className="h-16 max-w-md mx-auto px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-colors relative ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                {tab.count && tab.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.count}
                  </span>
                )}
                {tab.pulse && !tab.count && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface animate-ping" />
                )}
              </div>
              <span className="font-label-sm text-[11px] leading-tight tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
