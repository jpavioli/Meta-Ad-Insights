# Meta Ad Insights [MCP]
This is a MCP server to interact with Meta to get campaign insights. The intent is to use a LLM to engage with campaign analytics and drill down into what makes a camapign a success.

This is written in typescript and instructions to deploy are intended for Claude. 

## Instalation
First ensure that you have node to run the local server 
``` bash
$ node -v
```
If not, follow the instructions to [install](https://nodejs.org/en/download) it locally. 

Clone the repo and save it to your local disk. Where? It doesn't really matter, but just take a note of where the directory is located because that will be needed to configure the MCP in Claude. 

Here's how to clone and get the working directory location 
```
$ git clone git@github.com:jpavioli/Meta-Ad-Insights.git
$ cd Meta-Ads-Insights
$ pwd
```
While there, you may as well build the server using the following command
```
$ npm install
$ npm run build
```
which will create a build version of the server for Claude to access. 

From here, locate your claude deskop config file. The easiest way to do that is open claude, go to settings, find Developer Settings, and click on "Edit Config". This will open up Claude's coniguration directory. Open up `claude_desktop_config.json` and add the following:
```
{
  "preferences": {
      ... no change here ...
  },
  "mcpServers": {
    "other-mcp-servers"{
      [specific configs]
    },
    // THIS SECTION RIGHT HERE
    "meta-ad-insights": {
      "command": "node",
      "args": ["<THE RESULT OF EXECUTING pwd IN YOUR CLONED REPO>/build/index.js"],
      "env": {
        "LIVE_META_ACCESS_TOKEN": "<YOUR META ACCESS TOKEN>",
        "LIVE_META_AD_ACCOUNT_ID": "<YOUR META AD ACCOUNT>"
      }
    }
    // END
  }
}
```
Then restart claude and you should see the Get Insights MCP in your "Connectors". 

## Utility
This MCP allows you to use the following tools:

### meta_get_insights
Retrieve performance metrics for the ad account, a campaign, ad set, or ad directly from meta. 

### meta_get_campaigns
List ad campaigns for the Meta ad account, allowing for you session to get specific context on ad campaigns. 

### meta_get_ad_sets
List ad sets for the Meta ad account, optionally filtered by campaign allowing for contest on ad sets. 

### meta_get_ads
List ads for the Meta ad account, optionally filtered by ad set or campaign allowing for context at the ad level. 
