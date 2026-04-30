import { MetaApiError } from '../meta/client.js';

export type ToolResult = {
  content: [{ type: 'text'; text: string }];
  isError?: true;
};

export function ok(data: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function fail(err: unknown): ToolResult {
  const message =
    err instanceof MetaApiError
      ? `Meta API Error (${err.code}): ${err.message}`
      : err instanceof Error
        ? err.message
        : String(err);
  return { content: [{ type: 'text', text: message }], isError: true };
}
