import { getAccessToken } from './authV4.js';
import { getV4BaseUrl } from './environmentV4.js';

export async function flwV4Fetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const baseUrl = getV4BaseUrl();
  const token = await getAccessToken();
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
