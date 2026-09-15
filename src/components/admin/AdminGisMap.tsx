/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerLocation } from '../../types';
import { HYDERABAD_POPULAR_WARDS } from '../../data/hyderabadLocations';

interface AdminGisMapProps {
  currentLocation: CustomerLocation;
  activeIncidentCount?: number;
  activeArtisansCount?: number;
}

export const AdminGisMap: React.FC<AdminGisMapProps> = ({
  currentLocation,
  activeIncidentCount = 38,
  activeArtisansCount = 14280,
}) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Approximate relative mapping for Hyderabad municipal zones (500 x 260 viewbox)
  const ghmcNodes = [
    { id: 'jubilee', name: 'Jubilee Hills (Ward 8)', x: 190, y: 110, units: 14, status: 'normal' },
    { id: 'banjara', name: 'Banjara Hills (Ward 9)', x: 260, y: 135, units: 18, status: 'normal' },
    { id: 'madhapur', name: 'Madhapur / Hitec (Ward 108)', x: 130, y: 85, units: 22, status: 'high-demand' },
    { id: 'gachibowli', name: 'Gachibowli (Ward 107)', x: 90, y: 150, units: 16, status: 'normal' },
    { id: 'begumpet', name: 'Begumpet / Secunderabad', x: 340, y: 70, units: 19, status: 'normal' },
    { id: 'charminar', name: 'Charminar (Old City)', x: 370, y: 200, units: 12, status: 'incident' },
    { id: 'kukatpally', name: 'Kukatpally / KPHB', x: 170, y: 45, units: 15, status: 'normal' },
  ];

  return (
    <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-950 border border-surface-container select-none shadow-inner">
      {/* SVG Canvas for GHMC Municipal Command */}
      <svg viewBox="0 0 500 260" className="w-full h-full object-cover">
        <defs>
          <radialGradient id="adminPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#059669" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="incidentPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
          </radialGradient>
          <pattern id="adminGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>

        {/* Base Grid */}
        <rect width="500" height="260" fill="#030712" />
        <rect width="500" height="260" fill="url(#adminGrid)" />

        {/* GHMC Municipal Boundary Polygon (Hyderabad Metro Area) */}
        <polygon
          points="50,30 200,20 380,40 460,110 440,220 310,240 160,230 60,170"
          fill="#064e3b"
          fillOpacity="0.12"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Inter-ward Fiber & Dispatch Corridors */}
        <line x1="130" y1="85" x2="190" y2="110" stroke="#334155" strokeWidth="2" />
        <line x1="190" y1="110" x2="260" y2="135" stroke="#334155" strokeWidth="2" />
        <line x1="260" y1="135" x2="340" y2="70" stroke="#334155" strokeWidth="2" />
        <line x1="260" y1="135" x2="370" y2="200" stroke="#334155" strokeWidth="2" />
        <line x1="130" y1="85" x2="90" y2="150" stroke="#334155" strokeWidth="2" />
        <line x1="170" y1="45" x2="190" y2="110" stroke="#334155" strokeWidth="2" />

        {/* Hussain Sagar Lake outline */}
        <path
          d="M 310 110 C 300 115, 295 135, 315 140 C 330 145, 340 130, 330 118 Z"
          fill="#1e3a8a"
          opacity="0.6"
          stroke="#38bdf8"
          strokeWidth="0.8"
        />
        <text x="306" y="128" fill="#7dd3fc" fontSize="7" fontWeight="bold">
          Hussain Sagar
        </text>

        {/* Durgam Cheruvu */}
        <ellipse cx="160" cy="140" rx="16" ry="9" fill="#1e3a8a" opacity="0.6" />

        {/* GHMC Municipal Nodes */}
        {ghmcNodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            className="cursor-pointer group"
            onClick={() => setSelectedZone(node.name)}
          >
            {node.status === 'incident' ? (
              <circle r="18" fill="url(#incidentPulse)">
                <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
              </circle>
            ) : (
              <circle r="14" fill="#10b981" fillOpacity="0.15" />
            )}

            <circle
              r="5"
              fill={node.status === 'incident' ? '#ef4444' : '#10b981'}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <text
              x="8"
              y="3"
              fill="#e2e8f0"
              fontSize="8"
              fontWeight="bold"
              className="group-hover:fill-emerald-400 transition-colors"
            >
              {node.name.split('(')[0]}
            </text>
            <text x="8" y="12" fill="#94a3b8" fontSize="7">
              {node.units} units
            </text>
          </g>
        ))}

        {/* Live Command Center / Current Location Anchor Node */}
        <g transform="translate(200, 115)">
          <circle r="26" fill="url(#adminPulse)">
            <animate attributeName="r" values="14;30;14" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#059669" stroke="#ffffff" strokeWidth="2" />
          <text x="-48" y="-12" fill="#34d399" fontSize="9" fontWeight="extrabold">
            ★ Live Command Anchor (You)
          </text>
        </g>
      </svg>

      {/* Floating Header */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white text-[11px]">GHMC Municipal GIS Live Grid</span>
          <span className="text-slate-400 text-[10px] font-mono">
            {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E
          </span>
        </div>

        <div className="bg-primary/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-primary/40 text-primary-fixed font-bold text-[11px] shadow-md">
          14 Guild Units Patrolling
        </div>
      </div>

      {/* Active Outbreak Banner in Map */}
      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold truncate">
          <span className="material-symbols-outlined text-[16px] text-amber-400">warning</span>
          <span className="truncate">
            {selectedZone ? `Zone Selected: ${selectedZone}` : 'Active Incident: Sector 4 Tripped Transformer (Ward 8)'}
          </span>
        </div>
        <span className="text-[10px] text-slate-300 font-mono shrink-0">
          SLA 9.2 mins • 100% Resolved
        </span>
      </div>
    </div>
  );
};
