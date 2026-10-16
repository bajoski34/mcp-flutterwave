import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

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

  it('creates a generic sender', async () => {
    const { createTransferSender } = await import(
      '../../tools/v4/createTransferSender.js'
    );
    await createTransferSender({
      type: 'generic_sender',
      name: { first: 'Sandbox', last: 'Tester' },
    });
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

  it('deletes a sender by id', async () => {
    const { deleteTransferSender } = await import(
      '../../tools/v4/deleteTransferSender.js'
    );
    await deleteTransferSender({ id: 'snd_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/transfers/senders/snd_1', {
      method: 'DELETE',
    });
  });

  it('returns isError when listing senders fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 400 }));
    const { handleListTransferSenders } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleListTransferSenders({});
    expect('isError' in result && result.isError).toBe(true);
  });
});
