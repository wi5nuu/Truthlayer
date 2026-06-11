const SENSITIVE_PATTERNS = [
  /password/i,
  /credit.?card/i,
  /ssn/i,
  /social.?security/i,
  /bank.?account/i,
  /routing.?number/i,
  /cvv/i,
  /cvc/i,
  /pin/i,
  /secret.?key/i,
  /api.?key/i,
  /auth.?token/i
];

const ALLOWED_TAGS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'a', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside'];

function sanitizeHTML(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?<\/embed>/gi, '')
    .substring(0, 5000);
}

function sanitizeText(text) {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>/g, '').trim();
  return cleaned.substring(0, 2000);
}

function containsSensitiveData(text) {
  if (!text) return false;
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(text));
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

function truncateText(text, maxLength = 1000) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

module.exports = { sanitizeHTML, sanitizeText, containsSensitiveData, stripHtml, truncateText };
