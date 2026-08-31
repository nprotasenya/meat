import { WhatsAppProvider } from './WhatsAppProvider.js';

/**
 * Відправка через офіційний WhatsApp Cloud API (Meta for Developers).
 * Важливо: якщо 24-годинне вікно діалогу з отримувачем закрите,
 * Meta прийме лише затверджений message template, а не довільний текст —
 * тоді викликаємо #sendTemplate замість #sendFreeText.
 */
export class CloudApiProvider extends WhatsAppProvider {
  constructor({ phoneNumberId, accessToken, apiVersion, templateName, templateLang }) {
    super();
    this.phoneNumberId = phoneNumberId;
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.templateName = templateName;
    this.templateLang = templateLang;
  }

  get #endpoint() {
    return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  async sendMessage(toPhone, text) {
    const body = this.templateName
      ? this.#buildTemplateBody(toPhone, text)
      : this.#buildFreeTextBody(toPhone, text);

    const response = await fetch(this.#endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`WhatsApp Cloud API error: ${data.error?.message || response.statusText}`);
    }

    return { providerMessageId: data.messages?.[0]?.id ?? null };
  }

  #buildFreeTextBody(toPhone, text) {
    return {
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: text },
    };
  }

  #buildTemplateBody(toPhone, text) {
    // Шаблон із одним текстовим параметром {{1}} — підлаштуй під свій затверджений template.
    return {
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'template',
      template: {
        name: this.templateName,
        language: { code: this.templateLang },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text }],
          },
        ],
      },
    };
  }
}
