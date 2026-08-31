/**
 * Проста валідація вхідного payload. Кидає ValidationError
 * зі зрозумілим повідомленням, яке handler віддасть клієнту як 400.
 */
export class ValidationError extends Error {}

export function validateOrderPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Порожнє тіло запиту');
  }

  const { customer, items, total } = body;

  if (!customer?.name || !customer?.phone) {
    throw new ValidationError('Не вказано імʼя або телефон клієнта');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Кошик порожній');
  }

  for (const item of items) {
    if (!item.name || typeof item.qty !== 'number' || item.qty <= 0) {
      throw new ValidationError(`Некоректна позиція товару: ${JSON.stringify(item)}`);
    }
  }

  if (typeof total !== 'number' || total <= 0) {
    throw new ValidationError('Некоректна сума замовлення');
  }

  return body;
}
