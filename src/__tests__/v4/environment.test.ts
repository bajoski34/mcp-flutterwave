import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SANDBOX_BASE_URL = 'https://developersandbox-api.flutterwave.com';
const PRODUCTION_BASE_URL = 'https://f4bexperience.flutterwave.com';

describe('v4 getV4BaseUrl', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete process.env.FLW_ENVIRONMENT;
  });

  afterEach(() => {
    warnSpy.mockRestore();
    delete process.env.FLW_ENVIRONMENT;
  });

  it('returns sandbox URL when FLW_ENVIRONMENT is unset', async () => {
    const { getV4BaseUrl } = await import('../../client/environmentV4.js');

    expect(getV4BaseUrl()).toBe(SANDBOX_BASE_URL);
  });

  it('returns sandbox URL when explicitly set to "sandbox"', async () => {
    process.env.FLW_ENVIRONMENT = 'sandbox';

    const { getV4BaseUrl } = await import('../../client/environmentV4.js');

    expect(getV4BaseUrl()).toBe(SANDBOX_BASE_URL);
  });

  it('returns production URL when explicitly set to "production"', async () => {
    process.env.FLW_ENVIRONMENT = 'production';

    const { getV4BaseUrl } = await import('../../client/environmentV4.js');

    expect(getV4BaseUrl()).toBe(PRODUCTION_BASE_URL);
  });

  it('returns sandbox URL and warns when set to an unrecognized value', async () => {
    process.env.FLW_ENVIRONMENT = 'Production';

    const { getV4BaseUrl } = await import('../../client/environmentV4.js');

    expect(getV4BaseUrl()).toBe(SANDBOX_BASE_URL);
    expect(warnSpy).toHaveBeenCalledWith(
      'Unrecognized FLW_ENVIRONMENT value "Production", falling back to "sandbox". Expected "sandbox" or "production".',
    );
  });

  it('returns sandbox URL and warns for other unrecognized values like "prod"', async () => {
    process.env.FLW_ENVIRONMENT = 'prod';

    const { getV4BaseUrl } = await import('../../client/environmentV4.js');

    expect(getV4BaseUrl()).toBe(SANDBOX_BASE_URL);
    expect(warnSpy).toHaveBeenCalledWith(
      'Unrecognized FLW_ENVIRONMENT value "prod", falling back to "sandbox". Expected "sandbox" or "production".',
    );
  });

  it('does not warn when FLW_ENVIRONMENT is unset', async () => {
    const { getV4BaseUrl } = await import('../../client/environmentV4.js');

    getV4BaseUrl();

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
