import { WhatsAppProvider } from './WhatsAppProvider.js';

/**
 * Альтернативний провайдер через Twilio WhatsApp API.
 * Той самий контракт sendMessage(), тож ProviderFactory може
 * підмінити CloudApiProvider на цей без змін в іншому коді (OCP).
 */
export class TwilioProvider extends WhatsAppProvider {
  constructor({ accountSid, authToken, fromWhatsApp }) {
    super();
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromWhatsApp = fromWhatsApp;
  }

  get #endpoint() {
    return `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
  }

  async sendMessage(toPhone, text) {
    const basicAuth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    const params = new URLSearchParams({
      From: this.fromWhatsApp,
      To: `whatsapp:+${toPhone.replace(/\D/g, '')}`,
      Body: text,
    });

    const response = await fetch(this.#endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Twilio error: ${data.message || response.statusText}`);
    }

    return { providerMessageId: data.sid ?? null };
  }
}
