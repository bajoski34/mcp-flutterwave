import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

describe('bank lookups', () => {
  beforeEach(() => {
    mockFlwV4Fetch.mockReset();
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: [] }), { status: 200 }),
    );
  });

  it('lists branches for a bank', async () => {
    const { getBankBranches } = await import('../../tools/v4/getBankBranches.js');
    await getBankBranches({ id: 'bnk_1' });
    expect(mockFlwV4Fetch).toHaveBeenCalledWith('/banks/bnk_1/branches', {
      method: 'GET',
    });
  });

  it('rejects an empty bank id', async () => {
    const { getBankBranches } = await import('../../tools/v4/getBankBranches.js');
    await expect(getBankBranches({ id: '' })).rejects.toThrow(
      'tool schema validation',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('resolves an NGN account', async () => {
    const { resolveBankAccount } = await import(
      '../../tools/v4/resolveBankAccount.js'
    );
    await resolveBankAccount({
      currency: 'NGN',
      account: { code: '044', number: '0690000040' },
    });
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/banks/account-resolve');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({
      currency: 'NGN',
      account: { code: '044', number: '0690000040' },
    });
  });

  it('rejects an NGN account number of the wrong length', async () => {
    const { resolveBankAccount } = await import(
      '../../tools/v4/resolveBankAccount.js'
    );
    await expect(
      resolveBankAccount({
        currency: 'NGN',
        account: { code: '044', number: '123' },
      }),
    ).rejects.toThrow('generated schema validation');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('returns isError when branch lookup fails', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    const { handleGetBankBranches } = await import('../../tools/v4/register.js');
    const result = await handleGetBankBranches({ id: 'bnk_1' });
    expect('isError' in result && result.isError).toBe(true);
  });
});
