import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('settlements and chargebacks', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: [] }), {
        status: 200,
      }),
    );
  });

  it('lists settlements with the default page size', async () => {
    const { listSettlements } = await import(
      '../../tools/v4/listSettlements.js'
    );
    await listSettlements({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/settlements?page=1&size=10',
      { method: 'GET' },
    );
  });

  it('gets a settlement by id', async () => {
    const { getSettlement } = await import('../../tools/v4/getSettlement.js');
    await getSettlement({ id: 'stl_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/settlements/stl_1?page=1&size=10',
      { method: 'GET' },
    );
  });

  it('rejects an empty settlement id', async () => {
    const { getSettlement } = await import('../../tools/v4/getSettlement.js');
    await expect(getSettlement({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('lists chargebacks', async () => {
    const { listChargebacks } = await import(
      '../../tools/v4/listChargebacks.js'
    );
    await listChargebacks({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/chargebacks?page=1&size=10',
      { method: 'GET' },
    );
  });

  it('gets a chargeback by id', async () => {
    const { getChargeback } = await import('../../tools/v4/getChargeback.js');
    await getChargeback({ id: 'chb_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/chargebacks/chb_1', {
      method: 'GET',
    });
  });

  it('creates a chargeback', async () => {
    const { createChargeback } = await import(
      '../../tools/v4/createChargeback.js'
    );
    await createChargeback({
      charge_id: 'chg_1',
      amount: 50,
      type: 'local',
      expiry: 24,
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/chargebacks');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      charge_id: 'chg_1',
      amount: 50,
      type: 'local',
      expiry: 24,
    });
  });

  it('rejects a chargeback without a type', async () => {
    const { createChargeback } = await import(
      '../../tools/v4/createChargeback.js'
    );
    await expect(
      createChargeback({
        charge_id: 'chg_1',
        amount: 50,
        expiry: 24,
      } as never),
    ).rejects.toThrow('generated schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('updates a chargeback status', async () => {
    const { updateChargeback } = await import(
      '../../tools/v4/updateChargeback.js'
    );
    await updateChargeback({ id: 'chb_1', status: 'accepted' });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/chargebacks/chb_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ status: 'accepted' });
  });

  it('rejects a chargeback update with no fields', async () => {
    const { updateChargeback } = await import(
      '../../tools/v4/updateChargeback.js'
    );
    await expect(updateChargeback({ id: 'chb_1' })).rejects.toThrow(
      'at least one field',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('returns isError when listing settlements fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { handleListSettlements } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListSettlements({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('500');
  });

  it('throws when listing settlements returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { listSettlements } = await import(
      '../../tools/v4/listSettlements.js'
    );
    await expect(listSettlements({})).rejects.toThrow(
      'Flutterwave v4 list settlements request failed: 500',
    );
  });

  it('rejects a settlement list range that is not an offset datetime', async () => {
    const { listSettlements } = await import(
      '../../tools/v4/listSettlements.js'
    );
    await expect(listSettlements({ from: 'yesterday' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the settlement id into the request path', async () => {
    const { getSettlement } = await import('../../tools/v4/getSettlement.js');
    await getSettlement({ id: 'stl_/weird id' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/settlements/stl_%2Fweird%20id?page=1&size=10',
    );
  });

  it('throws when getting a settlement returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getSettlement } = await import('../../tools/v4/getSettlement.js');
    await expect(getSettlement({ id: 'stl_missing' })).rejects.toThrow(
      'Flutterwave v4 get settlement request failed: 404',
    );
  });

  it('returns isError when getting a settlement fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetSettlement } = await import('../../tools/v4/register.js');
    const result = await handleGetSettlement({ id: 'stl_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('rejects a chargeback list range that is not an offset datetime', async () => {
    const { listChargebacks } = await import(
      '../../tools/v4/listChargebacks.js'
    );
    await expect(listChargebacks({ to: 'tomorrow' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when listing chargebacks returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { listChargebacks } = await import(
      '../../tools/v4/listChargebacks.js'
    );
    await expect(listChargebacks({})).rejects.toThrow(
      'Flutterwave v4 list chargebacks request failed: 500',
    );
  });

  it('returns isError when listing chargebacks fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { handleListChargebacks } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListChargebacks({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('500');
  });

  it('rejects an empty chargeback id before calling the API', async () => {
    const { getChargeback } = await import('../../tools/v4/getChargeback.js');
    await expect(getChargeback({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the chargeback id into the request path', async () => {
    const { getChargeback } = await import('../../tools/v4/getChargeback.js');
    await getChargeback({ id: 'chb_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/chargebacks/chb_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when getting a chargeback returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getChargeback } = await import('../../tools/v4/getChargeback.js');
    await expect(getChargeback({ id: 'chb_missing' })).rejects.toThrow(
      'Flutterwave v4 get chargeback request failed: 404',
    );
  });

  it('returns isError when getting a chargeback fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetChargeback } = await import('../../tools/v4/register.js');
    const result = await handleGetChargeback({ id: 'chb_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('throws when creating a chargeback returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { createChargeback } = await import(
      '../../tools/v4/createChargeback.js'
    );
    await expect(
      createChargeback({
        charge_id: 'chg_1',
        amount: 50,
        type: 'local',
        expiry: 24,
      }),
    ).rejects.toThrow('Flutterwave v4 create chargeback request failed: 400');
  });

  it('returns isError when creating a chargeback fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleCreateChargeback } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleCreateChargeback({
      charge_id: 'chg_1',
      amount: 50,
      type: 'local',
      expiry: 24,
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('rejects an empty chargeback id on update before calling the API', async () => {
    const { updateChargeback } = await import(
      '../../tools/v4/updateChargeback.js'
    );
    await expect(
      updateChargeback({ id: '', status: 'accepted' }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the chargeback id into the update path', async () => {
    const { updateChargeback } = await import(
      '../../tools/v4/updateChargeback.js'
    );
    await updateChargeback({ id: 'chb_/weird id', status: 'declined' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/chargebacks/chb_%2Fweird%20id',
    );
  });

  it('throws when updating a chargeback returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { updateChargeback } = await import(
      '../../tools/v4/updateChargeback.js'
    );
    await expect(
      updateChargeback({ id: 'chb_missing', status: 'accepted' }),
    ).rejects.toThrow('Flutterwave v4 update chargeback request failed: 404');
  });

  it('returns isError when updating a chargeback fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleUpdateChargeback } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleUpdateChargeback({
      id: 'chb_missing',
      status: 'accepted',
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
