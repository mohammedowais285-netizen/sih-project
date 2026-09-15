export type UserRole = 'customer' | 'worker' | 'admin';
export type AppLanguage = 'en' | 'hi' | 'te';
export type ViewMode = 'mobile-frame' | 'responsive';

export interface AuthenticatedUser {
  id: string;
  name: string;
  username?: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  designation?: string;
  society?: string;
  ward?: string;
  isSuperAdmin?: boolean;
  locality?: string;
  aadhaarNumber?: string;
  aadhaarVerified?: boolean;
  trade?: string;
  experienceYears?: number;
}

export interface RegisteredUserAccount {
  username: string;
  password: string;
  user: AuthenticatedUser;
  registeredAt: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Office' | 'Parents' | 'Other';
  address: string;
  ward: string;
  pinCode: string;
  isPrimary: boolean;
  latitude: number;
  longitude: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  address: string;
  locality: string;
  wardNumber: string;
  pinCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  membershipId: string;
  membershipTier: string;
  registeredDate: string;
  totalBookings: number;
  welfareContribution: number;
  savedAddresses: SavedAddress[];
  preferences: {
    language: AppLanguage;
    smsAlerts: boolean;
    whatsappUpdates: boolean;
    safetyPinRequired: boolean;
    ecoFriendlyArtisans: boolean;
  };
}

export interface CustomerLocation {
  id: string;
  name: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  wardNumber: string;
  ghmcZone: string;
  landmark?: string;
  isGpsDetected?: boolean;
  accuracyMeters?: number;
}

export interface WorkerProfile {
  id: string;
  name: string;
  trade: string;
  subTrade?: string;
  society: string;
  societyCode: string;
  rating: number;
  completedJobs: number;
  distance: string;
  eta: string;
  basePrice: number;
  avatar: string;
  isOnline: boolean;
  status: 'idle' | 'on_job' | 'en_route';
  badges: string[];
  certifications: string[];
  bio?: string;
  phone?: string;
}

export interface VerificationCandidate {
  id: string;
  name: string;
  category: string;
  experience: string;
  specialization: string;
  avatar: string;
  tradeTest: string;
  status: 'pending' | 'endorsed' | 'activated';
  docsSummary: {
    certificate: string;
    policeClearance: string;
    sponsors: string;
    aadhaarKYC: boolean;
  };
}

export interface ServiceCategory {
  id: string;
  title: string;
  startingPrice: number;
  icon: string;
  badge?: string;
  bgClass: string;
  textClass: string;
}

export interface ActiveJobRequest {
  id: string;
  title: string;
  category: string;
  description: string;
  customerName: string;
  customerAvatar: string;
  customerAddress: string;
  customerPhone: string;
  distance: string;
  transitTime: string;
  payout: number;
  guaranteeText: string;
  expirySeconds: number;
  mapImage: string;
  optimalRouteText: string;
  isEmergency: boolean;
}

export interface ScheduledActivity {
  id: string;
  title: string;
  time: string;
  location: string;
  price: string;
  type: 'completed' | 'scheduled';
  rating?: number;
  tag?: string;
}

export interface EmergencySOS {
  id: string;
  type: string;
  title: string;
  location: string;
  assignedWorker?: string;
  assignedWorkerRole?: string;
  eta: string;
  status: 'dispatching' | 'en_route' | 'arrived' | 'resolved';
}
