import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('orders and virtual accounts', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: { id: 'ord_1' } }), {
        status: 201,
      }),
    );
  });

  it('creates an order', async () => {
    const { createOrder } = await import('../../tools/v4/createOrder.js');
    await createOrder({
      amount: 100,
      currency: 'NGN',
      reference: 'order-ref-1',
      customer_id: 'cus_1',
      payment_method_id: 'pmd_1',
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/orders');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      amount: 100,
      currency: 'NGN',
      reference: 'order-ref-1',
      customer_id: 'cus_1',
      payment_method_id: 'pmd_1',
    });
  });

  it('rejects an order reference that is too short', async () => {
    const { createOrder } = await import('../../tools/v4/createOrder.js');
    await expect(
      createOrder({
        amount: 100,
        currency: 'NGN',
        reference: 'abc',
        customer_id: 'cus_1',
        payment_method_id: 'pmd_1',
      }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('gets an order by id', async () => {
    const { getOrder } = await import('../../tools/v4/getOrder.js');
    await getOrder({ id: 'ord_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/orders/ord_1', {
      method: 'GET',
    });
  });

  it('creates a static virtual account', async () => {
    const { createVirtualAccount } = await import(
      '../../tools/v4/createVirtualAccount.js'
    );
    await createVirtualAccount({
      customer_id: 'cus_1',
      reference: 'va-ref-1',
      currency: 'NGN',
      account_type: 'static',
      amount: 0,
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/virtual-accounts');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      customer_id: 'cus_1',
      account_type: 'static',
      currency: 'NGN',
    });
  });

  it('rejects a virtual account currency outside the spec', async () => {
    const { createVirtualAccount } = await import(
      '../../tools/v4/createVirtualAccount.js'
    );
    await expect(
      createVirtualAccount({
        customer_id: 'cus_1',
        reference: 'va-ref-1',
        currency: 'USD' as 'NGN',
        account_type: 'static',
      }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('gets a virtual account by id', async () => {
    const { getVirtualAccount } = await import(
      '../../tools/v4/getVirtualAccount.js'
    );
    await getVirtualAccount({ id: 'va_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/virtual-accounts/va_1', {
      method: 'GET',
    });
  });

  it('returns isError when creating an order fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleCreateOrder } = await import('../../tools/v4/register.js');
    const result = await handleCreateOrder({
      amount: 100,
      currency: 'NGN',
      reference: 'order-ref-1',
      customer_id: 'cus_1',
      payment_method_id: 'pmd_1',
    });
    expect('isError' in result && result.isError).toBe(true);
  });
});
