import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { liveAdAccountPath, metaClient } from '../meta/client.js';
import type { Campaign, MetaPaginatedResponse } from '../meta/types.js';
import { ok, fail } from './utils.js';

export function registerCampaignTools(server: McpServer) {
  server.registerTool(
    'meta_get_campaigns',
    {
      title: 'Get Campaigns',
      description: 'List ad campaigns for the Meta ad account',
      inputSchema: z.object({
        status: z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']).optional(),
        limit: z.number().int().min(1).max(100).default(25),
      }),
    },
    async ({ status, limit }) => {
      try {
        const params: Record<string, string | number> = {
          fields: 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time',
          limit,
        };
        if (status) params.effective_status = JSON.stringify([status]);

        const result = await metaClient.get<MetaPaginatedResponse<Campaign>>(
          `${liveAdAccountPath()}/campaigns`,
          params,
        );
        return ok(result.data);
      } catch (err) {
        return fail(err);
      }
    },
  );
}
