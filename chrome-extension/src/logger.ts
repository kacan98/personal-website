// Centralized logging utility for the CV Tailor extension
import { DEFAULT_DEBUG_LOGGING } from "./constants";

class CVTailorLogger {
  private debugEnabled = DEFAULT_DEBUG_LOGGING;
  private readonly prefix = "[CV Tailor]";

  async init() {
    // Load debug setting from storage
    try {
      const result = await chrome.storage.sync.get({ debugLogging: DEFAULT_DEBUG_LOGGING });
      this.debugEnabled = result.debugLogging;
    } catch (error) {
      // Fallback for content scripts that can't access chrome.storage directly
      this.debugEnabled = DEFAULT_DEBUG_LOGGING;
    }
  }

  log(...args: any[]) {
    if (this.debugEnabled) {
      console.log(this.prefix, ...args);
    }
  }

  error(...args: any[]) {
    if (this.debugEnabled) {
      console.error(this.prefix, ...args);
    }
  }

  warn(...args: any[]) {
    if (this.debugEnabled) {
      console.warn(this.prefix, ...args);
    }
  }

  // For content scripts, we need to check storage synchronously
  setDebugMode(enabled: boolean) {
    this.debugEnabled = enabled;
  }

  isDebugEnabled() {
    return this.debugEnabled;
  }
}

export const logger = new CVTailorLogger();