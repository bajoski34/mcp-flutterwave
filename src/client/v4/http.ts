import { getAccessToken, invalidateAccessTokenCache } from './auth.js';
import { getV4BaseUrl } from './environment.js';

async function performFetch(
  path: string,
  init: RequestInit | undefined,
  token: string,
): Promise<Response> {
  const baseUrl = getV4BaseUrl();
  const headers = new Headers(init?.headers);

  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  try {
    return await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Network error while calling Flutterwave v4 API (${path}): ${message}`,
      { cause: error },
    );
  }
}

export async function flwV4Fetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await getAccessToken();
  const response = await performFetch(path, init, token);

  if (response.status !== 401) {
    return response;
  }

  invalidateAccessTokenCache();
  const refreshedToken = await getAccessToken();
  return performFetch(path, init, refreshedToken);
}
