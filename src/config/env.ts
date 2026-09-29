import { z } from 'zod';
import { getApiVersion, type ApiVersion } from './apiVersion.js';

const nodeEnvSchema = z
  .enum(['development', 'production', 'test'])
  .optional()
  .default('development');

export interface FlutterwaveConfig {
  apiVersion: ApiVersion;
  flutterwave: {
    secretKey: string;
    apiUrl: string;
    version: string;
    clientId: string;
    clientSecret: string;
    encryptionKeyV4: string;
  };
  server: {
    environment: 'development' | 'production' | 'test';
  };
}

export function parseFlutterwaveEnv(env: NodeJS.ProcessEnv): FlutterwaveConfig {
  const apiVersion = getApiVersion(env);
  const base = {
    apiUrl: 'https://api.flutterwave.com',
    // v3 URL path segment (FLW_VERSION). v4 requests use getV4BaseUrl(), not this field.
    version: 'v3',
  };

  if (apiVersion === 'v4') {
    const parsed = z
      .object({
        FLW_CLIENT_ID: z
          .string()
          .min(1, 'FLW_CLIENT_ID is required when FLW_API_VERSION=v4'),
        FLW_CLIENT_SECRET: z
          .string()
          .min(1, 'FLW_CLIENT_SECRET is required when FLW_API_VERSION=v4'),
        FLW_ENCRYPTION_KEY_V4: z
          .string()
          .min(1, 'FLW_ENCRYPTION_KEY_V4 is required when FLW_API_VERSION=v4'),
        NODE_ENV: nodeEnvSchema,
      })
      .safeParse(env);

    if (!parsed.success) {
      console.error('❌ Invalid environment variables:', parsed.error.format());
      throw new Error('Invalid environment variables');
    }

    return {
      apiVersion,
      flutterwave: {
        ...base,
        secretKey: '',
        clientId: parsed.data.FLW_CLIENT_ID,
        clientSecret: parsed.data.FLW_CLIENT_SECRET,
        encryptionKeyV4: parsed.data.FLW_ENCRYPTION_KEY_V4,
      },
      server: { environment: parsed.data.NODE_ENV },
    };
  }

  const parsed = z
    .object({
      FLW_SECRET_KEY: z.string().min(1, 'Flutterwave Secret Key is required'),
      NODE_ENV: nodeEnvSchema,
    })
    .safeParse(env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return {
    apiVersion,
    flutterwave: {
      ...base,
      secretKey: parsed.data.FLW_SECRET_KEY,
      clientId: '',
      clientSecret: '',
      encryptionKeyV4: '',
    },
    server: { environment: parsed.data.NODE_ENV },
  };
}
