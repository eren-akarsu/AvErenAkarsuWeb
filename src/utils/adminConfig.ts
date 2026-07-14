export const ADMIN_EMAILS = [
  'averenakarsu@gmail.com',
  'erenakarsu@istanbul.av.tr'
];

/**
 * Validates whether the given email address is in the administrator whitelist.
 */
export const isAdminEmail = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};
