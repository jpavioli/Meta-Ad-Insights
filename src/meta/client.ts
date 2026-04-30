import { config } from '../config.js';
import type { MetaError } from './types.js';

const BASE = `https://graph.facebook.com/${config.META_API_VERSION}`;

export class MetaApiError extends Error {
  readonly code: number;
  readonly fbTraceId: string;

  constructor(err: MetaError) {
    super(err.message);
    this.name = 'MetaApiError';
    this.code = err.code;
    this.fbTraceId = err.fbtrace_id;
  }
}

export type Params = Record<string, string | number | boolean>;

async function graphRequest<T>(path: string, method: 'GET', params: Params = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);

  url.searchParams.set('access_token', config.LIVE_META_ACCESS_TOKEN);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const init: RequestInit = { method };

  const res = await fetch(url.toString(), init);
  const json = await res.json() as Record<string, unknown>;

  if ('error' in json) {
    throw new MetaApiError(json.error as MetaError);
  }

  return json as T;
}

export function liveAdAccountPath(): string {
  const id = config.LIVE_META_AD_ACCOUNT_ID.replace(/^act_/, '');
  return `/act_${id}`;
}

export const metaClient = {
  get: <T>(path: string, params?: Params) => graphRequest<T>(path, 'GET', params),
};
