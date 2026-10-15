import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('wallet tools', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: [] }), {
        status: 200,
      }),
    );
  });

  it('fetches one currency balance', async () => {
    const { getWalletBalance } = await import(
      '../../tools/v4/getWalletBalance.js'
    );
    await getWalletBalance({ currency: 'NGN' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/wallets/balances/NGN', {
      method: 'GET',
    });
  });

  it('rejects an empty currency before calling the API', async () => {
    const { getWalletBalance } = await import(
      '../../tools/v4/getWalletBalance.js'
    );
    await expect(getWalletBalance({ currency: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('lists every currency balance', async () => {
    const { listWalletBalances } = await import(
      '../../tools/v4/listWalletBalances.js'
    );
    await listWalletBalances({});
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/wallets/balances', {
      method: 'GET',
    });
  });

  it('loads a statement for a currency', async () => {
    const { getWalletStatement } = await import(
      '../../tools/v4/getWalletStatement.js'
    );
    await getWalletStatement({ currency: 'NGN' });
    expect(mockFlwV4Fetch.mock.calls[0]?.[0]).toBe(
      '/wallets/statement?size=10&currency=NGN',
    );
  });

  it('rejects a statement currency outside the spec enum', async () => {
    const { getWalletStatement } = await import(
      '../../tools/v4/getWalletStatement.js'
    );
    await expect(
      getWalletStatement({ currency: 'XXX' as 'NGN' }),
    ).rejects.toThrow('generated schema validation');
  });

  it('resolves a flutterwave wallet identifier', async () => {
    const { resolveWalletAccount } = await import(
      '../../tools/v4/resolveWalletAccount.js'
    );
    await resolveWalletAccount({
      provider: 'flutterwave',
      identifier: 'wallet-1',
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/wallets/account-resolve');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      provider: 'flutterwave',
      identifier: 'wallet-1',
    });
  });

  it('returns isError when the balance call fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetWalletBalance } = await import(
      '../../tools/v4/register.js'
    );
    const result = await handleGetWalletBalance({ currency: 'NGN' });
    expect('isError' in result && result.isError).toBe(true);
  });
});
