/**
 * Service centralisant tous les appels au backend d'authentification.
 * Comme pour aiService.ts : le composant React ne parle jamais directement
 * à fetch() — il passe par ces fonctions, propres et réutilisables.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'tourist' | 'guide' | 'artisan' | 'admin' | 'traveler' | 'partner';
  accreditationStatus?: 'pending' | 'verified' | 'rejected' | 'info_requested';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function parseOrThrow(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue.');
  }
  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string = 'tourist',
  phone: string = ''
): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role, phone }),
  });
  return parseOrThrow(response);
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseOrThrow(response);
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return parseOrThrow(response);
}

export async function verifyOtpCode(email: string, code: string): Promise<{ success: boolean; resetToken: string }> {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  return parseOrThrow(response);
}

export async function confirmPasswordReset(
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetToken, newPassword }),
  });
  return parseOrThrow(response);
}

/**
 * Soumet une candidature Guide ou Artisan. Nécessite un token JWT (compte
 * connecté) — envoyé dans l'en-tête Authorization, vérifié par le
 * middleware requireAuth côté serveur.
 */
export async function submitPartnerApplication(
  token: string,
  type: 'guide' | 'artisan',
  details: Record<string, any>
): Promise<{ success: boolean; applicationId: string; message: string }> {
  const response = await fetch('/api/partner/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, details }),
  });
  return parseOrThrow(response);
}
