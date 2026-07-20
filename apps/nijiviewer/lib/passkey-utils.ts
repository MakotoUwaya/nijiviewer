/**
 * Check if the browser supports WebAuthn/Passkeys
 */
export const isWebAuthnSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === 'function'
  );
};

/**
 * Convert technical Passkey error messages to user-friendly messages
 */
export const getPasskeyErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'An unexpected error occurred. Please try again.';
  }

  const message = error.message.toLowerCase();

  // User cancelled the operation
  if (
    message.includes('abort') ||
    message.includes('cancel') ||
    message.includes('user') ||
    message.includes('timeout')
  ) {
    return 'Operation cancelled. Please try again when ready.';
  }

  // Browser/device doesn't support passkeys
  if (
    message.includes('not supported') ||
    message.includes('not available') ||
    message.includes('not allowed')
  ) {
    return 'Your browser or device does not support Passkeys. Please use email/password sign-in or try a different browser.';
  }

  // Network or server errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection')
  ) {
    return 'Network error. Please check your connection and try again.';
  }

  // Invalid or expired passkey
  if (
    message.includes('invalid') ||
    message.includes('expired') ||
    message.includes('not found')
  ) {
    return 'This Passkey is no longer valid. Please register a new one.';
  }

  // Relying Party ID mismatch (development environment)
  if (message.includes('relying party') || message.includes('rp id')) {
    return 'Passkeys can only be used on the production site (nijiviewer.mukwty.com). Please use email/password sign-in for local development.';
  }

  // Generic fallback with original error for debugging
  return `Failed to complete Passkey operation: ${error.message}`;
};
