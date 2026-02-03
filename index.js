// Simple Clawdbot Agent for Railway Deploy
console.log('🤖 Clawdbot Agent starting on Render...');

// Debug environment variables
console.log('🔧 Environment Variables:');
console.log(`   GATEWAY_URL: ${process.env.GATEWAY_URL || 'NOT SET'}`);
console.log(`   CLAWDBOT_TOKEN: ${process.env.CLAWDBOT_TOKEN || 'NOT SET'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
console.log('');

// Basic agent setup
class ClawdbotAgent {
  constructor(config = {}) {
    this.gatewayUrl = config?.gatewayUrl || process.env.GATEWAY_URL || 'ws://127.0.0.1:18789';
    this.token = config?.token || process.env.CLAWDBOT_TOKEN || 'DESKTOP-0JJ8EBR';
    this.env = config?.env || process.env.NODE_ENV || 'production';
  }

  async start() {
    try {
      console.log('✅ Agent Configuration:');
      console.log(`   Gateway URL: ${this.gatewayUrl}`);
      console.log(`   Token: ${this.token ? '***' : 'NOT SET'}`);
      console.log(`   Environment: ${this.env}`);
      
      // Validate configuration
      if (!this.gatewayUrl) {
        throw new Error('Gateway URL is required');
      }
      
      if (!this.token) {
        throw new Error('Token is required');
      }
      
      // Simulate agent running
      console.log('🚀 Agent started successfully!');
      console.log('🌐 This agent is running 24/7 on Render cloud');
      
      // Keep the process running with heartbeat
      setInterval(() => {
        const timestamp = new Date().toISOString();
        console.log('🟢 Agent heartbeat:', timestamp);
        console.log(`   Status: Running for ${Math.floor(process.uptime())} seconds`);
        console.log(`   Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      }, 30000); // Log every 30 seconds
      
      return true;
      
    } catch (error) {
      console.error('❌ Agent start error:', error.message);
      throw error;
    }
  }
}

// Start the agent
try {
  console.log('🚀 Initializing Clawdbot Agent...');
  const agent = new ClawdbotAgent();
  
  agent.start().then(() => {
    console.log('✅ Clawdbot Agent deployed and running on Render!');
  }).catch(err => {
    console.error('❌ Failed to start agent:', err);
    process.exit(1);
  });
} catch (initError) {
  console.error('❌ Failed to initialize agent:', initError);
  process.exit(1);
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});