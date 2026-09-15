/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CustomerLocation } from '../../types';

interface WorkerDispatchMapProps {
  currentLocation: CustomerLocation;
  destinationName?: string;
  destinationAddress?: string;
  optimalRouteText?: string;
  distance?: string;
  eta?: string;
  isOnline?: boolean;
}

export const WorkerDispatchMap: React.FC<WorkerDispatchMapProps> = ({
  currentLocation,
  destinationName = 'Flat 402, Cyber Heights, Sector 2',
  destinationAddress = 'Jubilee Hills Rd 36 • Near Peddamma Temple Metro',
  optimalRouteText = 'Via Jubilee Hills Checkpost & Road 36',
  distance = '1.8 km',
  eta = '6 mins',
  isOnline = true,
}) => {
  // Worker coordinates based on live tracked location
  const workerLat = currentLocation.latitude;
  const workerLon = currentLocation.longitude;

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-900 border border-surface-container select-none shadow-inner">
      {/* SVG Dispatch Radar & Vector Navigation */}
      <svg viewBox="0 0 500 240" className="w-full h-full object-cover">
        <defs>
          <radialGradient id="workerPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <pattern id="workerGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>

        {/* Dark Map Canvas */}
        <rect width="500" height="240" fill="#0b1329" />
        <rect width="500" height="240" fill="url(#workerGrid)" />

        {/* Hyderabad Major Roads (Road 36, Checkpost, Durgam Cheruvu Link) */}
        {/* Road 36 Spine */}
        <path
          d="M 60 210 Q 180 150 260 120 T 440 60"
          fill="none"
          stroke="#334155"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 60 210 Q 180 150 260 120 T 440 60"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Secondary Cross Arteries */}
        <path d="M 120 40 L 220 220" fill="none" stroke="#1e293b" strokeWidth="5" strokeDasharray="3 3" />
        <path d="M 320 20 L 390 220" fill="none" stroke="#1e293b" strokeWidth="5" strokeDasharray="3 3" />

        {/* Water outline hint (Hussain Sagar / Durgam Cheruvu) */}
        <ellipse cx="440" cy="180" rx="45" ry="30" fill="#0f2b48" opacity="0.6" />
        <text x="415" y="184" fill="#38bdf8" fontSize="8" fontWeight="600" opacity="0.6">
          Durgam Cheruvu
        </text>

        {/* Active Dispatch Navigation Line with animated dashes */}
        <path
          d="M 140 160 Q 210 135 270 115 T 380 75"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeDasharray="6 4"
          className="animate-pulse"
        />

        {/* Customer Destination Doorstep (Point B) */}
        <g transform="translate(380, 75)">
          <circle r="14" fill="#ef4444" opacity="0.2" className="animate-ping" />
          <circle r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="12" y="4" fill="#fca5a5" fontSize="10" fontWeight="bold">
            Customer Doorstep
          </text>
        </g>

        {/* Worker Live GPS Current Location (Point A) */}
        <g transform="translate(140, 160)">
          {/* Pulsating radar wave */}
          <circle r="22" fill="url(#workerPulse)">
            <animate attributeName="r" values="12;28;12" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
          <circle r="3" fill="#ffffff" />
          <text x="-40" y="22" fill="#7dd3fc" fontSize="9" fontWeight="bold">
            You (Ramesh K. • On Duty)
          </text>
        </g>

        {/* Transit Distance Overlay */}
        <g transform="translate(250, 100)">
          <rect x="-35" y="-12" width="70" height="18" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
          <text x="0" y="1" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
            {distance} • {eta}
          </text>
        </g>
      </svg>

      {/* Floating GPS Telemetry Header */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 shadow-md">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-bold text-white text-[11px]">
            {isOnline ? 'Live Worker GPS Radar' : 'Duty Paused'}
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline font-mono">
            ({workerLat.toFixed(4)}° N, {workerLon.toFixed(4)}° E)
          </span>
        </div>

        <div className="bg-emerald-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-700/60 text-emerald-300 font-bold text-[11px] shadow-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">turn_sharp_right</span>
          <span>{eta} ETA</span>
        </div>
      </div>

      {/* Floating Bottom Street & Destination Strip */}
      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">navigation</span>
          <div className="truncate">
            <span className="font-bold text-white text-[11px] block truncate">
              {optimalRouteText}
            </span>
            <span className="text-[10px] text-slate-300 truncate block">
              Destination: {destinationAddress}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0 font-bold">
          Hyderabad Zone 18
        </span>
      </div>
    </div>
  );
};
