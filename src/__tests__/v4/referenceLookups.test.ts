import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('reference lookups', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: [] }), {
        status: 200,
      }),
    );
  });

  it('lists payment methods with the default page size', async () => {
    const { listPaymentMethods } = await import(
      '../../tools/v4/listPaymentMethods.js'
    );
    await listPaymentMethods({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/payment-methods?page=1&size=10',
      { method: 'GET' },
    );
  });

  it('quotes fees with the required query fields', async () => {
    const { getFees } = await import('../../tools/v4/getFees.js');
    await getFees({ amount: 100, currency: 'NGN', payment_method: 'card' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/fees?amount=100&currency=NGN&payment_method=card',
    );
  });

  it('rejects a fee quote that omits currency', async () => {
    const { getFees } = await import('../../tools/v4/getFees.js');
    await expect(
      getFees({ amount: 100, payment_method: 'card' } as never),
    ).rejects.toThrow('generated schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('lists banks for a supported country', async () => {
    const { getBanks } = await import('../../tools/v4/getBanks.js');
    await getBanks({ country: 'NG' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/banks?country=NG', {
      method: 'GET',
    });
  });

  it('rejects a bank country outside the spec enum', async () => {
    const { getBanks } = await import('../../tools/v4/getBanks.js');
    await expect(getBanks({ country: 'GB' })).rejects.toThrow(
      'generated schema validation',
    );
  });

  it('lists mobile networks for a supported country', async () => {
    const { getMobileNetworks } = await import(
      '../../tools/v4/getMobileNetworks.js'
    );
    await getMobileNetworks({ country: 'GH' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/mobile-networks?country=GH',
      { method: 'GET' },
    );
  });

  it('returns isError when the fee call fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleGetFees } = await import('../../tools/v4/register.js');
    const result = await handleGetFees({
      amount: 100,
      currency: 'NGN',
      payment_method: 'card',
    });
    expect('isError' in result && result.isError).toBe(true);
  });
});
