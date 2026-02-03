// Rate limiting using localStorage
const RATE_LIMIT_KEY = 'stuckmann_solar_submissions';
const MAX_SUBMISSIONS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

interface SubmissionRecord {
  timestamp: number;
  count: number;
}

export function checkRateLimit(): { allowed: boolean; remainingAttempts: number; waitTime?: number } {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!stored) {
      return { allowed: true, remainingAttempts: MAX_SUBMISSIONS_PER_HOUR };
    }
    
    const record: SubmissionRecord = JSON.parse(stored);
    
    // Check if the window has expired
    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
      // Reset the counter
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { allowed: true, remainingAttempts: MAX_SUBMISSIONS_PER_HOUR };
    }
    
    // Check if limit exceeded
    if (record.count >= MAX_SUBMISSIONS_PER_HOUR) {
      const waitTime = RATE_LIMIT_WINDOW - (now - record.timestamp);
      return { 
        allowed: false, 
        remainingAttempts: 0,
        waitTime: Math.ceil(waitTime / 60000) // minutes
      };
    }
    
    return { 
      allowed: true, 
      remainingAttempts: MAX_SUBMISSIONS_PER_HOUR - record.count 
    };
  } catch {
    // If localStorage is not available, allow the request
    return { allowed: true, remainingAttempts: MAX_SUBMISSIONS_PER_HOUR };
  }
}

export function recordSubmission(): void {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    
    if (!stored) {
      const record: SubmissionRecord = { timestamp: now, count: 1 };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
      return;
    }
    
    const record: SubmissionRecord = JSON.parse(stored);
    
    // Check if the window has expired
    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
      const newRecord: SubmissionRecord = { timestamp: now, count: 1 };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newRecord));
      return;
    }
    
    // Increment the counter
    record.count += 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Generate a simple fingerprint for additional tracking
export function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return 'no-canvas';
  }
  
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Stuckmann Solar', 2, 2);
  
  const data = canvas.toDataURL();
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Combine with other browser info
  const info = [
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    hash.toString(36),
  ].join('-');
  
  return btoa(info).slice(0, 32);
}

// Check if the submission looks like a bot
export function detectBot(): { isBot: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  // Check for headless browser indicators
  if (navigator.webdriver) {
    reasons.push('webdriver');
  }
  
  // Check for missing plugins (common in headless browsers)
  if (navigator.plugins.length === 0) {
    reasons.push('no-plugins');
  }
  
  // Check for missing languages
  if (!navigator.languages || navigator.languages.length === 0) {
    reasons.push('no-languages');
  }
  
  // Check screen dimensions
  if (screen.width === 0 || screen.height === 0) {
    reasons.push('no-screen');
  }
  
  // Check for touch support inconsistency
  const hasTouch = 'ontouchstart' in window;
  const hasMaxTouch = navigator.maxTouchPoints > 0;
  if (hasTouch !== hasMaxTouch) {
    reasons.push('touch-mismatch');
  }
  
  return {
    isBot: reasons.length >= 2,
    reasons,
  };
}

// Time-based validation (form should take at least a few seconds to fill)
const FORM_START_KEY = 'stuckmann_form_start';
const MIN_FORM_TIME = 5000; // 5 seconds minimum

export function markFormStart(): void {
  try {
    sessionStorage.setItem(FORM_START_KEY, Date.now().toString());
  } catch {
    // Ignore if sessionStorage is not available
  }
}

export function checkFormTime(): { valid: boolean; timeTaken: number } {
  try {
    const startTime = sessionStorage.getItem(FORM_START_KEY);
    
    if (!startTime) {
      return { valid: true, timeTaken: 0 };
    }
    
    const timeTaken = Date.now() - parseInt(startTime, 10);
    
    return {
      valid: timeTaken >= MIN_FORM_TIME,
      timeTaken,
    };
  } catch {
    return { valid: true, timeTaken: 0 };
  }
}

// CSRF-like token generation (for additional security)
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate referrer (optional, for iframe embedding)
export function validateReferrer(allowedDomains: string[]): boolean {
  try {
    const referrer = document.referrer;
    
    if (!referrer) {
      // Allow direct access
      return true;
    }
    
    const referrerUrl = new URL(referrer);
    return allowedDomains.some(domain => 
      referrerUrl.hostname === domain || 
      referrerUrl.hostname.endsWith('.' + domain)
    );
  } catch {
    return true;
  }
}
