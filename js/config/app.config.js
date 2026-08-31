/**
 * Єдине місце з "змінними середовища" фронтенду.
 * Все, що може змінитись між дев/продакшн — виносимо сюди,
 * а не розкидаємо по коду (DRY, single source of truth).
 */
export const CONFIG = Object.freeze({
  // Ендпоінт розсилки. Фронт і функція живуть в одному Vercel-проєкті,
  // тому шлях відносний — нічого прописувати вручну не треба (і CORS не потрібен).
  ORDER_API_URL: '/api/send-order',

  STORE_NAME: "SWAGER'S SHOP",
  CURRENCY: 'грн',

  // Ключ, під яким корзина зберігається в localStorage
  CART_STORAGE_KEY: 'shop_cart_v1',
});
