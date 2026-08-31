import { CloudApiProvider } from './CloudApiProvider.js';
import { TwilioProvider } from './TwilioProvider.js';
import { WhapiProvider } from './WhapiProvider.js';

/**
 * Єдине місце, що знає про ВСІ доступні провайдери.
 * Щоб додати новий провайдер (напр. власний BSP) — додаємо кейс тут,
 * решта коду (OrderNotificationService, handler) не змінюється.
 */
export function createProvider(config) {
  switch (config.provider) {
    case 'cloud_api':
      return new CloudApiProvider(config.cloudApi);
    case 'twilio':
      return new TwilioProvider(config.twilio);
    case 'whapi':
      return new WhapiProvider(config.whapi);
    default:
      throw new Error(`Невідомий WHATSAPP_PROVIDER: ${config.provider}`);
  }
}
