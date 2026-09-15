/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientProfile } from '../types';

export const DEFAULT_CLIENT_PROFILE: ClientProfile = {
  id: 'cust-owais-8832',
  name: 'Mohammed Owais',
  phone: '+91 98765 43210',
  email: 'mohammedowais285@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  address: 'Villa 14B, Road No. 36, Jubilee Hills',
  locality: 'Jubilee Hills, Circle 18',
  wardNumber: 'Ward 8 (Jubilee Hills)',
  pinCode: '500033',
  emergencyContactName: 'Fatima Owais (Spouse)',
  emergencyContactPhone: '+91 94401 23456',
  membershipId: 'TS-HYD-CUST-8832',
  membershipTier: 'Active Citizen Patron',
  registeredDate: 'Today (New Application)',
  totalBookings: 0,
  welfareContribution: 0,
  savedAddresses: [
    {
      id: 'addr-home',
      label: 'Home',
      address: 'Villa 14B, Road No. 36, Jubilee Hills',
      ward: 'Ward 8 (Jubilee Hills)',
      pinCode: '500033',
      isPrimary: true,
      latitude: 17.4319,
      longitude: 78.4073,
    },
    {
      id: 'addr-office',
      label: 'Office',
      address: 'Floor 6, Cyber Heights, Hitec City, Sector 2',
      ward: 'Ward 108 (Madhapur)',
      pinCode: '500081',
      isPrimary: false,
      latitude: 17.4483,
      longitude: 78.3915,
    },
    {
      id: 'addr-parents',
      label: 'Parents',
      address: 'Plot 42, Anand Vihar, Road No. 12, Banjara Hills',
      ward: 'Ward 9 (Banjara Hills)',
      pinCode: '500034',
      isPrimary: false,
      latitude: 17.4156,
      longitude: 78.4350,
    },
  ],
  preferences: {
    language: 'en',
    smsAlerts: true,
    whatsappUpdates: true,
    safetyPinRequired: true,
    ecoFriendlyArtisans: true,
  },
};

export const DEFAULT_AUTHENTICATED_USERS = {
  customer: {
    id: 'cust-owais-8832',
    name: 'Mohammed Owais',
    phone: '+91 98765 43210',
    email: 'mohammedowais285@gmail.com',
    role: 'customer' as const,
    locality: 'Jubilee Hills, Circle 18 (Hyderabad)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    membershipId: 'TS-HYD-CUST-8832',
    designation: 'Citizen Patron Member',
  },
  worker: {
    id: 'worker-ramesh-41',
    name: 'Ramesh Kumar',
    phone: '+91 98490 28141',
    email: 'ramesh.electric@telanganacoop.org',
    role: 'worker' as const,
    locality: 'Ward 8 (Jubilee Hills / Madhapur Hub)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArkEIb8owwJnrwrbTTBUtlA8oUK2Fw0YpAIdxUXKmMqv6wQ5dvhn0fCxCOSdbvoQ65Jl02b0AUCTG26HskFAugF3wJVuadzgsbCs0GGviVkGtrBD2CV9gqQtQY1C82oZM2Egvt8zU1P-mpPehWESMletfOUcAgT8JM0GaCRbcQfcz158ZBtqluClZ_hmCpQJdK_mtQgMLkleiVNnI8ZzYDKBGnnIZFI8XTSOmCEN0weIiWQcdun6Le2g',
    membershipId: 'TS-COOP-WRK-4102',
    designation: 'Master Electrician (Class A)',
    trade: 'Master Electrician',
    society: 'Hyderabad Urban Artisan Guild (#41)',
    ward: 'Ward 8 (Jubilee Hills)',
    aadhaarNumber: 'XXXX-XXXX-4819',
    aadhaarVerified: true,
  },
  admin: {
    id: 'admin-sec-01',
    name: 'Dr. K. Srinivas Rao, IAS',
    phone: '+91 94400 11223',
    email: 'registrar@coopfederation.telangana.gov.in',
    role: 'admin' as const,
    locality: 'Hyderabad Secretariat Command Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    membershipId: 'TS-ADMIN-SUPER-01',
    designation: 'Chief Federation Registrar',
    isSuperAdmin: true,
  },
};

export interface RoleCredentialInfo {
  role: 'customer' | 'worker' | 'admin';
  title: string;
  tempId: string;
  tempPassword: string;
  quickFillLabel: string;
  subTrade?: string;
  society?: string;
  badge: string;
}

export const TEMPORARY_CREDENTIALS: Record<'customer' | 'worker' | 'admin', RoleCredentialInfo> = {
  customer: {
    role: 'customer',
    title: 'Client / Citizen Patron',
    tempId: 'mohammedowais285@gmail.com',
    tempPassword: 'Client@123',
    quickFillLabel: 'mohammedowais285@gmail.com / Client@123',
    badge: 'Circle 18 Jubilee Hills Patron',
  },
  worker: {
    role: 'worker',
    title: 'Artisan Member',
    tempId: 'ramesh.electric@telanganacoop.org',
    tempPassword: 'Worker@123',
    quickFillLabel: 'ramesh.electric@telanganacoop.org / Worker@123',
    subTrade: 'Master Electrician (Class A)',
    society: 'Hyderabad Urban Artisan Guild (#41)',
    badge: 'Society #41 Registered Artisan',
  },
  admin: {
    role: 'admin',
    title: 'Secretariat Administrator',
    tempId: 'admin@helperzzz.coop',
    tempPassword: 'Admin@123',
    quickFillLabel: 'admin@helperzzz.coop / Admin@123',
    badge: 'Triple-Domain Master Clearance',
  },
};

