import { version } from 'os';
import {z} from 'zod';

// environment variable schema for validation
const envSchema = z.object({
  FLW_SECRET_KEY: z.string().min(1, 'Flutterwave Secret Key is required'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
});

// Parse and validate environment variables
const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', envParse.error.format());
  throw new Error('Invalid environment variables');
}

// Export validated config
export const config = {
  flutterwave: {
    secretKey: envParse.data.FLW_SECRET_KEY,
    apiUrl: 'https://api.flutterwave.com',
    version: 'v3',
  },
  server: {
    environment: envParse.data.NODE_ENV,
  },
} as const;
