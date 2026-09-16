type FlwEnvironment = 'sandbox' | 'production';

const SANDBOX_BASE_URL = 'https://developersandbox-api.flutterwave.com';
const PRODUCTION_BASE_URL = 'https://f4bexperience.flutterwave.com';

function parseEnvironment(): FlwEnvironment {
  const env = process.env.FLW_ENVIRONMENT;
  if (env === 'production') {
    return 'production';
  }
  if (env === 'sandbox') {
    return 'sandbox';
  }
  if (env !== undefined && env !== '') {
    console.warn(
      `Unrecognized FLW_ENVIRONMENT value "${env}", falling back to "sandbox". Expected "sandbox" or "production".`,
    );
  }
  // Default to sandbox for unset or invalid values (never default to production).
  return 'sandbox';
}

export function getV4BaseUrl(): string {
  return parseEnvironment() === 'production' ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
}
