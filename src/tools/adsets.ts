import type { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { metaClient, liveAdAccountPath } from '../meta/client.js';
import type { AdSet, MetaPaginatedResponse } from '../meta/types.js';
import { ok, fail } from './utils.js';

export function registerAdSetTools(server: McpServer) {
  server.registerTool(
    'meta_get_ad_sets',
    {
      title: 'Get Ad Sets',
      description: 'List ad sets for the Meta ad account, optionally filtered by campaign',
      inputSchema: z.object({
        campaign_id: z.string().optional().describe('Filter by campaign ID'),
        status: z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']).optional(),
        limit: z.number().int().min(1).max(100).default(25),
      }),
    },
    async ({ campaign_id, status, limit }) => {
      try {
        const fields = 'id,name,campaign_id,status,daily_budget,lifetime_budget,billing_event,optimization_goal,targeting,start_time,end_time,bid_amount,created_time,updated_time';
        const params: Record<string, string | number> = { fields, limit };
        if (status) params.effective_status = JSON.stringify([status]);

        const basePath = campaign_id
          ? `/${campaign_id}/adsets`
          : `${liveAdAccountPath()}/adsets`;

        const result = await metaClient.get<MetaPaginatedResponse<AdSet>>(basePath, params);
        return ok(result.data);
      } catch (err) {
        return fail(err);
      }
    },
  );
}
