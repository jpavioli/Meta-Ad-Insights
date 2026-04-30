import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { metaClient, liveAdAccountPath } from '../meta/client.js';
import type { Ad, MetaPaginatedResponse } from '../meta/types.js';
import { ok, fail } from './utils.js';

export function registerAdTools(server: McpServer) {
  server.registerTool(
    'meta_get_ads',
    {
      title: 'Get Ads',
      description: 'List ads for the Meta ad account, optionally filtered by ad set or campaign',
      inputSchema: z.object({
        adset_id: z.string().optional().describe('Filter by ad set ID'),
        campaign_id: z.string().optional().describe('Filter by campaign ID'),
        status: z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']).optional(),
        limit: z.number().int().min(1).max(100).default(25),
      }),
    },
    async ({ adset_id, campaign_id, status, limit }) => {
      try {
        const fields = 'id,name,adset_id,campaign_id,status,creative{id,name},created_time,updated_time';
        const params: Record<string, string | number> = { fields, limit };
        if (status) params.effective_status = JSON.stringify([status]);

        let basePath: string;
        if (adset_id) {
          basePath = `/${adset_id}/ads`;
        } else if (campaign_id) {
          basePath = `/${campaign_id}/ads`;
        } else {
          basePath = `${liveAdAccountPath()}/ads`;
        }

        const result = await metaClient.get<MetaPaginatedResponse<Ad>>(basePath, params);
        return ok(result.data);
      } catch (err) {
        return fail(err);
      }
    },
  );
}
