# Sports MCP Server

A Model Context Protocol (MCP) server that provides access to live sports data from ESPN's API endpoints. This server allows AI agents to retrieve real-time sports scores, news, team information, game details, and rankings across multiple sports and leagues.

## Features

- **Live Sports Scores**: Get real-time scores and game information
- **Sports News**: Access latest news and updates
- **Team Information**: Retrieve detailed team data and statistics
- **Game Details**: Get comprehensive game summaries and statistics
- **Rankings**: Access college sports rankings
- **Multi-Sport Support**: Football, Basketball, Baseball, Hockey, and Soccer

## Supported Sports & Leagues

### Football
- **College Football**: `college`
- **NFL**: `nfl`

### Basketball
- **NBA**: `nba`
- **WNBA**: `wnba`
- **Men's College Basketball**: `mens-college`
- **Women's College Basketball**: `womens-college`

### Baseball
- **MLB**: `mlb`
- **College Baseball**: `college`

### Hockey
- **NHL**: `nhl`

### Soccer
- **English Premier League**: `eng.1`
- **MLS**: `usa.1`
- **La Liga**: `esp.1`
- **Bundesliga**: `ger.1`
- **Ligue 1**: `fra.1`
- **Serie A**: `ita.1`

## Available Tools

### 1. `get_sports_scores`
Get live scores and game information for a specific sport and league.

**Parameters:**
- `sport` (required): The sport (football, basketball, baseball, hockey, soccer)
- `league` (required): The league within the sport
- `date` (optional): Date in YYYYMMDD format (defaults to today)

**Example:**
```json
{
  "sport": "football",
  "league": "nfl",
  "date": "20241201"
}
```

### 2. `get_sports_news`
Get latest news for a specific sport and league.

**Parameters:**
- `sport` (required): The sport
- `league` (required): The league within the sport

**Example:**
```json
{
  "sport": "basketball",
  "league": "nba"
}
```

### 3. `get_team_info`
Get detailed information about a specific team.

**Parameters:**
- `sport` (required): The sport
- `league` (required): The league
- `team` (required): Team identifier or abbreviation

**Example:**
```json
{
  "sport": "football",
  "league": "nfl",
  "team": "ne"
}
```

### 4. `get_game_details`
Get detailed information about a specific game.

**Parameters:**
- `sport` (required): The sport
- `league` (required): The league
- `gameId` (required): The unique game identifier

**Example:**
```json
{
  "sport": "basketball",
  "league": "nba",
  "gameId": "401585401"
}
```

### 5. `get_rankings`
Get rankings for college sports.

**Parameters:**
- `sport` (required): The sport (football, basketball)
- `league` (required): The college league (college, mens-college, womens-college)

**Example:**
```json
{
  "sport": "football",
  "league": "college"
}
```

### 6. `get_available_sports`
Get list of all available sports and leagues.

**Parameters:** None

## Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShawnDM/espn-mcp.git
   cd espn-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run the server:**
   ```bash
   npm start
   ```

### Development Mode
```bash
npm run dev
```

## Deployment on Smithery.ai

This MCP server is configured for deployment on [Smithery.ai](https://smithery.ai). The `smithery.json` configuration file contains all necessary metadata for the platform.

### Deployment Steps:
1. Push your code to GitHub
2. Connect your repository to Smithery.ai
3. The platform will automatically detect the MCP server configuration
4. Deploy and start using the server

## API Endpoints Used

This server integrates with ESPN's undocumented API endpoints:

- **Scores**: `http://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard`
- **News**: `http://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/news`
- **Teams**: `http://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/teams/{team}`
- **Game Details**: `http://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/summary?event={gameId}`
- **Rankings**: `http://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/rankings`

## Error Handling

The server includes comprehensive error handling for:
- Invalid sport/league combinations
- Network timeouts and API failures
- Malformed requests
- Missing required parameters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- ESPN for providing the sports data API
- The MCP SDK team for the excellent framework
- Community contributors who discovered the ESPN API endpoints

## Support

For issues and questions:
- Create an issue on GitHub
- Check the ESPN API documentation in `espn-api-docs/`
- Review the MCP documentation at [modelcontextprotocol.io](https://modelcontextprotocol.io)