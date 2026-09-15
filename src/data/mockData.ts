import { ServiceCategory, WorkerProfile, VerificationCandidate, ActiveJobRequest, ScheduledActivity, EmergencySOS } from '../types';

export const BRAND_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1XYVmnUTyia7Vw8Pw86w8ZKcgVLFgkM0vhdaNJh2uAqDC_tSNfO0F1ukQjxmbrOoV_PCUKJVxL0PcTsIqWodk8fKQHej8D3It-zx-tovRi0tLVSXZBAw3pAGBTOu7SujG6GMglEPFH5i-7UdW7pfSc4cUOLiKiFFEuedI74ckscdm4t1fArH5b0VV5uTvwvF5px4YM2CU59hFAuEoRZwU5OnvdlQgdkLaX27SIVeIfBErzVlZJIed8h_FuA';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrician',
    title: 'Electrician',
    startingPrice: 199,
    icon: 'electrical_services',
    bgClass: 'bg-primary/10',
    textClass: 'text-primary',
  },
  {
    id: 'plumber',
    title: 'Plumber',
    startingPrice: 149,
    icon: 'plumbing',
    bgClass: 'bg-secondary/10',
    textClass: 'text-secondary',
  },
  {
    id: 'carpenter',
    title: 'Carpenter',
    startingPrice: 199,
    icon: 'carpenter',
    bgClass: 'bg-tertiary-container/15',
    textClass: 'text-tertiary',
  },
  {
    id: 'deep-clean',
    title: 'Deep Clean',
    startingPrice: 399,
    icon: 'sanitizer',
    bgClass: 'bg-primary-fixed-dim/30',
    textClass: 'text-primary',
  },
  {
    id: 'appliance',
    title: 'Appliance',
    startingPrice: 249,
    icon: 'home_repair_service',
    bgClass: 'bg-secondary-container',
    textClass: 'text-on-secondary-container',
  },
  {
    id: 'painter',
    title: 'Painter',
    startingPrice: 499,
    icon: 'format_paint',
    bgClass: 'bg-surface-container-high',
    textClass: 'text-on-surface',
  },
  {
    id: 'caregiver',
    title: 'Caregiver',
    startingPrice: 350,
    icon: 'volunteer_activism',
    bgClass: 'bg-error-container',
    textClass: 'text-on-error-container',
  },
  {
    id: 'gardener',
    title: 'Gardener',
    startingPrice: 199,
    icon: 'yard',
    bgClass: 'bg-primary-fixed',
    textClass: 'text-on-primary-fixed',
  },
];

export const NEARBY_WORKERS: WorkerProfile[] = [
  {
    id: 'worker-ramesh',
    name: 'Ramesh Kumar',
    trade: 'Master Electrician',
    subTrade: 'LT Supply & Fault Isolation',
    society: 'Labour Co-op Federation #41 • Hyderabad Unit',
    societyCode: 'Society #41 (GHMC)',
    rating: 4.94,
    completedJobs: 1420,
    distance: '0.6 km away (Jubilee Hills)',
    eta: '8 mins',
    basePrice: 199,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClGX2ZRSIvx93yyA_ZIiQfP6juTkIJo5CYZUZq4bW6nTvnBqmV-ZAefI9_8WkZ44I_ons3vcUKmNAoZyTR-h4Vcfdec9ppbVF129Pa9byXHZqOWxKZEeo-yCo196gu3cTzkghWYXiSR9yrclCVuWaKeEXM6m3YVK9Qr0PMK8cPFJvIfCsZc1OyMcRciFZXFiWOQVMRQEK9KOePft9ohVAei2zeGPZWNhe6CxrfWJdswHlz5R9L8e4ZdA',
    isOnline: true,
    status: 'en_route',
    badges: ['Co-op Certified', 'Master Pipefitter / Wireman', 'Background Cleared'],
    certifications: ['State Wireman License #TEL-EL-88432', 'ITI National Certified'],
    phone: '+91 98490 28141'
  },
  {
    id: 'worker-sunita',
    name: 'Sunita Devi',
    trade: 'Eco Clean Specialist',
    subTrade: 'Deep Clean & Sanitization',
    society: 'Eco Clean Co-op • Banjara Hills Unit',
    societyCode: 'Banjara Hills Unit',
    rating: 4.98,
    completedJobs: 890,
    distance: '600m away (Banjara Hills)',
    eta: '11 mins',
    basePrice: 399,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARLa9Z9d8pjWeQfoLWZ3XrdXc_SJTDIDHAoOSQJjTr8NankYbWbBI2Xgoz7YffCBYv-458AH2oLWHhF5j9sK94-9_OcE5iJFOh9_Qi9oHKM5b3M9X-MwyEAPqbUyi4erR56OCqo-0hM2jdAdzLz5tNJGYhulmhlRiHJsbLc-X8JtKCQsHfLaTpwOci6j80ASRs-G2Cq5hxrNAO3pjyqxLXADmw28E_rGTSGE-ThqFeTA9uBL91buFxlQ',
    isOnline: true,
    status: 'idle',
    badges: ['Background Checked', 'Labour Insured', 'Eco Verified'],
    certifications: ['National Skill Development Council (NSDC) Level 3'],
    phone: '+91 97110 39420'
  },
  {
    id: 'worker-vikram',
    name: 'Vikram Rao',
    trade: 'Woodcraft Guild Artisan',
    subTrade: 'Furniture Restoration & Lock Expert',
    society: 'Woodcraft Guild • Hyderabad Central #19',
    societyCode: 'Society #19 (GHMC)',
    rating: 4.91,
    completedJobs: 2130,
    distance: '1.2km away (Madhapur)',
    eta: '14 mins',
    basePrice: 199,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI86ZzMRLy64VgT4DwCWl-vNpJvV1v63c6x0b3HGdac6sVWOzWFVD6NEoziRnyHnEjGKwfKvZ1isa0gI30IHlnVwLAEeRgLtPYIxSCFoC7Op9OCvOZmX8ADHvfoTmRIXWOJZusswjGkdc6Tfj84bb8qPSmg0Qy0rE6JNO6Z3X0KZYmyTye8pr3z1792uoy2MD0eXj-aqQ4rZwH_ROspmqTEyO9187R-eXIYzsDktITc6TxXchLV5Ntig',
    isOnline: true,
    status: 'idle',
    badges: ['Furniture Restorer', 'Lock Expert', 'Guild Senior Mentor'],
    certifications: ['Telangana Artisan Charter #TS-CARP-291'],
    phone: '+91 94480 58190'
  }
];

export const VERIFICATION_CANDIDATES: VerificationCandidate[] = [
  {
    id: 'worker-card-1',
    name: 'Suresh Verma',
    category: 'Appliances',
    experience: '8 Yrs Exp',
    specialization: 'HVAC & Inverter AC Specialist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dRGgLTbsENaJBaV0AEmJiPTxZ5eq74vLlc8UTcyPU3OeXHwlY4DUxn8SULUzyD8bdYSIUg_zTt2-3URnrCMdqNQVf2vQp4-yfY4HOA_SRo139ThoUZUg0F9SxXTvI2LxZ2ls0LwPtm0twpKKC_lg8M1DsEZoPGs4Fw16PRT_MkiMrtw8yzfrY5_mPevPH5wz2AMnqtwDslPStJPM9oTr6lrpjfmGpKwHZlF-r0AUxg8VOgAsiBfSLA',
    tradeTest: 'ITI National Certified (HVAC #9921)',
    status: 'pending',
    docsSummary: {
      certificate: 'ITI National Diploma in Refrigeration & Air Conditioning',
      policeClearance: 'Police Verification Clearance Hyderabad North (Verified Oct 2024)',
      sponsors: '2 Senior Guild Masters Endorsed',
      aadhaarKYC: true
    }
  },
  {
    id: 'worker-card-2',
    name: 'Fatima Begum',
    category: 'Carpentry',
    experience: '6 Yrs Exp',
    specialization: 'Woodwork & Modular Restoration',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrxxnQCpPO3wgDgmmsSeE-2HQ-fmgxzRkaCWZlzpAQrDK4wI66i0QcOiJRXSpmw0bEhJSnmgchGPgix7ljO5xbyb0ZTTipPrk5mXuIkliYOZKrXtBWYw3SOwC-S9zS5C5yOCJR07UX5QrluMC9SzP02ZxxRQJvtry71q1h53HpkklAkjz3nj2ZLHVyv4QbmGiRINc-WCENE-xoepTAw1AvNE-0rKSNM2WBOmrSMpKi-MzeD2S5A-daTA',
    tradeTest: 'Trade Guild Peer Test (Guild #403)',
    status: 'pending',
    docsSummary: {
      certificate: 'Craftsman Proficiency Guild Test Grade A',
      policeClearance: 'District Police Verification Cleared (Nov 2024)',
      sponsors: '2 Peer Sign-offs Validated',
      aadhaarKYC: true
    }
  },
  {
    id: 'worker-card-3',
    name: 'Anand Rao',
    category: 'Solar & EV',
    experience: '5 Yrs Exp',
    specialization: 'Residential Inverter & Solar Tech',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKdoiB1H_fQBkVHnmbs5Uk5L5SzOBMEZLApwTHIfS8oCRZ0zDRARJQryU7sTmEqhDV-AKh7KN4w5RFc_ngsBfgx_VS-MfUiGx7xw-92JtbEOrAYNqr5o86s_B5LHCdfj-QUqajGXvViyNsnGgDfr3DXXKHbLff208tPhx5Xyo1iKsQf7h93UTxWOLYl7pOUaVGmB7wlsHYkQIQ18hcefa3D9JEBpvnkpIjwvBWC7XXNdlGFJDUdtkpdQ',
    tradeTest: 'State Wireman License #TEL-EL-88432',
    status: 'pending',
    docsSummary: {
      certificate: 'State Electrical Inspectorate Wireman License Grade 1',
      policeClearance: 'Background Record Cleaned & Certified',
      sponsors: 'Solar Co-op Secretariat Sign-off',
      aadhaarKYC: true
    }
  }
];

export const INITIAL_JOB_REQUEST: ActiveJobRequest = {
  id: 'JOB-EMERG-892',
  title: 'Short Circuit / MCB Trip',
  category: 'Electrical Emergency',
  description: 'Main breaker tripping with sparking in distribution box',
  customerName: 'Mrs. Ananya Sharma',
  customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnqdK1geooDma7OGyd0ANBja7CCnna4KHHdK7v-t0HNTKjSJ0keGGg3RUFmC_crhA3nXsgR23QDX8-RbfIW2lknAATAFwDLrRRYK4zDwcctYnlHiZNNskWdsR79lB4-aP52_WXFq6HQ1CW4pxVB9c6fFtqwpoivhw034wNj6Gq_Gq1pAHxB5XaZU5zJnr6VTnBxMgueCHqICJv9MvsgvJgIv4Dsdg0He-KMKE0dIs7hcSFQ3FtiViFzg',
  customerAddress: 'Villa 14B, Road No. 36, Jubilee Hills, Ward 8, Hyderabad',
  customerPhone: '+91 98765 43210',
  distance: '0.8 km away (Jubilee Hills)',
  transitTime: '4 mins transit',
  payout: 420,
  guaranteeText: '100% Direct to You • 0% Co-op Cut',
  expirySeconds: 18,
  mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAm8Qlbsn-cFzEKUwOqjmVpMjC3wWa8SmgeNExQzqlXCiYARhpFa7tIrhoSt9gP2OnBGhp3KNV7xqHKdk4FB_3_jx8hFPs1tEc7Bm-ez_cDAmXrp6Qpz0rV_vnmfNq94mT7YGHXZ4KHDgBJ_N3ZNyMYFW5XIPRwfXEZMg8Sxvo2e970MFUh54p3Od1mMfAbLtUXKgAVhRzscyXJl6TAQWSbgoF5nrX57SBEr86-INZ8J7n7O5c6uR5oQ',
  optimalRouteText: 'Optimal route via Jubilee Hills Checkpost & Peddamma Temple Road',
  isEmergency: true
};

export const SCHEDULED_ACTIVITIES: ScheduledActivity[] = [
  {
    id: 'act-1',
    title: 'Fan Rewiring & Capacitor Replacement',
    location: 'Road No. 36, Jubilee Hills, Hyderabad',
    time: '10:30 AM • Jubilee Hills Road 36',
    price: '+₹380',
    type: 'completed',
    rating: 5.0,
    tag: 'Paid UPI Direct'
  },
  {
    id: 'act-2',
    title: 'Inverter Battery Acid & Terminal Servicing',
    location: 'Anand Vihar Flat 12B, Banjara Hills Ward 9, Hyderabad',
    time: '02:00 PM • Banjara Hills Ward 9',
    price: '₹650 est.',
    type: 'scheduled',
    tag: 'Routine Quarterly Maintenance'
  }
];

export const INITIAL_EMERGENCY_SOS: EmergencySOS = {
  id: 'SOS-892',
  type: 'Gas Pipe Inspection & Leak',
  title: 'Gas Pipe Inspection & Leak',
  location: 'Road No. 36, Jubilee Hills • Res. Villa 14B, Hyderabad (17.4319° N, 78.4073° E)',
  assignedWorker: 'Ravi Teja M.',
  assignedWorkerRole: 'Master Pipefitter (Level 4)',
  eta: '4 min',
  status: 'en_route'
};

export const PENDING_VERIFICATIONS = [
  {
    id: 'VERIF-891',
    name: 'Suresh Verma',
    trade: 'Master Electrician',
    society: 'Hyderabad Urban Artisan Guild (#41)',
    aadhaarNumber: 'XXXX-XXXX-4819',
    certificateName: 'ITI National Wireman Grade 1 & NCVT Level 3',
    submittedDate: '09 Sep 2024',
    status: 'pending',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5dRGgLTbsENaJBaV0AEmJiPTxZ5eq74vLlc8UTcyPU3OeXHwlY4DUxn8SULUzyD8bdYSIUg_zTt2-3URnrCMdqNQVf2vQp4-yfY4HOA_SRo139ThoUZUg0F9SxXTvI2LxZ2ls0LwPtm0twpKKC_lg8M1DsEZoPGs4Fw16PRT_MkiMrtw8yzfrY5_mPevPH5wz2AMnqtwDslPStJPM9oTr6lrpjfmGpKwHZlF-r0AUxg8VOgAsiBfSLA'
  },
  {
    id: 'VERIF-892',
    name: 'Fatima Begum',
    trade: 'Wood Artisan',
    society: 'Hyderabad Central Labour Union (#14)',
    aadhaarNumber: 'XXXX-XXXX-9124',
    certificateName: 'Craftsman Guild Test Grade A & Trade Peer Cert',
    submittedDate: '08 Sep 2024',
    status: 'under-review',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrxxnQCpPO3wgDgmmsSeE-2HQ-fmgxzRkaCWZlzpAQrDK4wI66i0QcOiJRXSpmw0bEhJSnmgchGPgix7ljO5xbyb0ZTTipPrk5mXuIkliYOZKrXtBWYw3SOwC-S9zS5C5yOCJR07UX5QrluMC9SzP02ZxxRQJvtry71q1h53HpkklAkjz3nj2ZLHVyv4QbmGiRINc-WCENE-xoepTAw1AvNE-0rKSNM2WBOmrSMpKi-MzeD2S5A-daTA'
  },
  {
    id: 'VERIF-893',
    name: 'Anand Rao',
    trade: 'Solar & High-Voltage Tech',
    society: 'Greater Hyderabad Co-op (#8821)',
    aadhaarNumber: 'XXXX-XXXX-3381',
    certificateName: 'State Wireman License #TEL-EL-88432',
    submittedDate: '07 Sep 2024',
    status: 'pending',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKdoiB1H_fQBkVHnmbs5Uk5L5SzOBMEZLApwTHIfS8oCRZ0zDRARJQryU7sTmEqhDV-AKh7KN4w5RFc_ngsBfgx_VS-MfUiGx7xw-92JtbEOrAYNqr5o86s_B5LHCdfj-QUqajGXvViyNsnGgDfr3DXXKHbLff208tPhx5Xyo1iKsQf7h93UTxWOLYl7pOUaVGmB7wlsHYkQIQ18hcefa3D9JEBpvnkpIjwvBWC7XXNdlGFJDUdtkpdQ'
  }
];

export const MOCK_DISPATCH_INCIDENTS = [
  {
    id: 'INC-701',
    type: 'Electrical Sparking',
    title: 'Short Circuit / MCB Trip in Distribution Box',
    location: 'Flat 402, Cyber Heights, Sector 2, Madhapur (Ward 108)',
    assignedWorker: 'Ramesh Kumar',
    slaTime: '7 mins left',
    status: 'en-route',
    priority: 'critical'
  },
  {
    id: 'INC-702',
    type: 'Pipeline Rupture',
    title: 'Main Inlet Pipeline Burst - Water Leakage',
    location: 'Villa 14B, Road No. 36, Jubilee Hills (Ward 8)',
    assignedWorker: 'Ravi Teja M.',
    slaTime: '3 mins left',
    status: 'en-route',
    priority: 'high'
  },
  {
    id: 'INC-703',
    type: 'Transformer Tripping',
    title: 'Phase Drop in Local Alleyway Supply',
    location: 'Prakash Nagar, Begumpet Main Road (Ward 149)',
    assignedWorker: 'Sunil Prasad',
    slaTime: '12 mins left',
    status: 'dispatched',
    priority: 'medium'
  }
];

export const ARTISAN_COMMUNITY_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuClbvufoVSB0DmrF4ljY-daIG0RdMfTS2q7ALOEIGJpJquN5Y5Q15Rgf9tX7caDPpR1uodvWfHxf1uhJ5HnzrXC01I337M_55WLb6A7bvqlmG3pH3vuX0rf63Aw1NuP5yc3W3V3qwVHfykQ8ofjLREkjH2a1EyCnbs82wtuTXc8obFlDGYXMpYUjB000dYXvkJvs4-iSy6yqi2Xw5U7S4ockIar4snzGpHZUCdOuAKh5Mfip_XCqN22ag',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAhA0lkL-a1EKRDvCYayon_MAoXhoiaygh5C3JiYK-ZDnGPlKPzx2iQMBOHMX0jctqJsS61tRHOoi7gprNGfPXSEOQMP8isb_GOzSvxiYX7u274mje4KYhIRo8DdvxMJTYw-yU_wVISnFaTcuWbl9DatSsxAQl_Jf0StaIwoP7YRN4TmDBOvGQJ6ieZF6Sn4ZmjyLvxLfZznUw1kBFeHbell8OcMmki24haHoP_E1Fd1DteA7tvl0B7Qg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPnrLh1lJoNpPAfL-tqHhxiAoWY_bQroVfw_jipR0EwwML3A8JMfcia4h5lBZcSKarQRgqtmELBhblSjSOdT8KKJ6qjfPeKdGybNXD8ICHOLBBdW8R3Uc9zj2-iuHh32JDczUfthCRf9WJYgkZ_iFXSctkMN0XT6ed_MxDLOOdQgxzeN0Jz5oVhoqxjCbKrcZrSA9-aW-32F-aQgRftStCu0BOm8ZkAQEdvr2wPoyD2GQiR1DBaXXa8g'
];
