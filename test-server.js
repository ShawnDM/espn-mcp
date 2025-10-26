#!/usr/bin/env node

import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

// Test script to verify MCP server functionality
async function testMCPServer() {
  console.log('🧪 Testing Sports MCP Server...\n');

  // Test 1: List available tools
  console.log('1. Testing tool listing...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };

  await testRequest(listToolsRequest);

  // Test 2: Get available sports
  console.log('\n2. Testing get_available_sports...');
  const availableSportsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_available_sports',
      arguments: {}
    }
  };

  await testRequest(availableSportsRequest);

  // Test 3: Get NFL scores
  console.log('\n3. Testing get_sports_scores (NFL)...');
  const nflScoresRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_sports_scores',
      arguments: {
        sport: 'football',
        league: 'nfl'
      }
    }
  };

  await testRequest(nflScoresRequest);

  console.log('\n✅ All tests completed!');
}

async function testRequest(request: any) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    server.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Request successful');
        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          if (lastLine) {
            const response = JSON.parse(lastLine);
            console.log('📊 Response:', JSON.stringify(response, null, 2).substring(0, 200) + '...');
          }
        } catch (e) {
          console.log('📊 Raw output:', output.substring(0, 200) + '...');
        }
        resolve(output);
      } else {
        console.log('❌ Request failed:', errorOutput);
        reject(new Error(`Server exited with code ${code}`));
      }
    });

    // Send the request
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();

    // Timeout after 10 seconds
    setTimeout(() => {
      server.kill();
      reject(new Error('Request timeout'));
    }, 10000);
  });
}

// Run tests
testMCPServer().catch(console.error);
