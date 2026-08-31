/**
 * Єдина відповідальність — перетворити payload замовлення
 * на текст повідомлення. Ніякого HTTP чи провайдерів тут немає.
 */
export class OrderMessageFormatter {
  format(order) {
    const itemsText = order.items
      .map((item) => `• ${item.name} × ${item.qty} = ${item.subtotal} грн`)
      .join('\n');

    return [
      '🛒 *Нове замовлення з сайту*',
      '',
      `Імʼя: ${order.customer.name}`,
      `Телефон: ${order.customer.phone}`,
      order.customer.comment ? `Коментар: ${order.customer.comment}` : null,
      '',
      itemsText,
      '',
      `*Разом: ${order.total} грн*`,
    ]
      .filter(Boolean)
      .join('\n');
  }
}
