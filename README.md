# Магазин + WhatsApp-сповіщення

Один Vercel-проєкт: статичний фронтенд у корені + одна serverless-функція в `api/`.
Фронт і API на одному домені, тому шлях до API відносний (`/api/send-order`)
і CORS не потрібен.

## Структура

```
index.html              — сторінка магазину
css/, assets/           — стилі, зображення
js/
  config/app.config.js  — "змінні" фронтенду (назва магазину, ключ localStorage)
  data/products.json    — товари
  core/                 — Product, Cart, CartStorage, EventEmitter (домен)
  services/             — ProductService, OrderService
  ui/                   — ProductListView, CartModalView, CartBadgeView
  app.js                — composition root

api/send-order.js       — єдиний ендпоінт (serverless-функція Vercel)
config/env.config.js    — читання process.env (єдине місце)
providers/              — Whapi / Cloud API / Twilio + ProviderFactory
services/               — OrderMessageFormatter, OrderNotificationService
utils/                  — validateOrderPayload

vercel.json             — ліміт часу виконання функції
.env.example            — перелік потрібних змінних середовища
```

## API

`POST /api/send-order`

```json
{
  "customer": { "name": "Олена", "phone": "+380671112233", "comment": "" },
  "items": [{ "id": "p001", "name": "Кросівки Runner X1", "price": 2499, "qty": 1, "subtotal": 2499 }],
  "total": 2499,
  "createdAt": "2026-07-26T10:00:00.000Z"
}
```

Відповідь: `{ "success": true, "providerMessageId": "..." }` або
`{ "success": false, "message": "..." }`.

## Локальний запуск

```bash
npm i -g vercel
cp .env.example .env
vercel dev
```

`vercel dev` підіймає і статику, і функцію на `http://localhost:3000`.
Просто відкрити `index.html` подвійним кліком (`file://`) не спрацює —
браузер заблокує `fetch` до `products.json` і до `/api/send-order`.

## Деплой

```bash
vercel --prod
```

Змінні середовища додаються в Vercel Dashboard → проєкт →
**Settings → Environment Variables** (значення з `.env.example`).
Обовʼязкові мінімум: `MANAGER_WHATSAPP_NUMBER` і `WHAPI_TOKEN`.
Після додавання змінних потрібен повторний `vercel --prod` —
вже задеплоєна функція нові env не підхоплює.

`ALLOWED_ORIGINS` можна лишити `*`: фронт на тому самому домені,
крос-доменних запитів немає.

## Провайдер за замовчуванням: Whapi.Cloud

Кейс — "одне повідомлення на один фіксований номер" (без масової розсилки,
без шаблонів, без верифікації бізнесу в Meta). Тому дефолтний провайдер —
**Whapi.Cloud**, звичайний REST-виклик поверх WhatsApp-сесії:

1. Зареєструватись на https://whapi.cloud
2. **New channel** → на екрані каналу натиснути **Authorize**
   → сканується QR-код своїм WhatsApp (тим номером, на який мають приходити
   сповіщення, або окремим — головне, щоб `MANAGER_WHATSAPP_NUMBER`
   вказував саме той номер, куди слати).
3. Скопіювати API token каналу → `WHAPI_TOKEN`.
4. `WHATSAPP_PROVIDER=whapi` уже стоїть за замовчуванням.

Обмеження: канал привʼязаний до реального номера-сесії (як WhatsApp Web) —
якщо на телефоні вийти з WhatsApp або довго не бути в мережі, сесію інколи
треба переавторизовувати.

## Альтернатива: WhatsApp Cloud API (Meta)

1. https://developers.facebook.com → створити App → додати продукт **WhatsApp**.
2. З тестового номера скопіювати `PHONE_NUMBER_ID` і тимчасовий `ACCESS_TOKEN`.
3. **Важливо:** без активного 24-годинного вікна діалогу з отримувачем
   Cloud API прийме лише затверджений message template, не довільний текст.
4. Поставити `WHATSAPP_PROVIDER=cloud_api`.

## Альтернатива: Twilio

Поставити `WHATSAPP_PROVIDER=twilio` і заповнити `TWILIO_*` змінні —
код провайдера й формат повідомлення міняти не треба
(`ProviderFactory` сам підставить потрібну реалізацію).

## Наступний крок (React + Node + Mongo/Strapi/Sanity)

Шари навмисно розділені (core / services / ui), щоб міграцію робити частинами:
- `js/core/*` (Product, Cart) переноситься в React-стан майже без змін логіки.
- `js/services/ProductService` заміниться на запит до Strapi/Sanity API замість `products.json`.
- `js/services/OrderService` не зміниться взагалі — контракт із функцією той самий.
