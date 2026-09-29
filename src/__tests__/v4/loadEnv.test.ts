import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadEnvFile } from '../../config/loadEnv.js';

describe('loadEnvFile', () => {
  const previous = process.env.FLW_API_VERSION;
  let dir = '';

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.FLW_API_VERSION;
    } else {
      process.env.FLW_API_VERSION = previous;
    }
    delete process.env.FLW_LOAD_ENV_TEST;
    if (dir !== '') {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('fills unset variables and keeps ones already set in the shell', () => {
    dir = mkdtempSync(join(tmpdir(), 'flw-env-'));
    const path = join(dir, '.env');
    writeFileSync(
      path,
      'FLW_API_VERSION=v4\nFLW_LOAD_ENV_TEST=from-file\n# comment\n',
    );
    process.env.FLW_API_VERSION = 'v3';

    loadEnvFile(path);

    expect(process.env.FLW_API_VERSION).toBe('v3');
    expect(process.env.FLW_LOAD_ENV_TEST).toBe('from-file');
  });
});
