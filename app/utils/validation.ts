/**
 * Utility functions for form validation
 */

// Email validation with regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength levels
export enum PasswordStrength {
  VeryWeak = 0,
  Weak = 1,
  Fair = 2,
  Good = 3,
  Strong = 4,
  VeryStrong = 5
}

// Password strength evaluation
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.VeryWeak;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 5) as PasswordStrength;
};

// Get text representation of password strength
export const getPasswordStrengthText = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.VeryWeak:
      return 'Very Weak';
    case PasswordStrength.Weak:
      return 'Weak';
    case PasswordStrength.Fair:
      return 'Fair';
    case PasswordStrength.Good:
      return 'Good';
    case PasswordStrength.Strong:
      return 'Strong';
    case PasswordStrength.VeryStrong:
      return 'Very Strong';
  }
};

// Get color class for password strength
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.VeryWeak:
    case PasswordStrength.Weak:
      return 'bg-red-500';
    case PasswordStrength.Fair:
    case PasswordStrength.Good:
      return 'bg-amber';
    case PasswordStrength.Strong:
    case PasswordStrength.VeryStrong:
      return 'bg-green-500';
  }
};

// Get text color class for password strength
export const getPasswordStrengthTextColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.VeryWeak:
    case PasswordStrength.Weak:
      return 'text-red-500';
    case PasswordStrength.Fair:
    case PasswordStrength.Good:
      return 'text-amber-400';
    case PasswordStrength.Strong:
    case PasswordStrength.VeryStrong:
      return 'text-green-500';
  }
};

// Validate name (at least 2 characters, no numbers or special chars)
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[A-Za-z\s\-']+$/.test(name);
};
