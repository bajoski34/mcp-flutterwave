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
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
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
    expect(result.content[0]?.text).toContain('500');
  });

  it('throws when listing customers returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 500 }),
    );
    const { listCustomers } = await import('../../tools/v4/listCustomers.js');
    await expect(listCustomers({})).rejects.toThrow(
      'Flutterwave v4 list customers request failed: 500',
    );
  });

  it('throws when searching customers returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 400 }),
    );
    const { searchCustomers } = await import('../../tools/v4/searchCustomers.js');
    await expect(searchCustomers({ email: 'a@example.com' })).rejects.toThrow(
      'Flutterwave v4 search customers request failed: 400',
    );
  });

  it('returns isError when searching customers fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 400 }),
    );
    const { handleSearchCustomers } = await import('../../tools/v4/register.js');
    const result = await handleSearchCustomers({ email: 'a@example.com' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('rejects an empty customer id before calling the API', async () => {
    const { updateCustomer } = await import('../../tools/v4/updateCustomer.js');
    await expect(
      updateCustomer({ id: '', name: { first: 'Ada' } }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the customer id into the update path', async () => {
    const { updateCustomer } = await import('../../tools/v4/updateCustomer.js');
    await updateCustomer({ id: 'cus_/weird id', name: { first: 'Ada' } });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/customers/cus_%2Fweird%20id',
    );
  });

  it('throws when updating a customer returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 404 }),
    );
    const { updateCustomer } = await import('../../tools/v4/updateCustomer.js');
    await expect(
      updateCustomer({ id: 'cus_missing', name: { first: 'Ada' } }),
    ).rejects.toThrow('Flutterwave v4 update customer request failed: 404');
  });

  it('returns isError when updating a customer fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 404 }),
    );
    const { handleUpdateCustomer } = await import('../../tools/v4/register.js');
    const result = await handleUpdateCustomer({
      id: 'cus_missing',
      name: { first: 'Ada' },
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('rejects a charge list range that is not an offset datetime', async () => {
    const { listCharges } = await import('../../tools/v4/listCharges.js');
    await expect(listCharges({ from: 'yesterday' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when listing charges returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 500 }),
    );
    const { listCharges } = await import('../../tools/v4/listCharges.js');
    await expect(listCharges({})).rejects.toThrow(
      'Flutterwave v4 list charges request failed: 500',
    );
  });

  it('returns isError when listing charges fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 500 }),
    );
    const { handleListCharges } = await import('../../tools/v4/register.js');
    const result = await handleListCharges({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('500');
  });

  it('rejects a charge update with no fields', async () => {
    const { updateCharge } = await import('../../tools/v4/updateCharge.js');
    await expect(updateCharge({ id: 'chg_1' })).rejects.toThrow(
      'provide meta or authorization',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('rejects an empty charge id before calling the API', async () => {
    const { updateCharge } = await import('../../tools/v4/updateCharge.js');
    await expect(
      updateCharge({ id: '', meta: { note: 'ok' } }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the charge id into the update path', async () => {
    const { updateCharge } = await import('../../tools/v4/updateCharge.js');
    await updateCharge({ id: 'chg_/weird id', meta: { note: 'ok' } });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe('/charges/chg_%2Fweird%20id');
  });

  it('throws when updating a charge returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 404 }),
    );
    const { updateCharge } = await import('../../tools/v4/updateCharge.js');
    await expect(
      updateCharge({ id: 'chg_missing', meta: { note: 'ok' } }),
    ).rejects.toThrow('Flutterwave v4 update charge request failed: 404');
  });

  it('returns isError when updating a charge fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 404 }),
    );
    const { handleUpdateCharge } = await import('../../tools/v4/register.js');
    const result = await handleUpdateCharge({
      id: 'chg_missing',
      meta: { note: 'ok' },
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('rejects a refund list range that is not an offset datetime', async () => {
    const { listRefunds } = await import('../../tools/v4/listRefunds.js');
    await expect(listRefunds({ to: 'tomorrow' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when listing refunds returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 500 }),
    );
    const { listRefunds } = await import('../../tools/v4/listRefunds.js');
    await expect(listRefunds({})).rejects.toThrow(
      'Flutterwave v4 list refunds request failed: 500',
    );
  });

  it('returns isError when listing refunds fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response('nope', { status: 500 }),
    );
    const { handleListRefunds } = await import('../../tools/v4/register.js');
    const result = await handleListRefunds({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('500');
  });
});
