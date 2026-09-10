import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TOKEN_URL =
  'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';

describe('v4 getAccessToken', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    process.env.FLW_CLIENT_ID = 'test-client-id';
    process.env.FLW_CLIENT_SECRET = 'test-client-secret';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'test-access-token',
        expires_in: 600,
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete process.env.FLW_CLIENT_ID;
    delete process.env.FLW_CLIENT_SECRET;
  });

  it('fetches a token on first call with correct URL, headers, and body', async () => {
    const { getAccessToken } = await import('../../client/v4/auth.js');

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
    const { getAccessToken } = await import('../../client/v4/auth.js');

    const first = await getAccessToken();
    const second = await getAccessToken();

    expect(first).toBe('test-access-token');
    expect(second).toBe('test-access-token');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('deduplicates concurrent cold-cache token requests', async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    mockFetch.mockReturnValueOnce(fetchPromise);

    const { getAccessToken } = await import('../../client/v4/auth.js');

    const first = getAccessToken();
    const second = getAccessToken();

    expect(mockFetch).toHaveBeenCalledTimes(1);

    resolveFetch({
      ok: true,
      json: async () => ({
        access_token: 'shared-access-token',
        expires_in: 600,
      }),
    });

    await expect(Promise.all([first, second])).resolves.toEqual([
      'shared-access-token',
      'shared-access-token',
    ]);
  });

  it('refetches when less than 60 seconds remain before expiry', async () => {
    vi.useFakeTimers();

    const { getAccessToken } = await import('../../client/v4/auth.js');

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
  });

  it('throws when credentials are missing', async () => {
    delete process.env.FLW_CLIENT_ID;
    delete process.env.FLW_CLIENT_SECRET;

    const { getAccessToken } = await import('../../client/v4/auth.js');

    await expect(getAccessToken()).rejects.toThrow(
      'FLW_CLIENT_ID and FLW_CLIENT_SECRET are required for v4 API authentication',
    );
  });

  it('throws a wrapped error when fetch fails with a network error', async () => {
    const networkError = new TypeError('fetch failed');
    mockFetch.mockRejectedValueOnce(networkError);

    const { getAccessToken } = await import('../../client/v4/auth.js');

    await expect(getAccessToken()).rejects.toMatchObject({
      message: 'Network error while requesting v4 access token: fetch failed',
      cause: networkError,
    });
  });

  it('includes response body when OAuth returns a non-OK status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () =>
        JSON.stringify({
          error: 'invalid_client',
          error_description: 'Invalid client credentials',
        }),
    });

    const { getAccessToken } = await import('../../client/v4/auth.js');

    await expect(getAccessToken()).rejects.toThrow(
      'Failed to obtain v4 access token: 401 Unauthorized: {"error":"invalid_client","error_description":"Invalid client credentials"}',
    );
  });

  it('throws when the OAuth response body is not valid JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });

    const { getAccessToken } = await import('../../client/v4/auth.js');

    await expect(getAccessToken()).rejects.toThrow(
      'Failed to parse response from Flutterwave OAuth endpoint as JSON',
    );
  });
});
