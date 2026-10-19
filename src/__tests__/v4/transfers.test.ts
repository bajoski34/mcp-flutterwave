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

const INSTANT = {
  action: 'instant' as const,
  reference: 'trf-ref-1',
  payment_instruction: INSTRUCTION,
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
    await createTransfer(INSTANT);
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

  it('throws when creating a transfer returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { createTransfer } = await import('../../tools/v4/createTransfer.js');
    await expect(createTransfer(INSTANT)).rejects.toThrow(
      'Flutterwave v4 create transfer request failed: 400',
    );
  });

  it('returns isError when creating a transfer fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleCreateTransfer } = await import('../../tools/v4/register.js');
    const result = await handleCreateTransfer(INSTANT);
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('gets a transfer by id', async () => {
    const { getTransfer } = await import('../../tools/v4/getTransfer.js');
    await getTransfer({ id: 'trf_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/trf_1', {
      method: 'GET',
    });
  });

  it('rejects an empty transfer id before fetching', async () => {
    const { getTransfer } = await import('../../tools/v4/getTransfer.js');
    await expect(getTransfer({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the transfer id into the request path', async () => {
    const { getTransfer } = await import('../../tools/v4/getTransfer.js');
    await getTransfer({ id: 'trf_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/transfers/trf_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when getting a transfer returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getTransfer } = await import('../../tools/v4/getTransfer.js');
    await expect(getTransfer({ id: 'trf_missing' })).rejects.toThrow(
      'Flutterwave v4 get transfer request failed: 404',
    );
  });

  it('returns isError when getting a transfer fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetTransfer } = await import('../../tools/v4/register.js');
    const result = await handleGetTransfer({ id: 'trf_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('lists transfers with the default size', async () => {
    const { listTransfers } = await import('../../tools/v4/listTransfers.js');
    await listTransfers({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers?size=10', {
      method: 'GET',
    });
  });

  it('throws when listing transfers returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { listTransfers } = await import('../../tools/v4/listTransfers.js');
    await expect(listTransfers({})).rejects.toThrow(
      'Flutterwave v4 list transfers request failed: 400',
    );
  });

  it('returns isError when listing transfers fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListTransfers } = await import('../../tools/v4/register.js');
    const result = await handleListTransfers({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('initiates a deferred transfer', async () => {
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await updateTransfer({ id: 'trf_1', initiate: true });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers/trf_1');
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual({ initiate: true });
  });

  it('rejects an empty transfer id before updating', async () => {
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await expect(updateTransfer({ id: '', initiate: true })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('rejects an empty transfer update', async () => {
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await expect(updateTransfer({ id: 'trf_1' })).rejects.toThrow(
      'provide initiate, close, or disburse_option',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the transfer id into the update path', async () => {
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await updateTransfer({ id: 'trf_/weird id', initiate: true });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/transfers/trf_%2Fweird%20id',
    );
  });

  it('throws when updating a transfer returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { updateTransfer } = await import('../../tools/v4/updateTransfer.js');
    await expect(
      updateTransfer({ id: 'trf_1', initiate: true }),
    ).rejects.toThrow('Flutterwave v4 update transfer request failed: 400');
  });

  it('returns isError when updating a transfer fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleUpdateTransfer } = await import('../../tools/v4/register.js');
    const result = await handleUpdateTransfer({ id: 'trf_1', initiate: true });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('retries a transfer', async () => {
    const { retryTransfer } = await import('../../tools/v4/retryTransfer.js');
    await retryTransfer({ id: 'trf_1', action: 'retry' });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers/trf_1/retries');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ action: 'retry' });
  });

  it('rejects an empty transfer id before retrying', async () => {
    const { retryTransfer } = await import('../../tools/v4/retryTransfer.js');
    await expect(retryTransfer({ id: '', action: 'retry' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the transfer id into the retry path', async () => {
    const { retryTransfer } = await import('../../tools/v4/retryTransfer.js');
    await retryTransfer({ id: 'trf_/weird id', action: 'retry' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/transfers/trf_%2Fweird%20id/retries',
    );
  });

  it('throws when retrying a transfer returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { retryTransfer } = await import('../../tools/v4/retryTransfer.js');
    await expect(
      retryTransfer({ id: 'trf_missing', action: 'retry' }),
    ).rejects.toThrow('Flutterwave v4 retry transfer request failed: 404');
  });

  it('returns isError when retrying a transfer fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleRetryTransfer } = await import('../../tools/v4/register.js');
    const result = await handleRetryTransfer({
      id: 'trf_missing',
      action: 'retry',
    });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
