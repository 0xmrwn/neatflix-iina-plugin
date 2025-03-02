module.exports = {
  // Base URL for the Tauri HTTP server
  SERVER_URL: "http://127.0.0.1:8080",
  
  // Endpoints
  ENDPOINTS: {
    PROGRESS: "/progress",          // For reporting playback progress
    STATUS: "/status",              // For reporting player status changes
    PLAYER_READY: "/player-ready",  // To notify when a player is initialized
  },
  
  // Update intervals (in milliseconds)
  PROGRESS_UPDATE_INTERVAL: 60000,   // How often to report playback position
  
  // Retry configuration
  MAX_RETRIES: 3,                   // Maximum number of retry attempts
  RETRY_DELAY: 1000,                // Delay between retries (ms)
}; 