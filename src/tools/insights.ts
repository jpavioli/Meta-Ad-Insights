import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { metaClient, liveAdAccountPath } from '../meta/client.js';
import type { Insight, MetaPaginatedResponse } from '../meta/types.js';
import { ok, fail } from './utils.js';

const DEFAULT_FIELDS = [
  'impressions',
  'clicks',
  'spend',
  'ctr',
  'cpc',
  'cpm',
  'reach',
  'frequency',
  'actions',
].join(',');

export function registerInsightTools(server: McpServer) {
  server.registerTool(
    'meta_get_insights',
    {
      title: 'Get Insights',
      description: 'Retrieve performance metrics for the ad account, a campaign, ad set, or ad',
      inputSchema: z.object({
        level: z.enum(['account', 'campaign', 'adset', 'ad']).default('account'),
        object_id: z.string().optional()
          .describe('Campaign, ad set, or ad ID to scope the insights. Omit for account-level.'),
        date_preset: z.enum([
          'today',
          'yesterday',
          'last_7d',
          'last_14d',
          'last_30d',
          'last_month',
          'this_month',
          'last_year',
          'maximum',
        ]).optional().default('last_30d'),
        time_range_since: z.string().optional()
          .describe('Start date YYYY-MM-DD. Overrides date_preset when both since and until are provided.'),
        time_range_until: z.string().optional()
          .describe('End date YYYY-MM-DD. Overrides date_preset when both since and until are provided.'),
        extra_fields: z.array(z.string()).optional()
          .describe('Additional fields beyond the default set (impressions, clicks, spend, ctr, cpc, cpm, reach, frequency, actions)'),
        limit: z.number().int().min(1).max(100).default(25),
      }),
    },
    async ({ level, object_id, date_preset, time_range_since, time_range_until, extra_fields, limit }) => {
      try {
        const basePath = object_id ? `/${object_id}/insights` : `${liveAdAccountPath()}/insights`;

        const fields = extra_fields?.length
          ? `${DEFAULT_FIELDS},${extra_fields.join(',')}`
          : DEFAULT_FIELDS;

        const params: Record<string, string | number> = { fields, level, limit };

        if (time_range_since && time_range_until) {
          params.time_range = JSON.stringify({ since: time_range_since, until: time_range_until });
        } else if (date_preset) {
          params.date_preset = date_preset;
        }

        const result = await metaClient.get<MetaPaginatedResponse<Insight>>(basePath, params);
        return ok(result.data);
      } catch (err) {
        return fail(err);
      }
    },
  );
}
