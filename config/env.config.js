/**
 * Єдине місце, де читаємо process.env. Решта коду імпортує вже
 * готовий, провалідований обʼєкт CONFIG — ніде більше немає
 * прямих звернень до process.env (DRY, single source of truth).
 */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Відсутня обовʼязкова змінна середовища: ${name}`);
  }
  return value;
}

export function loadConfig() {
  const provider = process.env.WHATSAPP_PROVIDER || 'whapi'; // 'whapi' | 'cloud_api' | 'twilio'

  return {
    provider,
    managerPhone: required('MANAGER_WHATSAPP_NUMBER'), // напр. 380671234567

    whapi: {
      token: process.env.WHAPI_TOKEN,
      apiUrl: process.env.WHAPI_URL || 'https://gate.whapi.cloud',
    },

    cloudApi: {
      phoneNumberId: process.env.WA_CLOUD_PHONE_NUMBER_ID,
      accessToken: process.env.WA_CLOUD_ACCESS_TOKEN,
      apiVersion: process.env.WA_CLOUD_API_VERSION || 'v20.0',
      // Назва затвердженого message template (якщо 24-годинне вікно закрите)
      templateName: process.env.WA_CLOUD_TEMPLATE_NAME || null,
      templateLang: process.env.WA_CLOUD_TEMPLATE_LANG || 'uk',
    },

    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromWhatsApp: process.env.TWILIO_WHATSAPP_FROM, // напр. 'whatsapp:+14155238886'
    },

    // Дозволені джерела для CORS (адреса фронтенду на Vercel)
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim()),
  };
}
