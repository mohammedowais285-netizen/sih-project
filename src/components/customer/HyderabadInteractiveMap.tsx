/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerLocation, WorkerProfile } from '../../types';

interface HyderabadInteractiveMapProps {
  customerLocation: CustomerLocation;
  workers: WorkerProfile[];
  onSelectWorker?: (worker: WorkerProfile) => void;
  onSelectWardLocation?: (loc: CustomerLocation) => void;
  interactive?: boolean;
}

export const HyderabadInteractiveMap: React.FC<HyderabadInteractiveMapProps> = ({
  customerLocation,
  workers,
  onSelectWorker,
  onSelectWardLocation,
  interactive = true,
}) => {
  const [activePin, setActivePin] = useState<'customer' | string | null>('customer');
  const [mapZoom, setMapZoom] = useState<number>(1);

  // Approximate relative mapping for Hyderabad landmarks to SVG coordinates (600 x 400 viewbox)
  // Center is roughly Jubilee Hills / Banjara Hills (17.42, 78.42)
  const landmarks = [
    { name: 'Hussain Sagar Lake', x: 380, y: 190, type: 'water' },
    { name: 'Durgam Cheruvu', x: 190, y: 220, type: 'water' },
    { name: 'KBR National Park', x: 260, y: 200, type: 'park' },
    { name: 'Hitec City / Cyber Towers', x: 130, y: 170, type: 'hub' },
    { name: 'Gachibowli / Financial Dist', x: 110, y: 250, type: 'hub' },
    { name: 'Jubilee Hills Rd 36', x: 230, y: 180, type: 'doorstep' },
    { name: 'Banjara Hills Rd 12', x: 300, y: 220, type: 'hub' },
    { name: 'Begumpet Airport', x: 390, y: 120, type: 'hub' },
    { name: 'Charminar (Old City)', x: 410, y: 310, type: 'heritage' },
    { name: 'Kukatpally / KPHB', x: 210, y: 90, type: 'hub' },
  ];

  // Convert customer location to visual x,y
  const getCustomerMapCoords = () => {
    // Latitude range: ~17.35 to 17.50 (Y: 340 to 60)
    // Longitude range: ~78.33 to 78.50 (X: 80 to 460)
    const lat = customerLocation.latitude;
    const lon = customerLocation.longitude;
    const x = Math.min(520, Math.max(70, 80 + ((lon - 78.33) / (78.50 - 78.33)) * 380));
    const y = Math.min(350, Math.max(60, 340 - ((lat - 17.35) / (17.50 - 17.35)) * 280));
    return { x, y };
  };

  const customerCoords = getCustomerMapCoords();

  // Offset worker pins relative to customer
  const workerPositions = [
    { id: workers[0]?.id || 'w1', x: customerCoords.x + 28, y: customerCoords.y - 24, worker: workers[0] },
    { id: workers[1]?.id || 'w2', x: customerCoords.x - 32, y: customerCoords.y + 18, worker: workers[1] },
    { id: workers[2]?.id || 'w3', x: customerCoords.x + 45, y: customerCoords.y + 35, worker: workers[2] },
  ];

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden bg-slate-900 border border-surface-container select-none">
      {/* SVG Vector Map of Hyderabad */}
      <svg
        viewBox="0 0 600 380"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${mapZoom})` }}
      >
        <defs>
          <radialGradient id="customerPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.4" opacity="0.4" />
          </pattern>
        </defs>

        {/* Base Map Grid */}
        <rect width="600" height="380" fill="#0f172a" />
        <rect width="600" height="380" fill="url(#grid)" />

        {/* Major Water Bodies (Hussain Sagar, Durgam Cheruvu) */}
        {/* Hussain Sagar with heart shape/necklace road */}
        <path
          d="M 370 170 C 355 175, 350 200, 375 210 C 395 215, 410 195, 395 180 C 385 170, 378 168, 370 170 Z"
          fill="#1e3a8a"
          stroke="#38bdf8"
          strokeWidth="1"
          opacity="0.75"
        />
        <text x="365" y="195" fill="#7dd3fc" fontSize="9" fontWeight="600" opacity="0.85">
          Hussain Sagar
        </text>

        {/* Durgam Cheruvu (Secret Lake) */}
        <path
          d="M 180 215 C 170 218, 175 230, 195 228 C 205 226, 210 215, 195 215 Z"
          fill="#1e3a8a"
          stroke="#38bdf8"
          strokeWidth="0.8"
          opacity="0.75"
        />
        <text x="175" y="238" fill="#7dd3fc" fontSize="8" opacity="0.75">
          Durgam Cheruvu
        </text>

        {/* KBR National Park green blob */}
        <ellipse cx="260" cy="205" rx="20" ry="14" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" opacity="0.7" />
        <text x="245" y="208" fill="#6ee7b7" fontSize="7" opacity="0.7">
          KBR Park
        </text>

        {/* Hyderabad Outer Ring Road (ORR) Expressway Loop */}
        <ellipse
          cx="285"
          cy="200"
          rx="250"
          ry="150"
          fill="none"
          stroke="#475569"
          strokeWidth="2.5"
          strokeDasharray="6,4"
          opacity="0.4"
        />
        <text x="490" y="240" fill="#94a3b8" fontSize="8" opacity="0.6" transform="rotate(25 490 240)">
          Hyderabad ORR Highway
        </text>

        {/* Inner Arterial Roads (P.V. Narasimha Rao Expressway, Inner Ring Road, Road No. 36) */}
        {/* Road 36 Jubilee Hills to Hitec City */}
        <path d="M 120 170 L 230 180 L 300 210 L 370 200" fill="none" stroke="#64748b" strokeWidth="2.2" opacity="0.65" />
        {/* NH 65 Mumbai Highway / Kukatpally */}
        <path d="M 180 60 L 220 110 L 300 170 L 380 240" fill="none" stroke="#64748b" strokeWidth="1.8" opacity="0.5" />
        {/* Durgam Cheruvu Cable Bridge */}
        <path d="M 175 220 L 205 215" fill="none" stroke="#f59e0b" strokeWidth="2" />

        {/* Municipal Boundaries / GHMC Zones Subtle Lines */}
        <path d="M 160 140 Q 250 160 320 130" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
        <path d="M 270 190 Q 320 260 400 320" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

        {/* Landmark Points */}
        {landmarks.map((lm, idx) => (
          <g key={idx} className="cursor-pointer">
            <circle cx={lm.x} cy={lm.y} r="2.5" fill="#94a3b8" opacity="0.6" />
            <text x={lm.x + 4} y={lm.y + 3} fill="#94a3b8" fontSize="7.5" opacity="0.55">
              {lm.name}
            </text>
          </g>
        ))}

        {/* 15-Minute Response Guaranteed SLA Circle around Customer */}
        <circle
          cx={customerCoords.x}
          cy={customerCoords.y}
          r="48"
          fill="url(#customerPulse)"
          className="animate-pulse"
        />
        <circle
          cx={customerCoords.x}
          cy={customerCoords.y}
          r="48"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="4,3"
          opacity="0.8"
        />

        {/* Optimal Dispatch Route Line to nearest worker */}
        {workerPositions[0] && (
          <path
            d={`M ${customerCoords.x} ${customerCoords.y} Q ${customerCoords.x + 10} ${customerCoords.y - 12} ${workerPositions[0].x} ${workerPositions[0].y}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="5,3"
            className="animate-pulse"
          />
        )}

        {/* Cooperative Guild Worker Pins */}
        {workerPositions.map((wp) => {
          if (!wp.worker) return null;
          return (
            <g
              key={wp.id}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectWorker?.(wp.worker!)}
            >
              {/* Pulse */}
              <circle cx={wp.x} cy={wp.y} r="8" fill="#0284c7" opacity="0.4" />
              {/* Pin base */}
              <circle cx={wp.x} cy={wp.y} r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              {/* Tool icon */}
              <text x={wp.x} y={wp.y + 2.5} textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">
                ⚡
              </text>
              {/* Tooltip text */}
              <rect
                x={wp.x - 28}
                y={wp.y - 18}
                width="56"
                height="12"
                rx="3"
                fill="#0f172a"
                stroke="#0284c7"
                strokeWidth="0.6"
                opacity="0.9"
              />
              <text x={wp.x} y={wp.y - 9} textAnchor="middle" fill="#e2e8f0" fontSize="6.5" fontWeight="bold">
                {wp.worker.name.split(' ')[0]} ({wp.worker.eta})
              </text>
            </g>
          );
        })}

        {/* Customer Doorstep Location Pin (Highlighted) */}
        <g
          className="cursor-pointer"
          onClick={() => setActivePin('customer')}
        >
          {/* Beacon Ring */}
          <circle cx={customerCoords.x} cy={customerCoords.y} r="10" fill="#10b981" opacity="0.3" />
          <circle cx={customerCoords.x} cy={customerCoords.y} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx={customerCoords.x} cy={customerCoords.y} r="2.5" fill="#ffffff" />

          {/* Pin Flag / Bubble */}
          <g transform={`translate(${customerCoords.x - 50}, ${customerCoords.y - 36})`}>
            <rect
              width="100"
              height="22"
              rx="6"
              fill="#0f172a"
              stroke="#10b981"
              strokeWidth="1.2"
              filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))"
            />
            <polygon points="45,22 55,22 50,27" fill="#0f172a" />
            <text x="50" y="10" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="bold">
              📍 YOUR DOORSTEP
            </text>
            <text x="50" y="18" textAnchor="middle" fill="#f8fafc" fontSize="6.5" fontWeight="600">
              {customerLocation.latitude.toFixed(4)}° N, {customerLocation.longitude.toFixed(4)}° E
            </text>
          </g>
        </g>
      </svg>

      {/* Map Floating HUD Overlays */}
      {/* Top Left: Hyderabad GHMC Geo Badge */}
      <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/80 text-white shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-emerald-400">Hyderabad, Telangana</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 font-semibold px-1.5 py-0.2 rounded border border-emerald-800">
              GHMC
            </span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
            <span>{customerLocation.latitude.toFixed(4)}° N, {customerLocation.longitude.toFixed(4)}° E</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">PIN {customerLocation.pinCode}</span>
          </div>
        </div>
      </div>

      {/* Top Right: Zoom Controls */}
      {interactive && (
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-700 p-0.5">
          <button
            type="button"
            onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 1.8))}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-200 hover:bg-slate-800 text-xs font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.9))}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-200 hover:bg-slate-800 text-xs font-bold"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      )}

      {/* Bottom Bar: Doorstep Neighborhood & Response Time */}
      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 backdrop-blur-md p-2 rounded-lg border border-slate-700/90 text-xs flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-100 truncate block text-xs">
              {customerLocation.address}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">
              {customerLocation.wardNumber} • {customerLocation.ghmcZone}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0 pl-2">
          <span className="text-[10px] text-slate-400 block">SLA Response</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
            <span className="material-symbols-outlined text-[13px]">timer</span>
            <span>&lt;15 mins</span>
          </span>
        </div>
      </div>
    </div>
  );
};
