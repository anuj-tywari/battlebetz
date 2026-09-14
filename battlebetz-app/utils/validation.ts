/**
 * Validates username for forbidden characters and length
 * @param username - The username to validate
 * @returns An object with validation result and error message
 */
export const validateUsername = (username: string): { isValid: boolean; error: string } => {
    // Check for minimum and maximum length
    if (!username || username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 20) {
      return { isValid: false, error: 'Username cannot exceed 20 characters' };
    }

    // Check for spaces
    if (/\s/.test(username)) {
        return { isValid: false, error: 'Username cannot contain spaces' };
      }
  
    // Check for forbidden characters using regex
    // Allow letters, numbers, underscores, hyphens, and periods
    const forbiddenCharsRegex = /[^a-zA-Z0-9_\-\.]/;
    
    if (forbiddenCharsRegex.test(username)) {
      return { 
        isValid: false, 
        error: 'Username can only contain letters, numbers, underscores, hyphens, and periods' 
      };
    }
  
    // Check if username starts with a letter or number (not special characters)
    if (!/^[a-zA-Z0-9]/.test(username)) {
      return { 
        isValid: false, 
        error: 'Username must start with a letter or number' 
      };
    }
  
    return { isValid: true, error: '' };
  };
  
  /**
   * Validates password complexity and forbidden characters
   * @param password - The password to validate
   * @returns An object with validation result and error message
   */
  export const validatePassword = (password: string): { isValid: boolean; error: string } => {
    // Check for minimum length
    if (!password || password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    
    // Check for maximum length (optional, but recommended)
    if (password.length > 128) {
      return { isValid: false, error: 'Password is too long' };
    }
  
    // Check for spaces
    if (/\s/.test(password)) {
      return { isValid: false, error: 'Password cannot contain spaces' };
    }
  
    // Check for common password security requirements (optional)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!(hasUppercase && hasLowercase && hasNumber)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      };
    }
  
    // Recommend but don't require special characters
    if (!hasSpecialChar) {
      // This is just a recommendation, not a requirement
      // We return isValid: true but with a warning message
      return { 
        isValid: true, 
        error: 'For better security, consider adding special characters to your password' 
      };
    }
  
    return { isValid: true, error: '' };
  };
  
  /**
   * Integrated validation function for form data
   * @param formData - The form data containing username, password, and other fields
   * @returns An object with validation result and error message
   */
  export const validateSignUpForm = (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): { isValid: boolean; error: string } => {
    // Check for empty fields
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return { isValid: false, error: 'Please fill in all required fields' };
    }
  
    // Validate username
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      return usernameValidation;
    }
  
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  
    return { isValid: true, error: passwordValidation.error || '' };
  };