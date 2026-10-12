import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('getCharge', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({ status: 'success', data: { id: 'chg_1', status: 'succeeded' } }),
        { status: 200 },
      ),
    );
  });

  it('GETs /charges/{id}', async () => {
    const { getCharge } = await import('../../tools/v4/getCharge.js');

    const result = await getCharge({ id: 'chg_1' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/charges/chg_1', {
      method: 'GET',
    });
    expect(result.content[0]?.text).toContain('succeeded');
  });

  it('rejects an empty id before calling the API', async () => {
    const { getCharge } = await import('../../tools/v4/getCharge.js');

    await expect(getCharge({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the id into the request path', async () => {
    const { getCharge } = await import('../../tools/v4/getCharge.js');

    await getCharge({ id: 'chg_/weird id' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/charges/chg_%2Fweird%20id', {
      method: 'GET',
    });
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { getCharge } = await import('../../tools/v4/getCharge.js');

    await expect(getCharge({ id: 'chg_missing' })).rejects.toThrow(
      'Flutterwave v4 get charge request failed: 404',
    );
  });

  it('returns isError from the registered handler when the call throws', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { handleGetCharge } = await import('../../tools/v4/register.js');

    const result = await handleGetCharge({ id: 'chg_missing' });

    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
