export function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is valid' };
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateBetAmount(amount: number, minAmount: number, maxAmount: number): boolean {
  return amount >= minAmount && amount <= maxAmount;
}

export function validateRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  return value !== null && value !== undefined;
}

export function validateNumber(value: any): boolean {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  
  if (typeof value === 'string') {
    return !isNaN(Number(value));
  }
  
  return false;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export function validateImage(file: File): { isValid: boolean; message: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.'
    };
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      message: 'File size exceeds 5MB. Please upload a smaller image.'
    };
  }
  
  return { isValid: true, message: 'Image is valid' };
} 