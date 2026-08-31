import { WhatsAppProvider } from './WhatsAppProvider.js';

/**
 * Провайдер через Whapi.Cloud — WhatsApp-шлюз через QR-сесію,
 * без верифікації Meta й без шаблонів. Підключення: реєструєшся
 * на whapi.cloud, скануєш QR у власному кабінеті, отримуєш Bearer-токен
 * каналу і просто шлеш POST. Ідеально для кейсу "одне повідомлення
 * на один фіксований номер".
 */
export class WhapiProvider extends WhatsAppProvider {
  constructor({ token, apiUrl }) {
    super();
    this.token = token;
    this.apiUrl = apiUrl || 'https://gate.whapi.cloud';
  }

  get #endpoint() {
    return `${this.apiUrl}/messages/text`;
  }

  async sendMessage(toPhone, text) {
    // Отримувач — або номер телефону, або готовий ID чату/групи (напр. 1203...@g.us).
    // Номер чистимо від форматування, JID лишаємо як є.
    const to = toPhone.includes('@') ? toPhone.trim() : toPhone.replace(/[^0-9]/g, '');

    const response = await fetch(this.#endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ to, body: text }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(`Whapi.Cloud error: ${data.error?.message || data.message || response.statusText}`);
    }

    return { providerMessageId: data.message?.id ?? data.id ?? null };
  }
}
