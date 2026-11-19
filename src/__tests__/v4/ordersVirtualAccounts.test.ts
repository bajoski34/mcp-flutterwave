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
    expect(result.content[0]?.text).toContain('400');
  });

  it('throws when creating an order returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { createOrder } = await import('../../tools/v4/createOrder.js');
    await expect(
      createOrder({
        amount: 100,
        currency: 'NGN',
        reference: 'order-ref-1',
        customer_id: 'cus_1',
        payment_method_id: 'pmd_1',
      }),
    ).rejects.toThrow('Flutterwave v4 create order request failed: 400');
  });

  it('rejects an empty order id before calling the API', async () => {
    const { getOrder } = await import('../../tools/v4/getOrder.js');
    await expect(getOrder({ id: '' })).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the order id into the request path', async () => {
    const { getOrder } = await import('../../tools/v4/getOrder.js');
    await getOrder({ id: 'ord_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/orders/ord_%2Fweird%20id', {
      method: 'GET',
    });
  });

  it('throws when getting an order returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getOrder } = await import('../../tools/v4/getOrder.js');
    await expect(getOrder({ id: 'ord_missing' })).rejects.toThrow(
      'Flutterwave v4 get order request failed: 404',
    );
  });

  it('returns isError when getting an order fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetOrder } = await import('../../tools/v4/register.js');
    const result = await handleGetOrder({ id: 'ord_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('throws when creating a virtual account returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { createVirtualAccount } = await import(
      '../../tools/v4/createVirtualAccount.js'
    );
    await expect(
      createVirtualAccount({
        customer_id: 'cus_1',
        reference: 'va-ref-1',
        currency: 'NGN',
        account_type: 'static',
      }),
    ).rejects.toThrow(
      'Flutterwave v4 create virtual account request failed: 400',
    );
  });

  it('returns isError when creating a virtual account fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleCreateVirtualAccount } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleCreateVirtualAccount({
      customer_id: 'cus_1',
      reference: 'va-ref-1',
      currency: 'NGN',
      account_type: 'static',
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('rejects an empty virtual account id before calling the API', async () => {
    const { getVirtualAccount } = await import(
      '../../tools/v4/getVirtualAccount.js'
    );
    await expect(getVirtualAccount({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the virtual account id into the request path', async () => {
    const { getVirtualAccount } = await import(
      '../../tools/v4/getVirtualAccount.js'
    );
    await getVirtualAccount({ id: 'van_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/virtual-accounts/van_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when getting a virtual account returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getVirtualAccount } = await import(
      '../../tools/v4/getVirtualAccount.js'
    );
    await expect(getVirtualAccount({ id: 'van_missing' })).rejects.toThrow(
      'Flutterwave v4 get virtual account request failed: 404',
    );
  });

  it('returns isError when getting a virtual account fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetVirtualAccount } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleGetVirtualAccount({ id: 'van_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
