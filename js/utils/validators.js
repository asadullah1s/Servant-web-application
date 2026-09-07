// ============================================
// UTILS: VALIDATORS
// تمام فارم اور ڈیٹا ویلڈیشن کے لیے
// ============================================

/**
 * ای میل کی درستگی چیک کریں
 */
function isValidEmail(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * پاکستانی فون نمبر کی درستگی
 * فارمیٹ: 03XX-XXXXXXX یا +92-3XX-XXXXXXX یا 03XXXXXXXXX
 */
function isValidPhone(phone) {
    if (!phone) return false;
    // پاکستانی موبائل نمبر کے لیے ریجیکس
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+92|0)?3[0-9]{9}$/.test(cleaned);
}

/**
 * CNIC (شناختی کارڈ) کی درستگی
 * فارمیٹ: 12345-1234567-1 یا 1234512345671 (13 digits)
 */
function isValidCNIC(cnic) {
    if (!cnic) return false;
    const cleaned = cnic.replace(/[\s\-]/g, '');
    return /^[0-9]{13}$/.test(cleaned);
}

/**
 * پاسورڈ کی مضبوطی چیک کریں
 * کم از کم 8 حروف، ایک بڑا حرف، ایک چھوٹا حرف، ایک عدد
 */
function isStrongPassword(password) {
    if (!password || password.length < 8) return false;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
}

/**
 * دو پاسورڈز ایک جیسے ہیں؟
 */
function doPasswordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}

/**
 * فائل کی قسم چیک کریں (تصویر/PDF)
 */
function isValidFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']) {
    if (!file) return false;
    return allowedTypes.includes(file.type);
}

/**
 * فائل کا سائز چیک کریں (MB میں)
 */
function isFileSizeValid(file, maxSizeMB = 5) {
    if (!file) return false;
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
}

/**
 * خالی فیلڈز چیک کریں (سٹرنگ یا آرے کے لیے)
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * تاریخ کی درستگی (YYYY-MM-DD)
 */
function isValidDate(dateStr) {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

/**
 * عمر چیک کریں (کم از کم 18 سال)
 */
function isAdult(dateOfBirth) {
    if (!isValidDate(dateOfBirth)) return false;
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

/**
 * صرف حروف اور اسپیس کی اجازت
 */
function isAlphaOnly(value) {
    if (!value) return false;
    return /^[a-zA-Z\u0600-\u06FF\s]+$/.test(value);
}

/**
 * صرف اعداد کی اجازت
 */
function isNumericOnly(value) {
    if (!value) return false;
    return /^[0-9]+$/.test(value);
}

// (اگر ماڈیول استعمال کریں تو)
// export {
//     isValidEmail,
//     isValidPhone,
//     isValidCNIC,
//     isStrongPassword,
//     doPasswordsMatch,
//     isValidFileType,
//     isFileSizeValid,
//     isEmpty,
//     isValidDate,
//     isAdult,
//     isAlphaOnly,
//     isNumericOnly
// };
