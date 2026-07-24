/**
 * PIN Protection Utilities
 * Provides SHA-256 hashing and verification for PIN-protected profiles.
 */

/**
 * Hashes a PIN string using SHA-256 via the Web Crypto API.
 * @param {string} pin - The plaintext PIN to hash.
 * @returns {Promise<string>} The hex-encoded SHA-256 hash.
 */
export async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies a plaintext PIN against a stored hash.
 * @param {string} pin - The plaintext PIN entered by the user.
 * @param {string} storedHash - The previously-stored SHA-256 hash.
 * @returns {Promise<boolean>} True if the PIN matches.
 */
export async function verifyPIN(pin, storedHash) {
  const pinHash = await hashPIN(pin);
  return pinHash === storedHash;
}
