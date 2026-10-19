import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  V3_ACCEPTED_TOOLS,
  V4_ACCEPTED_TOOLS,
} from '../../config/acceptedTools.js';

const readme = readFileSync(new URL('../../../README.md', import.meta.url), 'utf8');

function acceptedNames(heading: string): string[] {
  const headingAt = readme.indexOf(heading);
  if (headingAt < 0) {
    throw new Error(`README is missing ${heading}`);
  }
  const fence = readme.indexOf('```', headingAt);
  const end = readme.indexOf('```', fence + 3);
  return readme
    .slice(fence + 3, end)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

describe('README tool lists', () => {
  it('documents v4 as opt-in and keeps the v3 default', () => {
    expect(readme).not.toMatch(/coming soon/i);
    expect(readme).toContain('FLW_API_VERSION=v4');
    expect(readme).toContain('targets the Flutterwave v3 API by default');
  });

  it('lists the v3 allowlist', () => {
    expect(acceptedNames('**v3 accepted tool names**')).toEqual([
      ...V3_ACCEPTED_TOOLS,
    ]);
  });

  it('lists the v4 allowlist', () => {
    expect(acceptedNames('**v4 accepted tool names**')).toEqual([
      ...V4_ACCEPTED_TOOLS,
    ]);
  });
});
