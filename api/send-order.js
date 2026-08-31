import { loadConfig } from '../config/env.config.js';
import { createProvider } from '../providers/ProviderFactory.js';
import { OrderMessageFormatter } from '../services/OrderMessageFormatter.js';
import { OrderNotificationService } from '../services/OrderNotificationService.js';
import { validateOrderPayload, ValidationError } from '../utils/validateOrderPayload.js';

/**
 * Єдиний ендпоінт мікросервісу: POST /api/send-order
 * Тонкий handler — жодної бізнес-логіки, лише:
 * CORS -> валідація -> DI провайдера/сервісу -> виклик -> відповідь.
 */
export default async function handler(req, res) {
  const config = loadConfig();
  applyCors(res, config.allowedOrigins);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const order = validateOrderPayload(req.body);

    const provider = createProvider(config);
    const formatter = new OrderMessageFormatter();
    const notificationService = new OrderNotificationService(provider, formatter, config.managerPhone);

    const result = await notificationService.notify(order);

    res.status(200).json({ success: true, providerMessageId: result.providerMessageId });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }

    console.error('send-order error:', err);
    res.status(502).json({
      success: false,
      message: 'Не вдалося надіслати повідомлення в WhatsApp. Спробуйте пізніше.',
    });
  }
}

function applyCors(res, allowedOrigins) {
  const origin = allowedOrigins.includes('*') ? '*' : allowedOrigins.join(',');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
