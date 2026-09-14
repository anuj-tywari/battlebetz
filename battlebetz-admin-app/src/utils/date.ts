/**
 * Format a date string using the browser's Intl.DateTimeFormat
 * 
 * @param dateString - Date string to format
 * @param options - Intl.DateTimeFormatOptions to customize the format
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | null | undefined, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date and time string
 * 
 * @param dateString - Date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Not set';
  
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a relative time from now (e.g. "2 days ago")
 * 
 * @param dateString - Date string to format
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Get absolute difference in milliseconds
    const absDiffMs = Math.abs(diffMs);
    
    // Time units in milliseconds
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    
    // Format based on time difference
    if (absDiffMs < minute) {
      return 'just now';
    } else if (absDiffMs < hour) {
      const minutes = Math.floor(absDiffMs / minute);
      return diffMs > 0 
        ? `${minutes} minute${minutes !== 1 ? 's' : ''} ago` 
        : `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (absDiffMs < day) {
      const hours = Math.floor(absDiffMs / hour);
      return diffMs > 0 
        ? `${hours} hour${hours !== 1 ? 's' : ''} ago` 
        : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (absDiffMs < week) {
      const days = Math.floor(absDiffMs / day);
      return diffMs > 0 
        ? `${days} day${days !== 1 ? 's' : ''} ago` 
        : `in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (absDiffMs < month) {
      const weeks = Math.floor(absDiffMs / week);
      return diffMs > 0 
        ? `${weeks} week${weeks !== 1 ? 's' : ''} ago` 
        : `in ${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (absDiffMs < year) {
      const months = Math.floor(absDiffMs / month);
      return diffMs > 0 
        ? `${months} month${months !== 1 ? 's' : ''} ago` 
        : `in ${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(absDiffMs / year);
      return diffMs > 0 
        ? `${years} year${years !== 1 ? 's' : ''} ago` 
        : `in ${years} year${years !== 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
} 