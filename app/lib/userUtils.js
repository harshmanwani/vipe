"use client";

/**
 * Normalizes user data to ensure both apartment and discord_name fields are available
 * This provides backward compatibility during the transition period
 * @param {Object} user - The user object from the database
 * @returns {Object} - Normalized user object with both fields
 */
export const normalizeUserData = (user) => {
  if (!user) return null;
  
  const normalizedUser = { ...user };
  
  // Handle case where only apartment exists (old data)
  if (user.apartment && !user.discord_name) {
    normalizedUser.discord_name = user.apartment;
  }
  
  // Handle case where only discord_name exists (new data)
  if (user.discord_name && !user.apartment) {
    normalizedUser.apartment = user.discord_name;
  }
  
  return normalizedUser;
};

/**
 * Gets the appropriate display name (discord_name preferred, apartment as fallback)
 * @param {Object} user - The user object
 * @returns {string} - The display name to use
 */
export const getDisplayName = (user) => {
  if (!user) return '';
  return user.discord_name || user.apartment || '';
}; 