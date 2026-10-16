import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('order and virtual account updates', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: [] }), { status: 200 }),
    );
  });

  it('lists orders with the default page', async () => {
    const { listOrders } = await import('../../tools/v4/listOrders.js');
    await listOrders({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/orders?page=1&size=10', {
      method: 'GET',
    });
  });

  it('voids an order', async () => {
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await updateOrder({ id: 'ord_1', action: 'void' });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/orders/ord_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ action: 'void' });
  });

  it('rejects an order update with no fields', async () => {
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await expect(updateOrder({ id: 'ord_1' })).rejects.toThrow(
      'provide meta or action',
    );
  });

  it('lists virtual accounts with the default page', async () => {
    const { listVirtualAccounts } = await import(
      '../../tools/v4/listVirtualAccounts.js'
    );
    await listVirtualAccounts({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/virtual-accounts?page=1&size=10',
      { method: 'GET' },
    );
  });

  it('deactivates a virtual account', async () => {
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await updateVirtualAccount({
      id: 'van_1',
      action_type: 'update_status',
      status: 'inactive',
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/virtual-accounts/van_1');
    expect(JSON.parse(String(init.body))).toMatchObject({
      action_type: 'update_status',
      status: 'inactive',
    });
  });

  it('requires a bvn when updating one', async () => {
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await expect(
      updateVirtualAccount({ id: 'van_1', action_type: 'update_bvn' }),
    ).rejects.toThrow('bvn is required');
  });

  it('returns isError when listing orders fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListOrders } = await import('../../tools/v4/register.js');
    const result = await handleListOrders({});
    expect('isError' in result && result.isError).toBe(true);
  });
});
