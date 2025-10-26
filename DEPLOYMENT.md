# Smithery.ai Deployment Guide

This guide will help you deploy the Sports MCP Server to [Smithery.ai](https://smithery.ai), a platform for hosting and managing MCP servers.

## Prerequisites

1. **GitHub Account**: Your code needs to be in a GitHub repository
2. **Smithery.ai Account**: Sign up at [smithery.ai](https://smithery.ai)
3. **Node.js 18+**: Required for building the project

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the following files:
- `package.json` - Node.js dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Main MCP server implementation
- `smithery.json` - Smithery.ai configuration
- `README.md` - Documentation
- `.gitignore` - Git ignore rules

### 2. Push to GitHub

```bash
git add .
git commit -m "Initial Sports MCP Server implementation"
git push -u origin main
```

### 3. Connect to Smithery.ai

1. Log in to [smithery.ai](https://smithery.ai)
2. Click "New Server" or "Deploy Server"
3. Connect your GitHub account
4. Select your repository (`espn-mcp` or similar)
5. Choose the branch (usually `main`)

### 4. Configure Deployment

Smithery.ai will automatically detect the MCP server configuration from `smithery.yaml`. The configuration includes:

- **Server Name**: `sports-mcp-server`
- **Description**: Access live sports data from ESPN API
- **Capabilities**: Tools support
- **Available Tools**: 6 tools for sports data access

### 5. Build and Deploy

Smithery.ai will:
1. Install dependencies (`npm install`)
2. Build the TypeScript project (`npm run build`)
3. Start the MCP server (`npm start`)
4. Make it available for AI agents to connect to

### 6. Test Your Deployment

Once deployed, you can test your server by:

1. **Using the Smithery.ai interface** to test individual tools
2. **Connecting from an AI agent** using the server URL
3. **Checking logs** for any errors or issues

## Configuration Details

### smithery.yaml Structure

```yaml
startCommand:
  type: "stdio"
  configSchema:
    type: "object"
    properties: {}
  commandFunction: |
    (config) => ({ command: 'node', args: ['dist/index.js'] })
  exampleConfig: {}
```

### Environment Variables

No environment variables are required for basic functionality. The server uses ESPN's public API endpoints.

### Build Process

The deployment process follows these steps:
1. `npm install` - Install dependencies
2. `npm run build` - Compile TypeScript to JavaScript
3. `npm start` - Start the MCP server

## Monitoring and Maintenance

### Logs
- Check the Smithery.ai dashboard for server logs
- Monitor for API rate limits or errors
- Watch for ESPN API changes

### Updates
1. Make changes to your code
2. Commit and push to GitHub
3. Smithery.ai will automatically redeploy
4. Test the updated functionality

### Performance
- ESPN API has rate limits
- Consider caching for frequently requested data
- Monitor response times

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript compilation errors
   - Verify all dependencies are installed
   - Ensure Node.js version compatibility

2. **Runtime Errors**
   - Check ESPN API endpoint availability
   - Verify network connectivity
   - Review error logs in Smithery.ai dashboard

3. **Tool Not Working**
   - Verify tool parameters match the schema
   - Check ESPN API response format
   - Test with different sport/league combinations

### Getting Help

1. **Smithery.ai Support**: Use their support channels
2. **GitHub Issues**: Create issues in your repository
3. **Community**: Check MCP Discord or forums

## Advanced Configuration

### Custom Domains
Smithery.ai may support custom domains for your MCP server.

### Scaling
For high-traffic usage:
- Consider implementing caching
- Monitor ESPN API rate limits
- Use multiple server instances if needed

### Security
- The server uses ESPN's public API (no authentication required)
- Consider implementing request validation
- Monitor for abuse or excessive usage

## Next Steps

After successful deployment:

1. **Share your server** with the community
2. **Document usage examples** in your README
3. **Monitor performance** and usage
4. **Plan for updates** and new features
5. **Consider monetization** if applicable

## Support

For issues specific to this Sports MCP Server:
- Create an issue in the GitHub repository
- Check the ESPN API documentation
- Review the MCP SDK documentation

For Smithery.ai platform issues:
- Contact Smithery.ai support
- Check their documentation
- Join their community forums
