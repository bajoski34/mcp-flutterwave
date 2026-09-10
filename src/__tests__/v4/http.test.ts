import { beforeEach, describe, expect, it, vi } from 'vitest';

const SANDBOX_BASE_URL = 'https://developersandbox-api.flutterwave.com';

const mockGetAccessToken = vi.fn();
const mockInvalidateAccessTokenCache = vi.fn();
const mockGetV4BaseUrl = vi.fn();

vi.mock('../../client/v4/auth.js', () => ({
  getAccessToken: mockGetAccessToken,
  invalidateAccessTokenCache: mockInvalidateAccessTokenCache,
}));

vi.mock('../../client/v4/environment.js', () => ({
  getV4BaseUrl: mockGetV4BaseUrl,
}));

describe('v4 flwV4Fetch', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    mockGetAccessToken.mockReset();
    mockInvalidateAccessTokenCache.mockReset();
    mockGetV4BaseUrl.mockReset();
    mockGetV4BaseUrl.mockReturnValue(SANDBOX_BASE_URL);
    mockGetAccessToken.mockResolvedValue('test-access-token');
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
  });

  it('calls fetch with the correct concatenated URL', async () => {
    const { flwV4Fetch } = await import('../../client/v4/http.js');

    await flwV4Fetch('/charges');

    expect(mockFetch).toHaveBeenCalledWith(
      `${SANDBOX_BASE_URL}/charges`,
      expect.any(Object),
    );
  });

  it('sets Authorization Bearer header using token from getAccessToken', async () => {
    const { flwV4Fetch } = await import('../../client/v4/http.js');

    await flwV4Fetch('/charges');

    const [, init] = mockFetch.mock.calls[0]!;
    const headers = init.headers as Headers;

    expect(headers.get('Authorization')).toBe('Bearer test-access-token');
  });

  it('sets Content-Type to application/json', async () => {
    const { flwV4Fetch } = await import('../../client/v4/http.js');

    await flwV4Fetch('/charges');

    const [, init] = mockFetch.mock.calls[0]!;
    const headers = init.headers as Headers;

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('merges caller-provided headers without dropping them', async () => {
    const { flwV4Fetch } = await import('../../client/v4/http.js');

    await flwV4Fetch('/charges', {
      headers: { 'X-Custom-Header': 'custom-value' },
    });

    const [, init] = mockFetch.mock.calls[0]!;
    const headers = init.headers as Headers;

    expect(headers.get('Authorization')).toBe('Bearer test-access-token');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('X-Custom-Header')).toBe('custom-value');
  });

  it('passes through init.method and init.body unchanged', async () => {
    const { flwV4Fetch } = await import('../../client/v4/http.js');
    const body = JSON.stringify({ amount: 1000 });

    await flwV4Fetch('/charges', { method: 'POST', body });

    const [, init] = mockFetch.mock.calls[0]!;

    expect(init.method).toBe('POST');
    expect(init.body).toBe(body);
  });

  it('returns the Response object from fetch as-is, including non-ok responses', async () => {
    const errorResponse = new Response(JSON.stringify({ error: 'bad request' }), {
      status: 400,
      statusText: 'Bad Request',
    });
    mockFetch.mockResolvedValueOnce(errorResponse);

    const { flwV4Fetch } = await import('../../client/v4/http.js');

    const response = await flwV4Fetch('/charges');

    expect(response).toBe(errorResponse);
    expect(response.status).toBe(400);
    expect(response.ok).toBe(false);
  });

  it('on 401 invalidates the cache, refreshes the token, and retries once', async () => {
    const unauthorized = new Response('expired', { status: 401 });
    const success = new Response(JSON.stringify({ ok: true }), { status: 200 });
    mockFetch
      .mockResolvedValueOnce(unauthorized)
      .mockResolvedValueOnce(success);
    mockGetAccessToken
      .mockResolvedValueOnce('stale-token')
      .mockResolvedValueOnce('fresh-token');

    const { flwV4Fetch } = await import('../../client/v4/http.js');

    const response = await flwV4Fetch('/charges');

    expect(response).toBe(success);
    expect(mockInvalidateAccessTokenCache).toHaveBeenCalledTimes(1);
    expect(mockGetAccessToken).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    const [, firstInit] = mockFetch.mock.calls[0]!;
    const [, secondInit] = mockFetch.mock.calls[1]!;
    expect((firstInit.headers as Headers).get('Authorization')).toBe(
      'Bearer stale-token',
    );
    expect((secondInit.headers as Headers).get('Authorization')).toBe(
      'Bearer fresh-token',
    );
  });

  it('does not retry indefinitely when the refreshed token also gets 401', async () => {
    const firstUnauthorized = new Response('expired', { status: 401 });
    const secondUnauthorized = new Response('still expired', { status: 401 });
    mockFetch
      .mockResolvedValueOnce(firstUnauthorized)
      .mockResolvedValueOnce(secondUnauthorized);
    mockGetAccessToken
      .mockResolvedValueOnce('stale-token')
      .mockResolvedValueOnce('fresh-token');

    const { flwV4Fetch } = await import('../../client/v4/http.js');

    const response = await flwV4Fetch('/charges');

    expect(response).toBe(secondUnauthorized);
    expect(response.status).toBe(401);
    expect(mockInvalidateAccessTokenCache).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('rethrows a wrapped error when fetch throws', async () => {
    const networkError = new TypeError('fetch failed');
    mockFetch.mockRejectedValueOnce(networkError);

    const { flwV4Fetch } = await import('../../client/v4/http.js');

    await expect(flwV4Fetch('/charges')).rejects.toMatchObject({
      message:
        'Network error while calling Flutterwave v4 API (/charges): fetch failed',
      cause: networkError,
    });
  });

  it('propagates errors from getAccessToken before fetch is called', async () => {
    mockGetAccessToken.mockRejectedValueOnce(
      new Error(
        'FLW_CLIENT_ID and FLW_CLIENT_SECRET are required for v4 API authentication',
      ),
    );

    const { flwV4Fetch } = await import('../../client/v4/http.js');

    await expect(flwV4Fetch('/charges')).rejects.toThrow(
      'FLW_CLIENT_ID and FLW_CLIENT_SECRET are required for v4 API authentication',
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
