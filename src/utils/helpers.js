import { CHARACTER_CONFIG } from '../constants/config';

/**
 * Format price to Vietnamese Dong
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  try {
    return new Intl.NumberFormat(CHARACTER_CONFIG.LOCALE, {
      style: 'currency',
      currency: CHARACTER_CONFIG.CURRENCY
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return '0 ₫';
  }
};

/**
 * Remove accents and spaces from Vietnamese text
 * @param {string} str - The string to process
 * @returns {string} Processed string without accents and spaces
 */
export const removeAccentsAndSpaces = (str) => {
  if (!str) return '';
  
  // Remove accents
  const withoutAccents = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Remove spaces
  const withoutSpaces = withoutAccents.replace(/\s/g, "");
  
  return withoutSpaces;
};

/**
 * Format date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(CHARACTER_CONFIG.LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with authorization
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Handle API errors consistently
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 */
export const handleApiError = (error, context = 'API call') => {
  console.error(`Error in ${context}:`, error);
  
  // You can add more sophisticated error handling here
  // such as showing toast notifications, logging to external service, etc.
  
  return {
    message: error.message || 'An unexpected error occurred',
    context
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};
