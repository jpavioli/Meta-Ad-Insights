import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server';
import { registerCampaignTools } from './tools/campaigns.js';
import { registerAdSetTools } from './tools/adsets.js';
import { registerAdTools } from './tools/ads.js';
import { registerInsightTools } from './tools/insights.js';

const server = new McpServer({ name: 'meta-ad-insights', version: '1.0.0' });

registerCampaignTools(server);
registerAdSetTools(server);
registerAdTools(server);
registerInsightTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
