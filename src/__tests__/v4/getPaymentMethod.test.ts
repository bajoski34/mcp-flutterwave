import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('getPaymentMethod', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: { id: 'pmd_1', type: 'card' },
        }),
        { status: 200 },
      ),
    );
  });

  it('GETs /payment-methods/{id}', async () => {
    const { getPaymentMethod } = await import(
      '../../tools/v4/getPaymentMethod.js'
    );

    const result = await getPaymentMethod({ id: 'pmd_1' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/payment-methods/pmd_1', {
      method: 'GET',
    });
    expect(result.content[0]?.text).toContain('card');
  });

  it('rejects an empty id before calling the API', async () => {
    const { getPaymentMethod } = await import(
      '../../tools/v4/getPaymentMethod.js'
    );

    await expect(getPaymentMethod({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the id into the request path', async () => {
    const { getPaymentMethod } = await import(
      '../../tools/v4/getPaymentMethod.js'
    );

    await getPaymentMethod({ id: 'pmd_/weird id' });

    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/payment-methods/pmd_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { getPaymentMethod } = await import(
      '../../tools/v4/getPaymentMethod.js'
    );

    await expect(getPaymentMethod({ id: 'pmd_missing' })).rejects.toThrow(
      'Flutterwave v4 get payment method request failed: 404',
    );
  });

  it('returns isError from the registered handler when the call throws', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'not found' }), { status: 404 }),
    );

    const { handleGetPaymentMethod } = await import(
      '../../tools/v4/register.js'
    );

    const result = await handleGetPaymentMethod({ id: 'pmd_missing' });

    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
