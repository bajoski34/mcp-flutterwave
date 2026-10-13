import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('getCustomer', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: { id: 'cus_1', email: 'a@example.com' },
        }),
        { status: 200 },
      ),
    );
  });

  it('GETs /customers/{id}', async () => {
    const { getCustomer } = await import('../../tools/v4/getCustomer.js');

    const result = await getCustomer({ id: 'cus_1' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/customers/cus_1', {
      method: 'GET',
    });
    expect(result.content[0]?.text).toContain('a@example.com');
  });

  it('rejects an empty id before calling the API', async () => {
    const { getCustomer } = await import('../../tools/v4/getCustomer.js');

    await expect(getCustomer({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the id into the request path', async () => {
    const { getCustomer } = await import('../../tools/v4/getCustomer.js');

    await getCustomer({ id: 'cus_/weird id' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/customers/cus_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { getCustomer } = await import('../../tools/v4/getCustomer.js');

    await expect(getCustomer({ id: 'cus_missing' })).rejects.toThrow(
      'Flutterwave v4 get customer request failed: 404',
    );
  });

  it('returns isError from the registered handler when the call throws', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { handleGetCustomer } = await import('../../tools/v4/register.js');

    const result = await handleGetCustomer({ id: 'cus_missing' });

    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
