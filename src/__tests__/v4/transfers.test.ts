import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

const INSTRUCTION = {
  recipient_id: 'rcb_1',
  sender_id: 'sdr_1',
  source_currency: 'NGN' as const,
  amount: { value: 100, applies_to: 'destination_currency' as const },
};

describe('transfers', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: { id: 'trf_1' } }), {
        status: 201,
      }),
    );
  });

  it('creates an instant transfer', async () => {
    const { createTransfer } = await import('../../tools/v4/createTransfer.js');
    await createTransfer({
      action: 'instant',
      reference: 'trf-ref-1',
      payment_instruction: INSTRUCTION,
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      action: 'instant',
      payment_instruction: INSTRUCTION,
    });
  });

  it('requires a disburse option for a scheduled transfer', async () => {
    const { createTransfer } = await import('../../tools/v4/createTransfer.js');
    await expect(
      createTransfer({ action: 'scheduled', payment_instruction: INSTRUCTION }),
    ).rejects.toThrow('disburse_option is required');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('gets a transfer by id', async () => {
    const { getTransfer } = await import('../../tools/v4/getTransfer.js');
    await getTransfer({ id: 'trf_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/trf_1', {
      method: 'GET',
    });
  });

  it('lists transfers with the default size', async () => {
    const { listTransfers } = await import('../../tools/v4/listTransfers.js');
    await listTransfers({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers?size=10', {
      method: 'GET',
    });
  });

  it('initiates a deferred transfer', async () => {
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await updateTransfer({ id: 'trf_1', initiate: true });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers/trf_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ initiate: true });
  });

  it('rejects an empty transfer update', async () => {
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await expect(updateTransfer({ id: 'trf_1' })).rejects.toThrow(
      'provide initiate, close, or disburse_option',
    );
  });

  it('retries a transfer', async () => {
    const { retryTransfer } = await import('../../tools/v4/retryTransfer.js');
    await retryTransfer({ id: 'trf_1', action: 'retry' });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers/trf_1/retries');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ action: 'retry' });
  });

  it('returns isError when listing transfers fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListTransfers } = await import('../../tools/v4/register.js');
    const result = await handleListTransfers({});
    expect('isError' in result && result.isError).toBe(true);
  });
});
