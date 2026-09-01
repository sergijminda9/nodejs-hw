# nodejs-hw — 01-express

Мінімальний Express-сервер для роботи з колекцією нотаток.

## Стек

- Express 5
- cors
- dotenv
- pino-http (логування запитів)
- nodemon (розробка)
- eslint (лінтинг)

## Файлова структура

```
nodejs-hw/
├── src/
│   └── server.js
├── index.js
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── .prettierignore
├── eslint.config.mjs
└── package.json
```

## Запуск локально

1. Встановіть залежності:
   ```
   npm install
   ```
2. Переконайтесь, що є файл `.env` зі змінною `PORT` (скопіюйте `.env.example`, якщо потрібно):
   ```
   cp .env.example .env
   ```
3. Запустіть сервер у режимі розробки:
   ```
   npm run dev
   ```
   Сервер стартує на порті зі змінної `PORT` (за замовчуванням — 3000).

## Маршрути

| Метод | Шлях             | Відповідь                                                        |
|-------|------------------|-------------------------------------------------------------------|
| GET   | `/notes`         | `200 { "message": "Retrieved all notes" }`                        |
| GET   | `/notes/:noteId` | `200 { "message": "Retrieved note with ID: <noteId>" }`            |
| GET   | `/test-error`    | Кидає помилку → обробляється error middleware → `500`             |
| *     | будь-що інше     | `404 { "message": "Route not found" }`                             |

## Деплой на Render.com

1. Запуште гілку `01-express` у свій GitHub-репозиторій `nodejs-hw`.
2. У Render: **New → Web Service**, підключіть репозиторій, оберіть гілку `01-express`.
3. Налаштування білду:
   - Build command: `npm install`
   - Start command: `npm start`
4. У розділі **Environment** додайте змінну `PORT` (Render зазвичай підставляє свій `PORT` автоматично — сервер це коректно підхопить, бо код читає `process.env.PORT`).
5. Після деплою перевірте `https://<your-app>.onrender.com/notes` та інші маршрути.
