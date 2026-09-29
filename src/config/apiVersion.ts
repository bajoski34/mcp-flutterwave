export type ApiVersion = 'v3' | 'v4';

export function getApiVersion(
  env: NodeJS.ProcessEnv = process.env,
): ApiVersion {
  const value = env.FLW_API_VERSION;
  if (value === undefined || value === '' || value === 'v3') {
    return 'v3';
  }
  if (value === 'v4') {
    return 'v4';
  }
  console.warn(
    `Unrecognized FLW_API_VERSION value "${value}", falling back to "v3". Expected "v3" or "v4".`,
  );
  return 'v3';
}
