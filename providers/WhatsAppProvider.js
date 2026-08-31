/**
 * "Інтерфейс" провайдера відправки. JS не має реальних interface,
 * тому фіксуємо контракт базовим класом, що кидає помилку,
 * якщо метод не перевизначено (Liskov: будь-яка реалізація
 * взаємозамінна з іншою).
 */
export class WhatsAppProvider {
  /**
   * @param {string} toPhone - номер отримувача у форматі 380XXXXXXXXX
   * @param {string} text - текст повідомлення
   * @returns {Promise<{ providerMessageId: string }>}
   */
  async sendMessage(_toPhone, _text) {
    throw new Error('sendMessage() must be implemented by provider');
  }
}
