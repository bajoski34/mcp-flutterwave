import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TOKEN_URL =
  'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';

describe('v4 getAccessToken', () => {
  const mockFetch = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    process.env.FLW_CLIENT_ID = 'test-client-id';
    process.env.FLW_CLIENT_SECRET = 'test-client-secret';
    const { resetAccessTokenCacheForTesting } = await import(
      '../../client/authV4.js'
    );
    resetAccessTokenCacheForTesting();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'test-access-token',
        expires_in: 600,
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.FLW_CLIENT_ID;
    delete process.env.FLW_CLIENT_SECRET;
  });

  it('fetches a token on first call with correct URL, headers, and body', async () => {
    const { getAccessToken } = await import('../../client/authV4.js');

    const token = await getAccessToken();

    expect(token).toBe('test-access-token');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        grant_type: 'client_credentials',
      }),
    });
  });

  it('returns cached token without calling fetch again while still valid', async () => {
    const { getAccessToken } = await import('../../client/authV4.js');

    const first = await getAccessToken();
    const second = await getAccessToken();

    expect(first).toBe('test-access-token');
    expect(second).toBe('test-access-token');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('refetches when less than 60 seconds remain before expiry', async () => {
    vi.useFakeTimers();

    const { getAccessToken } = await import('../../client/authV4.js');

    await getAccessToken();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'refreshed-access-token',
        expires_in: 600,
      }),
    });

    vi.advanceTimersByTime(541_000);

    const refreshed = await getAccessToken();

    expect(refreshed).toBe('refreshed-access-token');
    expect(mockFetch).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('throws when credentials are missing', async () => {
    delete process.env.FLW_CLIENT_ID;
    delete process.env.FLW_CLIENT_SECRET;

    const { getAccessToken } = await import('../../client/authV4.js');

    await expect(getAccessToken()).rejects.toThrow(
      'FLW_CLIENT_ID and FLW_CLIENT_SECRET are required for v4 API authentication',
    );
  });

  it('throws a wrapped error when fetch fails with a network error', async () => {
    const networkError = new TypeError('fetch failed');
    mockFetch.mockRejectedValueOnce(networkError);

    const { getAccessToken } = await import('../../client/authV4.js');

    await expect(getAccessToken()).rejects.toMatchObject({
      message: 'Network error while requesting v4 access token: fetch failed',
      cause: networkError,
    });
  });

  it('throws when the OAuth response body is not valid JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });

    const { getAccessToken } = await import('../../client/authV4.js');

    await expect(getAccessToken()).rejects.toThrow(
      'Failed to parse response from Flutterwave OAuth endpoint as JSON',
    );
  });
});
