import { beforeEach, describe, expect, it, vi } from 'vitest';

const SANDBOX_BASE_URL = 'https://developersandbox-api.flutterwave.com';

const mockGetAccessToken = vi.fn();
const mockGetV4BaseUrl = vi.fn();

vi.mock('../../client/authV4.js', () => ({
  getAccessToken: mockGetAccessToken,
}));

vi.mock('../../client/environmentV4.js', () => ({
  getV4BaseUrl: mockGetV4BaseUrl,
}));

describe('v4 flwV4Fetch', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
    mockGetAccessToken.mockReset();
    mockGetV4BaseUrl.mockReset();
    mockGetV4BaseUrl.mockReturnValue(SANDBOX_BASE_URL);
    mockGetAccessToken.mockResolvedValue('test-access-token');
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
  });

  it('calls fetch with the correct concatenated URL', async () => {
    const { flwV4Fetch } = await import('../../client/httpV4.js');

    await flwV4Fetch('/charges');

    expect(mockFetch).toHaveBeenCalledWith(
      `${SANDBOX_BASE_URL}/charges`,
      expect.any(Object),
    );
  });

  it('sets Authorization Bearer header using token from getAccessToken', async () => {
    const { flwV4Fetch } = await import('../../client/httpV4.js');

    await flwV4Fetch('/charges');

    const [, init] = mockFetch.mock.calls[0]!;
    const headers = init.headers as Headers;

    expect(headers.get('Authorization')).toBe('Bearer test-access-token');
  });

  it('sets Content-Type to application/json', async () => {
    const { flwV4Fetch } = await import('../../client/httpV4.js');

    await flwV4Fetch('/charges');

    const [, init] = mockFetch.mock.calls[0]!;
    const headers = init.headers as Headers;

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('merges caller-provided headers without dropping them', async () => {
    const { flwV4Fetch } = await import('../../client/httpV4.js');

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
    const { flwV4Fetch } = await import('../../client/httpV4.js');
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

    const { flwV4Fetch } = await import('../../client/httpV4.js');

    const response = await flwV4Fetch('/charges');

    expect(response).toBe(errorResponse);
    expect(response.status).toBe(400);
    expect(response.ok).toBe(false);
  });

  it('rethrows a wrapped error when fetch throws', async () => {
    const networkError = new TypeError('fetch failed');
    mockFetch.mockRejectedValueOnce(networkError);

    const { flwV4Fetch } = await import('../../client/httpV4.js');

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

    const { flwV4Fetch } = await import('../../client/httpV4.js');

    await expect(flwV4Fetch('/charges')).rejects.toThrow(
      'FLW_CLIENT_ID and FLW_CLIENT_SECRET are required for v4 API authentication',
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
