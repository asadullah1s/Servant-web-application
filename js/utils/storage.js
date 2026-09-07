// ============================================
// UTILS: STORAGE
// LocalStorage / SessionStorage کے لیے
// ============================================

/**
 * LocalStorage میں ڈیٹا سیو کریں (JSON کو Stringify کر کے)
 */
function setLocalItem(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * LocalStorage سے ڈیٹا گیٹ کریں (Parse کر کے)
 */
function getLocalItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * LocalStorage سے کوئی آئٹم ڈیلیٹ کریں
 */
function removeLocalItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/**
 * LocalStorage مکمل صاف کریں
 */
function clearLocalStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

// ---------- SessionStorage (عارضی ڈیٹا) ----------

/**
 * SessionStorage میں ڈیٹا سیو کریں
 */
function setSessionItem(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        sessionStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
    }
}

/**
 * SessionStorage سے ڈیٹا گیٹ کریں
 */
function getSessionItem(key, defaultValue = null) {
    try {
        const item = sessionStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
    }
}

/**
 * SessionStorage سے کوئی آئٹم ڈیلیٹ کریں
 */
function removeSessionItem(key) {
    try {
        sessionStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from sessionStorage:', error);
        return false;
    }
}

/**
 * SessionStorage مکمل صاف کریں
 */
function clearSessionStorage() {
    try {
        sessionStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
        return false;
    }
}

// ---------- یوزر سیٹنگز اور سیشن ----------

/**
 * صارف کی زبان محفوظ کریں
 */
function saveUserLanguage(lang) {
    return setLocalItem('user_language', lang);
}

/**
 * محفوظ کردہ زبان حاصل کریں
 */
function getUserLanguage(defaultLang = 'en') {
    return getLocalItem('user_language', defaultLang);
}

/**
 * صارف کا سیشن (لاگ ان ڈیٹا) محفوظ کریں
 */
function saveUserSession(userData) {
    return setSessionItem('current_user', userData);
}

/**
 * صارف کا سیشن حاصل کریں
 */
function getUserSession() {
    return getSessionItem('current_user', null);
}

/**
 * صارف کا سیشن ختم کریں (لاگ آؤٹ)
 */
function clearUserSession() {
    return removeSessionItem('current_user');
}

/**
 * کیا صارف لاگ ان ہے؟
 */
function isUserLoggedIn() {
    const user = getUserSession();
    return user !== null && user.id !== undefined;
}

/**
 * صارف کا ٹوکن محفوظ کریں (مستقبل میں Firebase کے لیے)
 */
function saveAuthToken(token) {
    return setLocalItem('auth_token', token);
}

/**
 * محفوظ کردہ ٹوکن حاصل کریں
 */
function getAuthToken() {
    return getLocalItem('auth_token', null);
}

/**
 * ٹوکن ڈیلیٹ کریں (لاگ آؤٹ)
 */
function clearAuthToken() {
    return removeLocalItem('auth_token');
}

// export {
//     setLocalItem, getLocalItem, removeLocalItem, clearLocalStorage,
//     setSessionItem, getSessionItem, removeSessionItem, clearSessionStorage,
//     saveUserLanguage, getUserLanguage,
//     saveUserSession, getUserSession, clearUserSession, isUserLoggedIn,
//     saveAuthToken, getAuthToken, clearAuthToken
// };
