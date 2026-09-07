const TOKEN_URL =
  'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
const REFRESH_THRESHOLD_SECONDS = 60;

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
}

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.FLW_CLIENT_ID;
  const clientSecret = process.env.FLW_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'FLW_CLIENT_ID and FLW_CLIENT_SECRET are required for v4 API authentication',
    );
  }

  return { clientId, clientSecret };
}

async function fetchAccessToken(): Promise<string> {
  const { clientId, clientSecret } = getCredentials();

  let response: Response;
  try {
    response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Network error while requesting v4 access token: ${message}`,
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to obtain v4 access token: ${response.status} ${response.statusText}`,
    );
  }

  let data: TokenResponse;
  try {
    data = (await response.json()) as TokenResponse;
  } catch {
    throw new Error(
      'Failed to parse response from Flutterwave OAuth endpoint as JSON',
    );
  }

  if (!data.access_token || typeof data.expires_in !== 'number') {
    throw new Error('Invalid token response from Flutterwave OAuth endpoint');
  }

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedAccessToken;
}

export async function getAccessToken(): Promise<string> {
  const secondsRemaining = (tokenExpiresAt - Date.now()) / 1000;

  if (cachedAccessToken && secondsRemaining >= REFRESH_THRESHOLD_SECONDS) {
    return cachedAccessToken;
  }

  return fetchAccessToken();
}

/** Clears in-memory token cache (for tests only). */
export function resetAccessTokenCacheForTesting(): void {
  cachedAccessToken = null;
  tokenExpiresAt = 0;
}
