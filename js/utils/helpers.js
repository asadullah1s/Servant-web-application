// ============================================
// UTILS: HELPERS
// عام مددگار فنکشنز
// ============================================

/**
 * موجودہ تاریخ کو فارمیٹ کریں (YYYY-MM-DD)
 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * تاریخ کو مقامی فارمیٹ میں تبدیل کریں
 * مثلاً: 15-Sep-2026 یا 15/09/2026
 */
function formatDate(dateStr, format = 'DD-MMM-YYYY') {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthShort = monthNames[date.getMonth()];

    switch (format) {
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'DD-MMM-YYYY':
            return `${day}-${monthShort}-${year}`;
        default:
            return `${day}-${monthShort}-${year}`;
    }
}

/**
 * موجودہ وقت حاصل کریں (HH:MM AM/PM)
 */
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * سٹرنگ کو پہلے حرف کیپیٹل کے ساتھ
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * سٹرنگ کو ٹریم اور متعدد سپیسز کو ایک سپیس میں بدلیں
 */
function cleanText(str) {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ');
}

/**
 * قیمت کو پاکستانی روپے میں فارمیٹ کریں
 * مثلاً: 25000 → PKR 25,000
 */
function formatPrice(amount, currency = 'PKR') {
    if (!amount && amount !== 0) return `${currency} 0`;
    const num = Number(amount);
    if (isNaN(num)) return `${currency} 0`;
    return `${currency} ${num.toLocaleString('en-PK')}`;
}

/**
 * ریٹنگ کو 5 میں سے فل اسٹارز میں بدلیں (HTML)
 */
function renderStars(rating) {
    if (!rating && rating !== 0) return '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star text-warning"></i>';
    if (halfStar) html += '<i class="fas fa-star-half-alt text-warning"></i>';
    for (let i = 0; i < emptyStars; i++) html += '<i class="far fa-star text-warning"></i>';
    return html;
}

/**
 * یونیفارم ریسپانس آبجیکٹ (API/Demo کے لیے)
 */
function createResponse(success, data = null, message = '') {
    return {
        success: success,
        data: data,
        message: message,
        timestamp: new Date().toISOString()
    };
}

/**
 * رینڈم آئی ڈی جنریٹ کریں (عارضی استعمال کے لیے)
 */
function generateId(prefix = 'id') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
}

/**
 * ایسے عنصر کو اسکرین پر لے آئیں (سموتھ سکرول)
 */
function scrollToElement(elementId, offset = 80) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * کسی عنصر کو کاپی کریں (کلپ بورڈ)
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

/**
 * فائل کا نام اس کی ایکسٹینشن کے ساتھ واپس کریں
 */
function getFileExtension(filename) {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
}

/**
 * فائل کا سائز ریڈ ایبل فارمیٹ میں بدلیں (KB, MB, GB)
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * چیک کریں کہ آیا براؤزر آن لائن ہے
 */
function isOnline() {
    return navigator.onLine;
}

/**
 * ڈیبگنگ کے لیے لاگر (پروڈکشن میں بند کیا جا سکتا ہے)
 */
function log(message, type = 'info') {
    if (type === 'info') console.log(`[INFO] ${message}`);
    else if (type === 'warn') console.warn(`[WARN] ${message}`);
    else if (type === 'error') console.error(`[ERROR] ${message}`);
    else console.log(message);
}

// export {
//     getTodayDate,
//     formatDate,
//     getCurrentTime,
//     capitalize,
//     cleanText,
//     formatPrice,
//     renderStars,
//     createResponse,
//     generateId,
//     scrollToElement,
//     copyToClipboard,
//     getFileExtension,
//     formatFileSize,
//     isOnline,
//     log
// };
