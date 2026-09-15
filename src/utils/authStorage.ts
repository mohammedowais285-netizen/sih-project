/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegisteredUserAccount, AuthenticatedUser } from '../types';
import { DEFAULT_AUTHENTICATED_USERS, DEFAULT_CLIENT_PROFILE } from '../data/defaultProfile';

const STORAGE_KEY = 'helperzzz_registered_users';

export const INITIAL_REGISTERED_ACCOUNTS: RegisteredUserAccount[] = [
  {
    username: 'owais_patron',
    password: 'Client@123',
    registeredAt: '2024-10-15',
    user: {
      id: DEFAULT_CLIENT_PROFILE.id,
      name: DEFAULT_CLIENT_PROFILE.name,
      username: 'owais_patron',
      phone: DEFAULT_CLIENT_PROFILE.phone,
      email: DEFAULT_CLIENT_PROFILE.email,
      role: 'customer',
      avatar: DEFAULT_CLIENT_PROFILE.avatar,
      locality: DEFAULT_CLIENT_PROFILE.locality,
      ward: DEFAULT_CLIENT_PROFILE.wardNumber,
      designation: 'Citizen Patron Member',
    },
  },
  {
    username: 'ramesh_artisan',
    password: 'Worker@123',
    registeredAt: '2024-11-01',
    user: {
      ...DEFAULT_AUTHENTICATED_USERS.worker,
      username: 'ramesh_artisan',
    },
  },
  {
    username: 'admin_registrar',
    password: 'Admin@123',
    registeredAt: '2024-09-01',
    user: {
      ...DEFAULT_AUTHENTICATED_USERS.admin,
      username: 'admin_registrar',
    },
  },
];

export const getRegisteredAccounts = (): RegisteredUserAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore parse error
  }
  // Initialize with initial accounts
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
  } catch {
    // ignore
  }
  return INITIAL_REGISTERED_ACCOUNTS;
};

export const saveRegisteredAccount = (newAccount: RegisteredUserAccount): void => {
  const current = getRegisteredAccounts();
  // Filter out any existing with same username (case-insensitive) or email
  const updated = current.filter(
    (acc) =>
      acc.username.toLowerCase() !== newAccount.username.toLowerCase() &&
      acc.user.email.toLowerCase() !== newAccount.user.email.toLowerCase()
  );
  updated.unshift(newAccount);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

export const findAccount = (
  identifier: string
): RegisteredUserAccount | undefined => {
  const accounts = getRegisteredAccounts();
  const clean = identifier.trim().toLowerCase();
  const cleanPhone = identifier.replace(/\D/g, '');

  return accounts.find((acc) => {
    if (acc.username.toLowerCase() === clean) return true;
    if (acc.user.email.toLowerCase() === clean) return true;
    if (cleanPhone && acc.user.phone.replace(/\D/g, '').includes(cleanPhone)) return true;
    return false;
  });
};

/**
 * Resets the entire application to 0 parameter (clean factory state).
 * Clears authentication session, custom bookings, local cache, and resets
 * to the baseline state.
 */
export const resetAllToFactoryBaseline = (): void => {
  try {
    localStorage.removeItem('helperzzz_current_user');
    localStorage.removeItem('helperzzz_client_profile');
    localStorage.removeItem('helperzzz_customer_bookings');
    localStorage.removeItem('helperzzz_custom_verifications');
    localStorage.removeItem('helperzzz_registered_users');
  } catch {
    // ignore
  }
};

