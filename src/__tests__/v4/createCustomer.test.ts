import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('createCustomer', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(
        JSON.stringify({ status: 'success', data: { id: 'cus_1' } }),
        { status: 201 },
      ),
    );
  });

  it('posts a customer body validated by the generated schema', async () => {
    const { createCustomer } = await import('../../tools/v4/createCustomer.js');

    const result = await createCustomer({
      email: 'ada@example.com',
      name: { first: 'Ada', last: 'Lovelace' },
    });

    expect(mockFlwV4Fetch).toHaveBeenCalledTimes(1);
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/customers');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      email: 'ada@example.com',
      name: { first: 'Ada', last: 'Lovelace' },
    });
    expect(result.content[0]?.text).toContain('cus_1');
  });

  it('rejects an invalid email before calling the API', async () => {
    const { createCustomer } = await import('../../tools/v4/createCustomer.js');

    await expect(createCustomer({ email: 'not-an-email' })).rejects.toThrow(
      'generated schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('omits the optional name when only an email is provided', async () => {
    const { createCustomer } = await import('../../tools/v4/createCustomer.js');

    await createCustomer({ email: 'solo@example.com' });

    expect(JSON.parse(String(mockFlwV4Fetch.mock.calls[0][1].body))).toEqual({
      email: 'solo@example.com',
    });
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'email taken' }), { status: 400 }),
    );

    const { createCustomer } = await import('../../tools/v4/createCustomer.js');

    await expect(
      createCustomer({ email: 'ada@example.com' }),
    ).rejects.toThrow('Flutterwave v4 customer request failed: 400');
  });

  it('returns isError from the registered handler when the call throws', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'email taken' }), { status: 400 }),
    );

    const { handleCreateCustomer } = await import('../../tools/v4/register.js');

    const result = await handleCreateCustomer({ email: 'ada@example.com' });

    expect('isError' in result && result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('400');
  });
});
