// Clawdbot Agent with WebSocket Connection for Render Deploy - VERSION 2.0
console.log('🤖 Clawdbot Agent V2.0 starting on Render...');

// Debug environment variables
console.log('🔧 Environment Variables:');
console.log(`   GATEWAY_URL: ${process.env.GATEWAY_URL || 'NOT SET'}`);
console.log(`   CLAWDBOT_TOKEN: ${process.env.CLAWDBOT_TOKEN ? '***HIDDEN***' : 'NOT SET'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
console.log('');

// Import WebSocket (if available, otherwise create simple connection)
let WebSocket;
try {
  WebSocket = require('ws');
} catch (error) {
  console.log('ℹ️  WebSocket package not available, using browser WebSocket API');
  // For browser environment, WebSocket is global
}

// Basic agent setup with WebSocket connection
class ClawdbotAgent {
  constructor(config = {}) {
    this.gatewayUrl = config?.gatewayUrl || process.env.GATEWAY_URL || 'ws://your-gateway-url:port';
    this.token = config?.token || process.env.CLAWDBOT_TOKEN || 'your-auth-token-here';
    this.env = config?.env || process.env.NODE_ENV || 'production';
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async start() {
    try {
      console.log('✅ Agent Configuration:');
      console.log(`   Gateway URL: ${this.gatewayUrl}`);
      console.log(`   Token: ${this.token ? '***HIDDEN***' : 'NOT SET'}`);
      console.log(`   Environment: ${this.env}`);
      
      // Validate configuration
      if (!this.gatewayUrl || this.gatewayUrl === 'ws://your-gateway-url:port') {
        throw new Error('Please configure your GATEWAY_URL environment variable');
      }
      
      if (!this.token || this.token === 'your-auth-token-here') {
        throw new Error('Please configure your CLAWDBOT_TOKEN environment variable');
      }
      
      // Connect to gateway
      await this.connectToGateway();
      
      // Keep the process running with heartbeat
      setInterval(() => {
        const timestamp = new Date().toISOString();
        console.log('🟢 Agent heartbeat:', timestamp);
        console.log(`   Status: Running for ${Math.floor(process.uptime())} seconds`);
        console.log(`   Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
        console.log(`   Gateway Connected: ${this.connected}`);
        console.log(`   Reconnect Attempts: ${this.reconnectAttempts}`);
      }, 30000); // Log every 30 seconds
      
      return true;
      
    } catch (error) {
      console.error('❌ Agent start error:', error.message);
      throw error;
    }
  }

  async connectToGateway() {
    try {
      console.log('🔗 Connecting to gateway...');
      console.log(`   URL: ${this.gatewayUrl}`);
      
      // Create WebSocket connection
      if (typeof WebSocket !== 'undefined') {
        this.ws = new WebSocket(this.gatewayUrl);
        
        // WebSocket event handlers
        this.ws.onopen = () => {
          console.log('✅ Connected to gateway successfully!');
          this.connected = true;
          this.reconnectAttempts = 0;
          
          // Send authentication message
          this.sendMessage({
            type: 'auth',
            token: this.token,
            timestamp: new Date().toISOString()
          });
        };
        
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 Received from gateway:', data.type || data);
            
            // Handle different message types
            if (data.type === 'welcome') {
              console.log('🎉 Gateway welcome received!');
            } else if (data.type === 'pong') {
              console.log('💗 Gateway pong received');
            }
            
          } catch (error) {
            console.log('📨 Received raw message:', event.data);
          }
        };
        
        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error.message || 'Unknown error');
          this.connected = false;
        };
        
        this.ws.onclose = (event) => {
          console.log('🔌 Disconnected from gateway:', event.code, event.reason);
          this.connected = false;
          
          // Auto-reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
              this.connectToGateway();
            }, 5000 * this.reconnectAttempts); // Exponential backoff
          }
        };
        
      } else {
        console.log('ℹ️  WebSocket not available, running in heartbeat-only mode');
        this.connected = false;
      }
      
    } catch (error) {
      console.error('❌ Connection error:', error.message);
      this.connected = false;
      throw error;
    }
  }

  sendMessage(data) {
    if (this.ws && this.connected) {
      try {
        this.ws.send(JSON.stringify(data));
        console.log('📤 Sent to gateway:', data.type);
      } catch (error) {
        console.error('❌ Send message error:', error.message);
      }
    } else {
      console.log('⚠️  Cannot send message - not connected to gateway');
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
  if (agent.ws) {
    agent.ws.close();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  if (agent.ws) {
    agent.ws.close();
  }
  process.exit(0);
});