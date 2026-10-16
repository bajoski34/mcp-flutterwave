import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

const NGN_RECIPIENT = {
  type: 'bank_ngn' as const,
  name: { first: 'Sandbox', last: 'Tester' },
  bank: { account_number: '0690000031', code: '044' },
};

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

  it('throws when listing recipients returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { listTransferRecipients } = await import(
      '../../tools/v4/listTransferRecipients.js'
    );
    await expect(listTransferRecipients({})).rejects.toThrow(
      'Flutterwave v4 list transfer recipients request failed: 400',
    );
  });

  it('returns isError when listing recipients fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListTransferRecipients } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListTransferRecipients({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('creates an NGN bank recipient', async () => {
    const { createTransferRecipient } = await import(
      '../../tools/v4/createTransferRecipient.js'
    );
    await createTransferRecipient(NGN_RECIPIENT);
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
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when creating a recipient returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { createTransferRecipient } = await import(
      '../../tools/v4/createTransferRecipient.js'
    );
    await expect(createTransferRecipient(NGN_RECIPIENT)).rejects.toThrow(
      'Flutterwave v4 create transfer recipient request failed: 400',
    );
  });

  it('returns isError when creating a recipient fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleCreateTransferRecipient } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleCreateTransferRecipient(NGN_RECIPIENT);
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
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

  it('rejects an empty recipient id before fetching', async () => {
    const { getTransferRecipient } = await import(
      '../../tools/v4/getTransferRecipient.js'
    );
    await expect(getTransferRecipient({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the recipient id into the request path', async () => {
    const { getTransferRecipient } = await import(
      '../../tools/v4/getTransferRecipient.js'
    );
    await getTransferRecipient({ id: 'rcp_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/transfers/recipients/rcp_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when getting a recipient returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getTransferRecipient } = await import(
      '../../tools/v4/getTransferRecipient.js'
    );
    await expect(getTransferRecipient({ id: 'rcp_missing' })).rejects.toThrow(
      'Flutterwave v4 get transfer recipient request failed: 404',
    );
  });

  it('returns isError when getting a recipient fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetTransferRecipient } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleGetTransferRecipient({ id: 'rcp_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
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

  it('rejects an empty recipient id before deleting', async () => {
    const { deleteTransferRecipient } = await import(
      '../../tools/v4/deleteTransferRecipient.js'
    );
    await expect(deleteTransferRecipient({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the recipient id into the delete path', async () => {
    const { deleteTransferRecipient } = await import(
      '../../tools/v4/deleteTransferRecipient.js'
    );
    await deleteTransferRecipient({ id: 'rcp_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/transfers/recipients/rcp_%2Fweird%20id',
      { method: 'DELETE' },
    );
  });

  it('throws when deleting a recipient returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { deleteTransferRecipient } = await import(
      '../../tools/v4/deleteTransferRecipient.js'
    );
    await expect(deleteTransferRecipient({ id: 'rcp_missing' })).rejects.toThrow(
      'Flutterwave v4 delete transfer recipient request failed: 404',
    );
  });

  it('returns isError when deleting a recipient fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleDeleteTransferRecipient } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleDeleteTransferRecipient({ id: 'rcp_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
