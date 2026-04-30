import * as z from 'zod/v4';

const ConfigSchema = z.object({
  LIVE_META_ACCESS_TOKEN: z.string().min(1),
  LIVE_META_AD_ACCOUNT_ID: z.string().min(1),
  META_API_VERSION: z.string().default('v21.0'),
});

function loadConfig() {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues.map(i => i.path.join('.')).join(', ');
    throw new Error(`Missing required environment variables: ${missing}`);
  }
  return result.data;
}

export const config = loadConfig();