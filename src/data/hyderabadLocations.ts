/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerLocation } from '../types';

export const HYDERABAD_GEO_CENTER = {
  latitude: 17.385044,
  longitude: 78.486671,
  city: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
  elevationMsl: '542m',
  municipalBody: 'Greater Hyderabad Municipal Corporation (GHMC)',
};

export const HYDERABAD_POPULAR_WARDS: CustomerLocation[] = [
  {
    id: 'hyd-jubilee-hills',
    name: 'Jubilee Hills • Road 36',
    address: 'Villa 14B, Road No. 36, Jubilee Hills',
    locality: 'Jubilee Hills, Circle 18',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500033',
    latitude: 17.4319,
    longitude: 78.4073,
    wardNumber: 'Ward 8 (Jubilee Hills)',
    ghmcZone: 'GHMC Khairatabad / West Zone',
    landmark: 'Near Peddamma Temple Metro Station & Journalist Colony',
    accuracyMeters: 4,
  },
  {
    id: 'hyd-banjara-hills',
    name: 'Banjara Hills • Road 12',
    address: 'Plot 42, Anand Vihar, Road No. 12, Banjara Hills',
    locality: 'Banjara Hills, Circle 18',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500034',
    latitude: 17.4156,
    longitude: 78.4350,
    wardNumber: 'Ward 9 (Banjara Hills)',
    ghmcZone: 'GHMC Khairatabad Zone',
    landmark: 'Near Care Hospital & Taj Krishna Circle',
    accuracyMeters: 5,
  },
  {
    id: 'hyd-madhapur-hitec',
    name: 'Madhapur • Hitec City',
    address: 'Flat 402, Cyber Heights, Sector 2, Madhapur',
    locality: 'Hitec City / Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500081',
    latitude: 17.4483,
    longitude: 78.3915,
    wardNumber: 'Ward 108 (Madhapur)',
    ghmcZone: 'GHMC Serilingampally Zone',
    landmark: 'Adjacent to Inorbit Mall & Durgam Cheruvu Cable Bridge',
    accuracyMeters: 6,
  },
  {
    id: 'hyd-gachibowli',
    name: 'Gachibowli • Financial Dist',
    address: 'Tower 3, Apt 902, Golf View, Financial District',
    locality: 'Gachibowli / Financial District',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500032',
    latitude: 17.4401,
    longitude: 78.3489,
    wardNumber: 'Ward 107 (Gachibowli)',
    ghmcZone: 'GHMC Serilingampally Zone',
    landmark: 'Near Wipro Junction & IIIT Hyderabad',
    accuracyMeters: 5,
  },
  {
    id: 'hyd-kondapur',
    name: 'Kondapur • Raghava Colony',
    address: 'Flat 304, Green Meadows, Raghava Colony',
    locality: 'Kondapur',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500084',
    latitude: 17.4699,
    longitude: 78.3578,
    wardNumber: 'Ward 104 (Kondapur)',
    ghmcZone: 'GHMC Serilingampally Zone',
    landmark: 'Opposite Hyderabad Botanical Garden',
    accuracyMeters: 8,
  },
  {
    id: 'hyd-begumpet',
    name: 'Begumpet • Secunderabad',
    address: 'House No. 1-11-256, Prakash Nagar, Begumpet',
    locality: 'Begumpet / Secunderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500016',
    latitude: 17.4435,
    longitude: 78.4720,
    wardNumber: 'Ward 149 (Begumpet)',
    ghmcZone: 'GHMC Secunderabad Zone',
    landmark: 'Near Old Begumpet Airport & Shoppers Stop',
    accuracyMeters: 4,
  },
  {
    id: 'hyd-charminar',
    name: 'Charminar • Old City',
    address: 'Haveli 18, Moghalpura, Near Laad Bazaar',
    locality: 'Moghalpura / Charminar',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500002',
    latitude: 17.3616,
    longitude: 78.4747,
    wardNumber: 'Ward 48 (Moghalpura)',
    ghmcZone: 'GHMC South Zone (Charminar)',
    landmark: '180m from Charminar Monument & Mecca Masjid',
    accuracyMeters: 7,
  },
  {
    id: 'hyd-kukatpally',
    name: 'Kukatpally • KPHB Phase 3',
    address: 'MIG 112, 5th Road, KPHB Colony Phase 3',
    locality: 'Kukatpally',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500072',
    latitude: 17.4875,
    longitude: 78.4158,
    wardNumber: 'Ward 114 (KPHB)',
    ghmcZone: 'GHMC Kukatpally Zone',
    landmark: 'Near Forum Sujana Mall & KPHB Metro Station',
    accuracyMeters: 6,
  }
];

export const DEFAULT_CUSTOMER_LOCATION: CustomerLocation = HYDERABAD_POPULAR_WARDS[0];

/**
 * Calculates distance in kilometers between two geo-coordinates using Haversine formula
 */
export function calculateGeoDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the closest Hyderabad ward to provided latitude and longitude
 */
export function findNearestHyderabadWard(lat: number, lon: number): CustomerLocation {
  let closest = HYDERABAD_POPULAR_WARDS[0];
  let minDistance = Infinity;

  for (const ward of HYDERABAD_POPULAR_WARDS) {
    const dist = calculateGeoDistanceKm(lat, lon, ward.latitude, ward.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = ward;
    }
  }

  return closest;
}
