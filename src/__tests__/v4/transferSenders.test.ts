import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

const GENERIC_SENDER = {
  type: 'generic_sender' as const,
  name: { first: 'Sandbox', last: 'Tester' },
};

describe('transfer senders', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: { id: 'snd_1' } }), {
        status: 201,
      }),
    );
  });

  it('lists senders with the default size', async () => {
    const { listTransferSenders } = await import(
      '../../tools/v4/listTransferSenders.js'
    );
    await listTransferSenders({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/senders?size=10', {
      method: 'GET',
    });
  });

  it('throws when listing senders returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { listTransferSenders } = await import(
      '../../tools/v4/listTransferSenders.js'
    );
    await expect(listTransferSenders({})).rejects.toThrow(
      'Flutterwave v4 list transfer senders request failed: 400',
    );
  });

  it('returns isError when listing senders fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListTransferSenders } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListTransferSenders({});
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('creates a generic sender', async () => {
    const { createTransferSender } = await import(
      '../../tools/v4/createTransferSender.js'
    );
    await createTransferSender(GENERIC_SENDER);
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/transfers/senders');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      type: 'generic_sender',
      name: { first: 'Sandbox', last: 'Tester' },
    });
  });

  it('rejects a sender without a name', async () => {
    const { createTransferSender } = await import(
      '../../tools/v4/createTransferSender.js'
    );
    await expect(
      createTransferSender({
        type: 'generic_sender',
        name: undefined as unknown as { first: string; last: string },
      }),
    ).rejects.toThrow('tool schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when creating a sender returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { createTransferSender } = await import(
      '../../tools/v4/createTransferSender.js'
    );
    await expect(createTransferSender(GENERIC_SENDER)).rejects.toThrow(
      'Flutterwave v4 create transfer sender request failed: 400',
    );
  });

  it('returns isError when creating a sender fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleCreateTransferSender } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleCreateTransferSender(GENERIC_SENDER);
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });

  it('gets a sender by id', async () => {
    const { getTransferSender } = await import(
      '../../tools/v4/getTransferSender.js'
    );
    await getTransferSender({ id: 'snd_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/senders/snd_1', {
      method: 'GET',
    });
  });

  it('rejects an empty sender id before fetching', async () => {
    const { getTransferSender } = await import(
      '../../tools/v4/getTransferSender.js'
    );
    await expect(getTransferSender({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the sender id into the request path', async () => {
    const { getTransferSender } = await import(
      '../../tools/v4/getTransferSender.js'
    );
    await getTransferSender({ id: 'snd_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/transfers/senders/snd_%2Fweird%20id',
      { method: 'GET' },
    );
  });

  it('throws when getting a sender returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { getTransferSender } = await import(
      '../../tools/v4/getTransferSender.js'
    );
    await expect(getTransferSender({ id: 'snd_missing' })).rejects.toThrow(
      'Flutterwave v4 get transfer sender request failed: 404',
    );
  });

  it('returns isError when getting a sender fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetTransferSender } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleGetTransferSender({ id: 'snd_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });

  it('deletes a sender by id', async () => {
    const { deleteTransferSender } = await import(
      '../../tools/v4/deleteTransferSender.js'
    );
    await deleteTransferSender({ id: 'snd_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/senders/snd_1', {
      method: 'DELETE',
    });
  });

  it('rejects an empty sender id before deleting', async () => {
    const { deleteTransferSender } = await import(
      '../../tools/v4/deleteTransferSender.js'
    );
    await expect(deleteTransferSender({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('encodes the sender id into the delete path', async () => {
    const { deleteTransferSender } = await import(
      '../../tools/v4/deleteTransferSender.js'
    );
    await deleteTransferSender({ id: 'snd_/weird id' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith(
      '/transfers/senders/snd_%2Fweird%20id',
      { method: 'DELETE' },
    );
  });

  it('throws when deleting a sender returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { deleteTransferSender } = await import(
      '../../tools/v4/deleteTransferSender.js'
    );
    await expect(deleteTransferSender({ id: 'snd_missing' })).rejects.toThrow(
      'Flutterwave v4 delete transfer sender request failed: 404',
    );
  });

  it('returns isError when deleting a sender fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleDeleteTransferSender } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleDeleteTransferSender({ id: 'snd_missing' });
    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('404');
  });
});
