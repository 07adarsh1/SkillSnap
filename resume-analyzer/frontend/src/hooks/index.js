import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for API calls with loading and error states
 * Provides consistent state management across all API interactions
 * 
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    };

    return { data, loading, error, execute, reset };
};

/**
 * Custom hook for form state management
 * Simplifies form handling with validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} - Form state and handlers
 */
export const useForm = (initialValues, onSubmit) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(values);
        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
    };

    return { values, errors, isSubmitting, handleChange, handleSubmit, reset, setValues };
};

/**
 * Custom hook for managing modal state
 * Provides open/close handlers and visibility state
 * 
 * @param {boolean} initialOpen - Initial open state
 * @returns {Object} - Modal state and handlers
 */
export const useModal = (initialOpen = false) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return { isOpen, open, close, toggle };
};

/**
 * Custom hook for managing active tabs
 * Useful for tabbed navigation
 * 
 * @param {string} initialTab - Initial active tab ID
 * @returns {Object} - Tab state and handlers
 */
export const useTabs = (initialTab) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    const selectTab = (tabId) => setActiveTab(tabId);

    return { activeTab, selectTab };
};

/**
 * Custom hook for copy to clipboard functionality
 * 
 * @param {number} resetTimeout - Time in ms to reset copied state
 * @returns {Object} - Copy state and handler
 */
export const useClipboard = (resetTimeout = 2000) => {
    const [copied, setCopied] = useState(false);

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), resetTimeout);
            return true;
        } catch (err) {
            console.error('Failed to copy text:', err);
            setCopied(false);
            return false;
        }
    };

    return { copied, copy };
};

/**
 * Custom hook for filtering and searching lists
 * 
 * @param {Array} items - List of items to filter
 * @param {string} filterKey - Key to filter by (optional for object arrays)
 * @returns {Object} - Filtered items and handlers
 */
export const useFilter = (items = [], filterKey = null) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');

    const filteredItems = items.filter(item => {
        const matchesSearch = searchTerm === '' || (
            filterKey 
                ? String(item[filterKey] || '').toLowerCase().includes(searchTerm.toLowerCase())
                : Object.values(item).some(val => 
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
        );

        const matchesCategory = category === 'all' || item.category === category;

        return matchesSearch && matchesCategory;
    });

    return {
        filteredItems,
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        totalCount: items.length,
        filteredCount: filteredItems.length
    };
};

/**
 * Custom hook for toast notifications
 * Manages temporary notification messages
 * 
 * @returns {Object} - Toast state and handlers
 */
export const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const countRef = useRef(0);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        countRef.current += 1;
        const id = `${Date.now()}-${countRef.current}`;
        const toast = { id, message, type };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info
    };
};

/**
 * Custom hook for local storage
 * Syncs state with localStorage
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value
 * @returns {Array} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    return [storedValue, setValue];
};

/**
 * Custom hook for debouncing values
 * Useful for search inputs and API calls
 * 
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
