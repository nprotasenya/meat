/**
 * Оркеструє: відформатувати замовлення -> відправити провайдером.
 * Залежить від абстракцій (formatter, provider передаються ззовні),
 * а не створює їх сам — легко підмінити в тестах (DIP).
 */
export class OrderNotificationService {
  /**
   * @param {import('../providers/WhatsAppProvider.js').WhatsAppProvider} provider
   * @param {import('./OrderMessageFormatter.js').OrderMessageFormatter} formatter
   * @param {string} managerPhone
   */
  constructor(provider, formatter, managerPhone) {
    this.provider = provider;
    this.formatter = formatter;
    this.managerPhone = managerPhone;
  }

  async notify(order) {
    const text = this.formatter.format(order);
    return this.provider.sendMessage(this.managerPhone, text);
  }
}
