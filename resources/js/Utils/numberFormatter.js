/**
 * Number formatter utilities for better digit display
 */

/**
 * Format number with thousand separators (commas)
 * @param {number|string} value - The number to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale for formatting (default: 'id-ID')
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 0)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, options = {}) => {
    if (!value && value !== 0) return '0';

    const {
        locale = 'id-ID',
        minimumFractionDigits = 0,
        maximumFractionDigits = 0
    } = options;

    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return '0';

    return number.toLocaleString(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
    });
};

/**
 * Format number with thousand separators using comma separator specifically
 * @param {number|string} value - The number to format
 * @param {number} decimalPlaces - Number of decimal places (default: 0)
 * @returns {string} Formatted number string with commas
 */
export const formatNumberWithCommas = (value, decimalPlaces = 0) => {
    if (!value && value !== 0) return '0';

    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return '0';

    // Use US locale to ensure comma as thousand separator
    return number.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
};

/**
 * Parse formatted number string back to number
 * @param {string} formattedValue - Formatted number string
 * @returns {number} Parsed number
 */
export const parseFormattedNumber = (formattedValue) => {
    if (!formattedValue) return 0;

    // Remove commas and other non-numeric characters except decimal point
    const cleanString = formattedValue.toString().replace(/[^\d.-]/g, '');

    const number = parseFloat(cleanString);
    return isNaN(number) ? 0 : number;
};

/**
 * Format number for display in tables or UI components
 * Handles null/undefined values gracefully
 * @param {number|string|null|undefined} value - The value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted string ready for display
 */
export const displayNumber = (value, options = {}) => {
    if (value === null || value === undefined || value === '') {
        return options.fallback || '0';
    }

    return formatNumberWithCommas(value, options.decimalPlaces || 0);
};

/**
 * Validate if the input is a valid number
 * @param {string|number} value - Value to validate
 * @returns {boolean} True if valid number
 */
export const isValidNumber = (value) => {
    if (!value && value !== 0) return false;

    const number = typeof value === 'string' ? parseFormattedNumber(value) : value;
    return !isNaN(number) && isFinite(number);
};