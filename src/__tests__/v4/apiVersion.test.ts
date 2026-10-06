import { describe, expect, it } from 'vitest';
import { acceptedToolsFor } from '../../config/acceptedTools.js';
import { getApiVersion } from '../../config/apiVersion.js';
import { parseFlutterwaveEnv } from '../../config/env.js';

describe('v4 api version selection', () => {
  it('defaults to v3 when FLW_API_VERSION is unset', () => {
    expect(getApiVersion({})).toBe('v3');
    expect(acceptedToolsFor('v3')).toContain('charge_card');
    expect(acceptedToolsFor('v3')).not.toContain('create_card_payment_method');
  });

  it('selects the v4 tool allowlist only', () => {
    expect(getApiVersion({ FLW_API_VERSION: 'v4' })).toBe('v4');
    expect(acceptedToolsFor('v4')).toEqual(['create_card_payment_method']);
  });

  it('falls back to v3 for an unrecognized version', () => {
    expect(getApiVersion({ FLW_API_VERSION: 'v5' })).toBe('v3');
  });

  it('requires the v3 secret key and not v4 credentials', () => {
    expect(() => parseFlutterwaveEnv({})).toThrow('Invalid environment variables');
    const config = parseFlutterwaveEnv({ FLW_SECRET_KEY: 'sk_test' });
    expect(config.apiVersion).toBe('v3');
    expect(config.flutterwave.secretKey).toBe('sk_test');
  });

  it('requires v4 credentials and not the v3 secret key', () => {
    expect(() =>
      parseFlutterwaveEnv({ FLW_API_VERSION: 'v4', FLW_SECRET_KEY: 'sk_test' }),
    ).toThrow('Invalid environment variables');

    const config = parseFlutterwaveEnv({
      FLW_API_VERSION: 'v4',
      FLW_CLIENT_ID: 'client',
      FLW_CLIENT_SECRET: 'secret',
      FLW_ENCRYPTION_KEY_V4: 'key',
    });
    expect(config.apiVersion).toBe('v4');
    expect(config.flutterwave.clientId).toBe('client');
    expect(config.flutterwave.encryptionKeyV4).toBe('key');
  });
});
