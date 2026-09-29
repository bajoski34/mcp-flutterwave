import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockFlwV4Fetch = vi.fn();

vi.mock('../../client/v4/http.js', () => ({
  flwV4Fetch: mockFlwV4Fetch,
}));

const ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
const ENV_KEYS = [
  'FLW_API_VERSION',
  'FLW_CLIENT_ID',
  'FLW_CLIENT_SECRET',
  'FLW_ENCRYPTION_KEY_V4',
  'FLW_SECRET_KEY',
] as const;

const CARD = {
  card_number: '5531886652142950',
  cvv: '564',
  expiry_month: '09',
  expiry_year: '32',
};

describe('createCardPaymentMethod', () => {
  const savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> =
    {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      savedEnv[key] = process.env[key];
    }
    vi.resetModules();
    mockFlwV4Fetch.mockReset();
    process.env.FLW_API_VERSION = 'v4';
    process.env.FLW_CLIENT_ID = 'test-client-id';
    process.env.FLW_CLIENT_SECRET = 'test-client-secret';
    process.env.FLW_ENCRYPTION_KEY_V4 = ENCRYPTION_KEY;
    mockFlwV4Fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'success', data: { id: 'pmd_1' } }), {
        status: 201,
      }),
    );
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = savedEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('accepts the 2-digit expiry year used against the sandbox and rejects a 4-digit year', async () => {
    const { CreateCardPaymentMethodSchema } = await import(
      '../../tools/v4/createCardPaymentMethod.js'
    );

    expect(CreateCardPaymentMethodSchema.expiry_year.safeParse('32').success).toBe(
      true,
    );
    expect(CreateCardPaymentMethodSchema.expiry_year.safeParse('2028').success).toBe(
      false,
    );
  });

  it('encrypts card fields and posts them to /payment-methods', async () => {
    const { createCardPaymentMethod } = await import(
      '../../tools/v4/createCardPaymentMethod.js'
    );

    const result = await createCardPaymentMethod({
      ...CARD,
      card_holder_name: 'Alex James',
    });

    expect(mockFlwV4Fetch).toHaveBeenCalledTimes(1);
    const [path, init] = mockFlwV4Fetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('/payment-methods');
    expect(init.method).toBe('POST');

    const body = JSON.parse(String(init.body)) as {
      type: string;
      card: Record<string, string>;
    };

    expect(body.type).toBe('card');
    expect(body.card.nonce).toMatch(/^[a-zA-Z0-9]{12}$/);
    expect(body.card.encrypted_card_number).not.toContain('5531886652142950');
    expect(body.card.encrypted_cvv).not.toContain('564');
    expect(body.card.encrypted_expiry_month).not.toBe('09');
    expect(body.card.encrypted_expiry_year).not.toBe('32');
    expect(body.card.card_holder_name).toBe('Alex James');

    expect(result.content[0]?.text).toContain('"status": 201');
    expect(result.content[0]?.text).toContain('pmd_1');
  });

  it('throws when the configured v4 encryption key is empty', async () => {
    vi.resetModules();
    process.env.FLW_API_VERSION = 'v3';
    process.env.FLW_SECRET_KEY = 'sk_test';
    delete process.env.FLW_ENCRYPTION_KEY_V4;

    const { createCardPaymentMethod } = await import(
      '../../tools/v4/createCardPaymentMethod.js'
    );

    await expect(createCardPaymentMethod(CARD)).rejects.toThrow(
      'FLW_ENCRYPTION_KEY_V4',
    );
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });

  it('throws when Flutterwave returns a non-OK response', async () => {
    mockFlwV4Fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'card declined' }), { status: 400 }),
    );

    const { createCardPaymentMethod } = await import(
      '../../tools/v4/createCardPaymentMethod.js'
    );

    await expect(createCardPaymentMethod(CARD)).rejects.toThrow(
      'Flutterwave v4 payment method request failed: 400',
    );
  });

  it('returns isError from the registered handler when the call throws', async () => {
    vi.resetModules();
    process.env.FLW_API_VERSION = 'v3';
    process.env.FLW_SECRET_KEY = 'sk_test';
    delete process.env.FLW_ENCRYPTION_KEY_V4;

    const { handleCreateCardPaymentMethod } = await import(
      '../../tools/v4/register.js'
    );

    const result = await handleCreateCardPaymentMethod(CARD);

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('FLW_ENCRYPTION_KEY_V4');
    expect(mockFlwV4Fetch).not.toHaveBeenCalled();
  });
});
