import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('createCharge', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({ status: 'success', data: { id: 'chg_1' } }),
        { status: 201 },
      ),
    );
  });

  it('posts a charge body validated by the generated schema', async () => {
    const { createCharge } = await import('../../tools/v4/createCharge.js');

    const result = await createCharge({
      amount: 100,
      currency: 'NGN',
      reference: 'ref-charge-001',
      customer_id: 'cus_1',
      payment_method_id: 'pmd_1',
    });

    expect(mockFlwV4Fetch).toHaveBeenCalledTimes(1);
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/charges');
    expect(init.method).toBe('POST');
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      amount: 100,
      currency: 'NGN',
      reference: 'ref-charge-001',
      customer_id: 'cus_1',
      payment_method_id: 'pmd_1',
      recurring: false,
    });
    expect(result.content[0]?.text).toContain('chg_1');
  });

  it('rejects a short reference before calling the API', async () => {
    const { createCharge } = await import('../../tools/v4/createCharge.js');

    await expect(
      createCharge({
        amount: 100,
        currency: 'NGN',
        reference: 'abc',
        customer_id: 'cus_1',
        payment_method_id: 'pmd_1',
      }),
    ).rejects.toThrow('generated schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });
});
