import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('getRefund', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: { id: 'rfd_1', status: 'succeeded' },
        }),
        { status: 200 },
      ),
    );
  });

  it('GETs /refunds/{id}', async () => {
    const { getRefund } = await import('../../tools/v4/getRefund.js');

    const result = await getRefund({ id: 'rfd_1' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/refunds/rfd_1', {
      method: 'GET',
    });
    expect(result.content[0]?.text).toContain('succeeded');
  });

  it('rejects an empty id before calling the API', async () => {
    const { getRefund } = await import('../../tools/v4/getRefund.js');

    await expect(getRefund({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the id into the request path', async () => {
    const { getRefund } = await import('../../tools/v4/getRefund.js');

    await getRefund({ id: 'rfd_/weird id' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/refunds/rfd_%2Fweird%20id', {
      method: 'GET',
    });
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { getRefund } = await import('../../tools/v4/getRefund.js');

    await expect(getRefund({ id: 'rfd_missing' })).rejects.toThrow(
      'Flutterwave v4 get refund request failed: 404',
    );
  });

  it('returns isError from the registered handler when the call throws', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { handleGetRefund } = await import('../../tools/v4/register.js');

    const result = await handleGetRefund({ id: 'rfd_missing' });

    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
