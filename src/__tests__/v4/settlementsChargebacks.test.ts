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
  });

  it('returns isError when listing settlements fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 500 }));
    const { handleListSettlements } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListSettlements({});
    expect('isError' in result && result.isError).toBe(true);
  });
});
