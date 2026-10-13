import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('createRefund', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({ status: 'success', data: { id: 'rfd_1' } }),
        { status: 201 },
      ),
    );
  });

  it('posts a refund body validated by the generated schema', async () => {
    const { createRefund } = await import('../../tools/v4/createRefund.js');

    const result = await createRefund({
      charge_id: 'chg_1',
      amount: 50,
      reason: 'requested_by_customer',
    });

    expect(mockFlwV4Fetch).toHaveBeenCalledTimes(1);
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/refunds');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      charge_id: 'chg_1',
      amount: 50,
      reason: 'requested_by_customer',
    });
    expect(result.content[0]?.text).toContain('rfd_1');
  });

  it('rejects an invalid reason before calling the API', async () => {
    const { createRefund } = await import('../../tools/v4/createRefund.js');

    await expect(
      createRefund({
        charge_id: 'chg_1',
        amount: 50,
        reason: 'not-a-reason' as 'duplicate',
      }),
    ).rejects.toThrow('generated schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('includes optional meta in the refund body when provided', async () => {
    const { createRefund } = await import('../../tools/v4/createRefund.js');

    await createRefund({
      charge_id: 'chg_1',
      amount: 50,
      reason: 'requested_by_customer',
      meta: { note: 'partial refund' },
    });

    expect(JSON.parse(String(mockFlwV4Fetch.mock.calls[0][1].body))).toMatchObject({
      charge_id: 'chg_1',
      amount: 50,
      reason: 'requested_by_customer',
      meta: { note: 'partial refund' },
    });
  });

  it('omits meta from the refund body when not provided', async () => {
    const { createRefund } = await import('../../tools/v4/createRefund.js');

    await createRefund({
      charge_id: 'chg_1',
      amount: 50,
      reason: 'requested_by_customer',
    });

    expect(
      JSON.parse(String(mockFlwV4Fetch.mock.calls[0][1].body)),
    ).not.toHaveProperty('meta');
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'already refunded' }), {
        status: 400,
      }),
    );

    const { createRefund } = await import('../../tools/v4/createRefund.js');

    await expect(
      createRefund({
        charge_id: 'chg_1',
        amount: 50,
        reason: 'duplicate',
      }),
    ).rejects.toThrow('Flutterwave v4 refund request failed: 400');
  });

  it('returns isError from the registered handler when the call throws', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'already refunded' }), {
        status: 400,
      }),
    );

    const { handleCreateRefund } = await import('../../tools/v4/register.js');

    const result = await handleCreateRefund({
      charge_id: 'chg_1',
      amount: 50,
      reason: 'duplicate',
    });

    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });
});
