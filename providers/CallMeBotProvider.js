import { WhatsAppProvider } from './WhatsAppProvider.js';

/**
 * Найпростіший варіант для кейсу "одне повідомлення на один свій номер":
 * https://www.callmebot.com — безкоштовний, без верифікації бізнесу,
 * без шаблонів. Один GET-запит.
 *
 * Налаштування (робиться один раз, руками):
 * 1. Додай у контакти номер бота CallMeBot: +34 644 56 55 18
 * 2. З ТОГО номера, на який хочеш отримувати замовлення, напиши цьому
 *    контакту в WhatsApp: "I allow callmebot to send me messages"
 * 3. У відповідь прийде apikey — встав його в CALLMEBOT_APIKEY
 *
 * Обмеження: неофіційний сервіс, є ліміти швидкості (не для розсилок),
 * але для "1 замовлення = 1 повідомлення" підходить ідеально.
 */
export class CallMeBotProvider extends WhatsAppProvider {
  constructor({ apiKey }) {
    super();
    this.apiKey = apiKey;
  }

  async sendMessage(toPhone, text) {
    const url = new URL('https://api.callmebot.com/whatsapp.php');
    url.searchParams.set('phone', toPhone);
    url.searchParams.set('text', text);
    url.searchParams.set('apikey', this.apiKey);

    const response = await fetch(url.toString());
    const responseText = await response.text();

    if (!response.ok || /error/i.test(responseText)) {
      throw new Error(`CallMeBot error: ${responseText}`);
    }

    return { providerMessageId: null };
  }
}
