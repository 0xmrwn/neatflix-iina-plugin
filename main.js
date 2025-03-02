const { console, core, event } = iina;
const config = require("./config.js");
const utils = require("./utils.js");

let mediaId = null;     // Unique identifier for the current media
let reportingEnabled = true;
let playerID = `player-${Date.now()}-${Math.floor(Math.random() * 10000)}`;  // Generate a unique player ID

console.log("Main entry initialized for player:", core.status.url);

// Function to extract media ID from URL parameters
function extractMediaIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('mediaId') || url;
  } catch (e) {
    // If not a valid URL, just return the string
    return url;
  }
}

// Listen for file load events
event.on("iina.file-loaded", (url) => {
  core.osd(`Playing: ${url}`);
  
  // Extract or generate a media ID from the URL
  mediaId = extractMediaIdFromUrl(url);
  
  // Notify Tauri that player is ready
  notifyPlayerReady(mediaId);
  
  // Start reporting progress to Tauri
  startProgressReporting();
});

// Listen for pause/resume events
event.on("mpv.pause.changed", () => {
  const isPaused = core.status.paused;
  
  // Report player status change to Tauri
  reportPlayerStatus(isPaused ? "paused" : "playing");
});

// Listen for window close events
event.on("iina.window-will-close", () => {
  // Stop reporting when window is about to close
  reportingEnabled = false;
  
  // Final progress report
  reportProgress();
  
  // Report player status change to Tauri
  reportPlayerStatus("closed");
});

// Notify Tauri that a player is ready
async function notifyPlayerReady(mediaId) {
  try {
    const options = {
      body: JSON.stringify({
        mediaId: mediaId,
        playerID: playerID,
        timestamp: new Date().getTime()
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    
    await utils.makeRequestWithRetry(
      `${config.SERVER_URL}${config.ENDPOINTS.PLAYER_READY}`, 
      options
    );
    
    console.log("Player ready notification sent for media ID:", mediaId);
  } catch (error) {
    console.log("Failed to notify player ready:", error);
  }
}

// Start periodic progress reporting
function startProgressReporting() {
  reportingEnabled = true;
  
  // Initial report
  reportProgress();
  
  // Set up periodic reporting
  const intervalId = setInterval(() => {
    if (!reportingEnabled) {
      clearInterval(intervalId);
      return;
    }
    
    reportProgress();
  }, config.PROGRESS_UPDATE_INTERVAL);
}

// Send progress update to Tauri via HTTP
async function reportProgress() {
  if (!mediaId || !reportingEnabled) return;
  
  const progressData = {
    mediaId: mediaId,
    playerID: playerID,
    position: core.status.position,
    duration: core.status.duration,
    url: core.status.url,
    title: core.status.title
  };
  
  try {
    const options = {
      body: JSON.stringify(progressData),
      headers: {
        "Content-Type": "application/json"
      }
    };
    
    await utils.makeRequestWithRetry(
      `${config.SERVER_URL}${config.ENDPOINTS.PROGRESS}`, 
      options
    );
  } catch (error) {
    console.log("Failed to report progress:", error);
  }
}

// Report player status changes to Tauri
async function reportPlayerStatus(status) {
  if (!mediaId) return;
  
  const statusData = {
    mediaId: mediaId,
    playerID: playerID,
    status: status,
    position: core.status.position,
    timestamp: new Date().getTime()
  };
  
  try {
    const options = {
      body: JSON.stringify(statusData),
      headers: {
        "Content-Type": "application/json"
      }
    };
    
    await utils.makeRequestWithRetry(
      `${config.SERVER_URL}${config.ENDPOINTS.STATUS}`, 
      options
    );
  } catch (error) {
    console.log("Failed to report status:", error);
  }
} 