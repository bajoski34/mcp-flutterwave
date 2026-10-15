import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

function ok(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

describe('customer, charge, and refund reads', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(ok({ status: 'success', data: [] }));
  });

  it('lists customers with the default page size', async () => {
    const { listCustomers } = await import('../../tools/v4/listCustomers.js');
    await listCustomers({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/customers?page=1&size=10', {
      method: 'GET',
    });
  });

  it('searches customers by email', async () => {
    const { searchCustomers } = await import('../../tools/v4/searchCustomers.js');
    await searchCustomers({ email: 'a@example.com' });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/customers/search?page=1&size=10');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ email: 'a@example.com' });
  });

  it('rejects a customer search without an email', async () => {
    const { searchCustomers } = await import('../../tools/v4/searchCustomers.js');
    await expect(searchCustomers({ email: 'not-an-email' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('updates a customer by id', async () => {
    const { updateCustomer } = await import('../../tools/v4/updateCustomer.js');
    await updateCustomer({ id: 'cus_1', name: { first: 'Ada' } });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/customers/cus_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ name: { first: 'Ada' } });
  });

  it('rejects a customer update with no fields', async () => {
    const { updateCustomer } = await import('../../tools/v4/updateCustomer.js');
    await expect(updateCustomer({ id: 'cus_1' })).rejects.toThrow(
      'provide name, phone, address, or meta',
    );
  });

  it('lists charges with filters', async () => {
    const { listCharges } = await import('../../tools/v4/listCharges.js');
    await listCharges({ status: 'succeeded', customer_id: 'cus_1' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toContain('/charges?');
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toContain('status=succeeded');
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toContain('customer_id=cus_1');
  });

  it('updates charge meta', async () => {
    const { updateCharge } = await import('../../tools/v4/updateCharge.js');
    await updateCharge({ id: 'chg_1', meta: { note: 'ok' } });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/charges/chg_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ meta: { note: 'ok' } });
  });

  it('lists refunds', async () => {
    const { listRefunds } = await import('../../tools/v4/listRefunds.js');
    await listRefunds({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/refunds?page=1&size=10', {
      method: 'GET',
    });
  });

  it('returns isError when listing customers fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 500 }),
    );
    const { handleListCustomers } = await import('../../tools/v4/register.js');
    const result = await handleListCustomers({});
    expect('isError' in result && result.isError).toBe(true);
  });
});
