/**
 * Utility functions for handling localStorage.
 */

/**
 * Save data to localStorage.
 * @param {string} key - The key under which the data will be stored.
 * @param {Object} value - The value to be stored. It will be stringified.
 */
export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error saving data to localStorage with key "${key}":`, error);
    }
};

/**
 * Load data from localStorage.
 * @param {string} key - The key of the data to retrieve.
 * @returns {Object|null} - The parsed value from localStorage or null if not found or parsing fails.
 */
export const loadFromLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return null; // No data found
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error(`Error loading data from localStorage with key "${key}":`, error);
        return null;
    }
};

/**
 * Remove data from localStorage.
 * @param {string} key - The key of the data to remove.
 */
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing data from localStorage with key "${key}":`, error);
    }
};

/**
 * Clear all data from localStorage.
 */
export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error("Error clearing localStorage:", error);
    }
};
