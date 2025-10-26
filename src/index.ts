#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { z } from 'zod';

// ESPN API Base URLs
const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports';
const ESPN_CORE_API_BASE = 'https://sports.core.api.espn.com/v2/sports';

// Sports configuration
const SPORTS_CONFIG = {
  football: {
    college: 'football/college-football',
    nfl: 'football/nfl'
  },
  basketball: {
    nba: 'basketball/nba',
    wnba: 'basketball/wnba',
    'mens-college': 'basketball/mens-college-basketball',
    'womens-college': 'basketball/womens-college-basketball'
  },
  baseball: {
    mlb: 'baseball/mlb',
    college: 'baseball/college-baseball'
  },
  hockey: {
    nhl: 'hockey/nhl'
  },
  soccer: {
    leagues: ['eng.1', 'usa.1', 'esp.1', 'ger.1', 'fra.1', 'ita.1']
  }
};

// Validation schemas
const SportSchema = z.enum(['football', 'basketball', 'baseball', 'hockey', 'soccer']);
const LeagueSchema = z.string();
const DateSchema = z.string().regex(/^\d{8}$/, 'Date must be in YYYYMMDD format');
const TeamSchema = z.string();

class SportsMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'sports-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_sports_scores',
            description: 'Get live scores and game information for a specific sport and league',
            inputSchema: {
              type: 'object',
              properties: {
                sport: {
                  type: 'string',
                  enum: Object.keys(SPORTS_CONFIG),
                  description: 'The sport to get scores for'
                },
                league: {
                  type: 'string',
                  description: 'The league within the sport (e.g., nfl, nba, mlb, etc.)'
                },
                date: {
                  type: 'string',
                  description: 'Date in YYYYMMDD format (optional, defaults to today)'
                }
              },
              required: ['sport', 'league']
            }
          },
          {
            name: 'get_sports_news',
            description: 'Get latest news for a specific sport and league',
            inputSchema: {
              type: 'object',
              properties: {
                sport: {
                  type: 'string',
                  enum: Object.keys(SPORTS_CONFIG),
                  description: 'The sport to get news for'
                },
                league: {
                  type: 'string',
                  description: 'The league within the sport'
                }
              },
              required: ['sport', 'league']
            }
          },
          {
            name: 'get_team_info',
            description: 'Get detailed information about a specific team',
            inputSchema: {
              type: 'object',
              properties: {
                sport: {
                  type: 'string',
                  enum: Object.keys(SPORTS_CONFIG),
                  description: 'The sport'
                },
                league: {
                  type: 'string',
                  description: 'The league'
                },
                team: {
                  type: 'string',
                  description: 'Team identifier or abbreviation'
                }
              },
              required: ['sport', 'league', 'team']
            }
          },
          {
            name: 'get_game_details',
            description: 'Get detailed information about a specific game',
            inputSchema: {
              type: 'object',
              properties: {
                sport: {
                  type: 'string',
                  enum: Object.keys(SPORTS_CONFIG),
                  description: 'The sport'
                },
                league: {
                  type: 'string',
                  description: 'The league'
                },
                gameId: {
                  type: 'string',
                  description: 'The unique game identifier'
                }
              },
              required: ['sport', 'league', 'gameId']
            }
          },
          {
            name: 'get_rankings',
            description: 'Get rankings for college sports',
            inputSchema: {
              type: 'object',
              properties: {
                sport: {
                  type: 'string',
                  enum: ['football', 'basketball'],
                  description: 'The sport (only college sports have rankings)'
                },
                league: {
                  type: 'string',
                  enum: ['college', 'mens-college', 'womens-college'],
                  description: 'The college league'
                }
              },
              required: ['sport', 'league']
            }
          },
          {
            name: 'get_available_sports',
            description: 'Get list of all available sports and leagues',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ] as Tool[]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_sports_scores':
            return await this.getSportsScores(args);
          case 'get_sports_news':
            return await this.getSportsNews(args);
          case 'get_team_info':
            return await this.getTeamInfo(args);
          case 'get_game_details':
            return await this.getGameDetails(args);
          case 'get_rankings':
            return await this.getRankings(args);
          case 'get_available_sports':
            return await this.getAvailableSports();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            }
          ],
          isError: true
        };
      }
    });
  }

  private async getSportsScores(args: any) {
    const { sport, league, date } = args;
    
    if (!SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG]) {
      throw new Error(`Invalid sport: ${sport}`);
    }

    let url: string;
    if (sport === 'soccer') {
      if (!SPORTS_CONFIG.soccer.leagues.includes(league)) {
        throw new Error(`Invalid soccer league: ${league}. Available: ${SPORTS_CONFIG.soccer.leagues.join(', ')}`);
      }
      url = `${ESPN_API_BASE}/soccer/${league}/scoreboard`;
    } else {
      const sportConfig = SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG] as any;
      if (!sportConfig[league]) {
        throw new Error(`Invalid league for ${sport}: ${league}`);
      }
      url = `${ESPN_API_BASE}/${sportConfig[league]}/scoreboard`;
    }

    if (date) {
      url += `?dates=${date}`;
    }

    const response = await axios.get(url);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  }

  private async getSportsNews(args: any) {
    const { sport, league } = args;
    
    if (!SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG]) {
      throw new Error(`Invalid sport: ${sport}`);
    }

    let url: string;
    if (sport === 'soccer') {
      if (!SPORTS_CONFIG.soccer.leagues.includes(league)) {
        throw new Error(`Invalid soccer league: ${league}`);
      }
      url = `${ESPN_API_BASE}/soccer/${league}/news`;
    } else {
      const sportConfig = SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG] as any;
      if (!sportConfig[league]) {
        throw new Error(`Invalid league for ${sport}: ${league}`);
      }
      url = `${ESPN_API_BASE}/${sportConfig[league]}/news`;
    }

    const response = await axios.get(url);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  }

  private async getTeamInfo(args: any) {
    const { sport, league, team } = args;
    
    if (!SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG]) {
      throw new Error(`Invalid sport: ${sport}`);
    }

    let url: string;
    if (sport === 'soccer') {
      if (!SPORTS_CONFIG.soccer.leagues.includes(league)) {
        throw new Error(`Invalid soccer league: ${league}`);
      }
      url = `${ESPN_API_BASE}/soccer/${league}/teams/${team}`;
    } else {
      const sportConfig = SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG] as any;
      if (!sportConfig[league]) {
        throw new Error(`Invalid league for ${sport}: ${league}`);
      }
      url = `${ESPN_API_BASE}/${sportConfig[league]}/teams/${team}`;
    }

    const response = await axios.get(url);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  }

  private async getGameDetails(args: any) {
    const { sport, league, gameId } = args;
    
    if (!SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG]) {
      throw new Error(`Invalid sport: ${sport}`);
    }

    let url: string;
    if (sport === 'soccer') {
      if (!SPORTS_CONFIG.soccer.leagues.includes(league)) {
        throw new Error(`Invalid soccer league: ${league}`);
      }
      url = `${ESPN_API_BASE}/soccer/${league}/summary?event=${gameId}`;
    } else {
      const sportConfig = SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG] as any;
      if (!sportConfig[league]) {
        throw new Error(`Invalid league for ${sport}: ${league}`);
      }
      url = `${ESPN_API_BASE}/${sportConfig[league]}/summary?event=${gameId}`;
    }

    const response = await axios.get(url);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  }

  private async getRankings(args: any) {
    const { sport, league } = args;
    
    if (sport !== 'football' && sport !== 'basketball') {
      throw new Error('Rankings are only available for college football and basketball');
    }

    let url: string;
    if (sport === 'football') {
      url = `${ESPN_API_BASE}/football/college-football/rankings`;
    } else {
      if (league === 'mens-college') {
        url = `${ESPN_API_BASE}/basketball/mens-college-basketball/rankings`;
      } else if (league === 'womens-college') {
        url = `${ESPN_API_BASE}/basketball/womens-college-basketball/rankings`;
      } else {
        throw new Error('Invalid league for basketball rankings');
      }
    }

    const response = await axios.get(url);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  }

  private async getAvailableSports() {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(SPORTS_CONFIG, null, 2)
        }
      ]
    };
  }

  async run() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('Sports MCP Server running on stdio');
    } catch (error) {
      console.error('Failed to start Sports MCP Server:', error);
      process.exit(1);
    }
  }
}

const server = new SportsMCPServer();
server.run().catch(console.error);
