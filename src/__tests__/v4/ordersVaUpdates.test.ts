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

  it('rejects an order list range that is not an offset datetime', async () => {
    const { listOrders } = await import('../../tools/v4/listOrders.js');
    await expect(listOrders({ from: 'yesterday' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when listing orders returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { listOrders } = await import('../../tools/v4/listOrders.js');
    await expect(listOrders({})).rejects.toThrow(
      'Flutterwave v4 list orders request failed: 400',
    );
  });

  it('returns isError when listing orders fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListOrders } = await import('../../tools/v4/register.js');
    const result = await handleListOrders({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('voids an order', async () => {
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await updateOrder({ id: 'ord_1', action: 'void' });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/orders/ord_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ action: 'void' });
  });

  it('rejects an empty order id before calling the API', async () => {
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await expect(updateOrder({ id: '', action: 'void' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('rejects an order update with no fields', async () => {
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await expect(updateOrder({ id: 'ord_1' })).rejects.toThrow(
      'provide meta or action',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the order id into the request path', async () => {
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await updateOrder({ id: 'ord_/weird id', action: 'capture' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe('/orders/ord_%2Fweird%20id');
  });

  it('throws when updating an order returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { updateOrder } = await import('../../tools/v4/updateOrder.js');
    await expect(updateOrder({ id: 'ord_1', action: 'void' })).rejects.toThrow(
      'Flutterwave v4 update order request failed: 400',
    );
  });

  it('returns isError when updating an order fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleUpdateOrder } = await import('../../tools/v4/register.js');
    const result = await handleUpdateOrder({ id: 'ord_1', action: 'void' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
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

  it('rejects a virtual account list range that is not an offset datetime', async () => {
    const { listVirtualAccounts } = await import(
      '../../tools/v4/listVirtualAccounts.js'
    );
    await expect(listVirtualAccounts({ to: 'tomorrow' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when listing virtual accounts returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { listVirtualAccounts } = await import(
      '../../tools/v4/listVirtualAccounts.js'
    );
    await expect(listVirtualAccounts({})).rejects.toThrow(
      'Flutterwave v4 list virtual accounts request failed: 500',
    );
  });

  it('returns isError when listing virtual accounts fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { handleListVirtualAccounts } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListVirtualAccounts({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('500');
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

  it('rejects an empty virtual account id before calling the API', async () => {
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await expect(
      updateVirtualAccount({
        id: '',
        action_type: 'update_status',
        status: 'inactive',
      }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('requires a status when deactivating a virtual account', async () => {
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await expect(
      updateVirtualAccount({ id: 'van_1', action_type: 'update_status' }),
    ).rejects.toThrow('status is required');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('requires a bvn when updating one', async () => {
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await expect(
      updateVirtualAccount({ id: 'van_1', action_type: 'update_bvn' }),
    ).rejects.toThrow('bvn is required');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the virtual account id into the request path', async () => {
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await updateVirtualAccount({
      id: 'van_/weird id',
      action_type: 'update_status',
      status: 'inactive',
    });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/virtual-accounts/van_%2Fweird%20id',
    );
  });

  it('throws when updating a virtual account returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { updateVirtualAccount } = await import(
      '../../tools/v4/updateVirtualAccount.js'
    );
    await expect(
      updateVirtualAccount({
        id: 'van_1',
        action_type: 'update_status',
        status: 'inactive',
      }),
    ).rejects.toThrow(
      'Flutterwave v4 update virtual account request failed: 400',
    );
  });

  it('returns isError when updating a virtual account fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleUpdateVirtualAccount } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleUpdateVirtualAccount({
      id: 'van_1',
      action_type: 'update_status',
      status: 'inactive',
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });
});
