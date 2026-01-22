/**
 * Currency formatter utilities for Indonesian Rupiah
 */

/**
 * Format number to Indonesian Rupiah currency string
 * @param {number|string} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show Rp symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatToRupiah = (amount, showSymbol = true) => {
    if (!amount && amount !== 0) return showSymbol ? 'Rp 0' : '0';

    const number = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(number)) return showSymbol ? 'Rp 0' : '0';

    const formatted = number.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return showSymbol ? `Rp ${formatted}` : formatted;
};

/**
 * Parse Rupiah string to number
 * @param {string} rupiahString - Rupiah formatted string
 * @returns {number} Parsed number
 */
export const parseRupiahToNumber = rupiahString => {
    if (!rupiahString) return 0;

    // Remove Rp, spaces, and dots (thousands separator)
    const cleanString = rupiahString.toString().replace(/Rp\s?/g, '').replace(/\./g, '').replace(/,/g, '.');

    const number = parseFloat(cleanString);
    return isNaN(number) ? 0 : number;
};

/**
 * Format input value while typing (for v-model)
 * @param {string} value - Input value
 * @returns {string} Formatted value
 */
export const formatRupiahInput = value => {
    if (!value) return '';

    // Remove all non-numeric characters except decimal point
    const numericValue = value.toString().replace(/[^\d,]/g, '');

    // Parse to number and format
    const number = parseFloat(numericValue.replace(',', '.'));
    if (isNaN(number)) return '';

    return number.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

/**
 * Validate if the input is a valid currency amount
 * @param {string|number} value - Value to validate
 * @returns {boolean} True if valid
 */
export const isValidCurrencyAmount = value => {
    if (!value && value !== 0) return false;

    const number = typeof value === 'string' ? parseRupiahToNumber(value) : value;
    return !isNaN(number) && number > 0;
};
