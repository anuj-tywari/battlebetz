import { format, formatDistance, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date to a human-readable format
 */
export function formatDate(dateString: string | null | undefined, options?: { includeTime?: boolean }): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    return format(date, options?.includeTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a time to a human-readable format
 */
export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
}

/**
 * Format a date and time to a human-readable format
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Invalid date/time';
  }
}

/**
 * Format a currency amount
 */
export function formatCurrency(amount: any, withDecimals = false): string {
  // Handle null, undefined, or invalid inputs
  if (amount === null || amount === undefined) return '$0';
  
  // Try to convert to number if it's not already
  let numericAmount: number;
  try {
    numericAmount = typeof amount === 'number' ? amount : Number(amount);
    
    // Check if the conversion resulted in a valid number
    if (isNaN(numericAmount)) {
      console.warn('Invalid amount passed to formatCurrency:', amount);
      return '$0';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: withDecimals ? 2 : 0,
      maximumFractionDigits: withDecimals ? 2 : 0
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0';
  }
}

/**
 * Format a relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}

/**
 * Format a countdown to a future time
 */
export function formatCountdown(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const targetDate = parseISO(dateString);
    const now = new Date();
    
    if (targetDate <= now) {
      return 'Now';
    }
    
    return formatDistance(now, targetDate, { addSuffix: false });
  } catch (error) {
    console.error('Error formatting countdown:', error);
    return 'Unknown';
  }
}

/**
 * Map a sport category to its icon name
 */
export function mapSportCategoryToIcon(category: string | null | undefined): string {
  if (!category) return 'globe';
  
  switch (category.toUpperCase()) {
    case 'FOOTBALL':
      return 'football';
    case 'BASKETBALL':
      return 'basketball';
    case 'BASEBALL':
      return 'baseball';
    case 'HOCKEY':
      return 'hockey';
    case 'SOCCER':
      return 'soccer';
    case 'ESPORTS':
      return 'gamepad';
    default:
      return 'globe';
  }
}

/**
 * Format a large number with abbreviations (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
} 