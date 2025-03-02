const { console } = iina;
const http = iina.http;
const config = require("./config.js");

/**
 * Makes an HTTP request with retry logic
 * @param {string} url - The URL to send the request to
 * @param {Object} options - Request options
 * @param {number} retries - Number of retries left
 * @returns {Promise<Object>} - The response
 */
async function makeRequestWithRetry(url, options, retries = config.MAX_RETRIES) {
  try {
    return await http.post(url, options);
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    console.log(`Request failed, retrying... (${retries} attempts left)`);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, config.RETRY_DELAY));
    
    // Retry with one less retry attempt
    return makeRequestWithRetry(url, options, retries - 1);
  }
}

module.exports = {
  makeRequestWithRetry
}; 