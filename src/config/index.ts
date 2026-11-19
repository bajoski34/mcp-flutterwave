import { loadEnvFile } from './loadEnv.js';
import { parseFlutterwaveEnv } from './env.js';

export { parseFlutterwaveEnv } from './env.js';
export type { FlutterwaveConfig } from './env.js';

loadEnvFile();

export const config = parseFlutterwaveEnv(process.env);
