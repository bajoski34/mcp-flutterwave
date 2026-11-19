/**
 * Registry imports parse env at load time. CI has no .env, so give the
 * suite the same dummy v4 credentials the handler tests already use.
 * Existing values win, including ones a test sets before resetModules().
 */
const defaults: Record<string, string> = {
  FLW_API_VERSION: 'v4',
  FLW_CLIENT_ID: 'test-client-id',
  FLW_CLIENT_SECRET: 'test-client-secret',
  FLW_ENCRYPTION_KEY_V4: Buffer.alloc(32, 7).toString('base64'),
  FLW_SECRET_KEY: 'sk_test',
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
