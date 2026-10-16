import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('transfer recipients', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: { id: 'rcp_1' } }), {
        status: 201,
      }),
    );
  });

  it('lists recipients with the default size', async () => {
    const { listTransferRecipients } = await import(
      '../../tools/v4/listTransferRecipients.js'
    );
    await listTransferRecipients({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/transfers/recipients?size=10',
      { method: 'GET' },
    );
  });

  it('creates an NGN bank recipient', async () => {
    const { createTransferRecipient } = await import(
      '../../tools/v4/createTransferRecipient.js'
    );
    await createTransferRecipient({
      type: 'bank_ngn',
      name: { first: 'Sandbox', last: 'Tester' },
      bank: { account_number: '0690000031', code: '044' },
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers/recipients');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      type: 'bank_ngn',
      bank: { account_number: '0690000031', code: '044' },
    });
  });

  it('rejects a recipient that is missing its bank', async () => {
    const { createTransferRecipient } = await import(
      '../../tools/v4/createTransferRecipient.js'
    );
    await expect(
      createTransferRecipient({ type: 'bank_ngn' }),
    ).rejects.toThrow('generated schema validation');
  });

  it('gets a recipient by id', async () => {
    const { getTransferRecipient } = await import(
      '../../tools/v4/getTransferRecipient.js'
    );
    await getTransferRecipient({ id: 'rcp_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/recipients/rcp_1', {
      method: 'GET',
    });
  });

  it('deletes a recipient by id', async () => {
    const { deleteTransferRecipient } = await import(
      '../../tools/v4/deleteTransferRecipient.js'
    );
    await deleteTransferRecipient({ id: 'rcp_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/recipients/rcp_1', {
      method: 'DELETE',
    });
  });

  it('returns isError when listing recipients fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListTransferRecipients } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListTransferRecipients({});
    expect('isError' in result && result.isError).toBe(true);
  });
});
