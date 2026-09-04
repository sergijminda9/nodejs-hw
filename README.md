# nodejs-hw — 04-auth

Express-додаток для роботи з колекцією нотаток: MongoDB через Mongoose, повний CRUD, пагінація, фільтрація, пошук, валідація через `celebrate`, і тепер — реєстрація, логін, логаут, сесії на кукі та приватні (прив'язані до користувача) нотатки.

## Стек

- Express 5
- Mongoose
- celebrate + Joi (валідація)
- bcrypt (хешування паролів)
- cookie-parser
- http-errors
- cors
- dotenv
- pino-http + pino-pretty (логування запитів)
- nodemon (розробка)
- eslint (лінтинг)

## Файлова структура

```
nodejs-hw/
├── src/
│   ├── constants/
│   │   ├── tags.js
│   │   └── time.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── notesController.js
│   ├── db/
│   │   └── connectMongoDB.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── logger.js
│   │   ├── notFoundHandler.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── note.js
│   │   ├── session.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── notesRoutes.js
│   ├── services/
│   │   └── auth.js
│   ├── validations/
│   │   ├── authValidation.js
│   │   └── notesValidation.js
│   └── server.js
├── notes.json
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
2. Скопіюйте `.env.example` у `.env` і підставте свої значення `PORT` та `MONGO_URL`:
   ```
   cp .env.example .env
   ```
3. Запустіть сервер у режимі розробки:
   ```
   npm run dev
   ```

## Автентифікація

### POST /auth/register

Тіло запиту: `{ "email": "...", "password": "..." }` (пароль мінімум 8 символів).

- `400 Email in use` — якщо email вже зайнято
- `201` — створений користувач (без пароля), у відповідь встановлюються кукі `accessToken`, `refreshToken`, `sessionId`

### POST /auth/login

Тіло запиту: `{ "email": "...", "password": "..." }`.

- `401 Invalid credentials` — якщо email не знайдено або пароль невірний
- `200` — залогінений користувач (без пароля), стара сесія видаляється, встановлюються нові кукі

### POST /auth/refresh

Без тіла запиту, дані беруться з кукі `sessionId` і `refreshToken`.

- `401 Session not found` — сесію не знайдено
- `401 Session token expired` — refresh-токен прострочений
- `200 { "message": "Session refreshed" }` — стара сесія видалена, встановлені нові кукі

### POST /auth/logout

Без тіла запиту, дані беруться з кукі `sessionId`.

- `204` — сесія видалена (якщо існувала), кукі очищені

Усі кукі встановлюються з параметрами `httpOnly: true`, `secure: true`, `sameSite: 'none'`. `accessToken` живе 15 хвилин, `refreshToken` і `sessionId` — 1 добу.

## Нотатки (потребують автентифікації)

Усі маршрути нижче захищені middleware `authenticate` — потрібен дійсний кукі `accessToken`. Нотатки прив'язані до `userId` і видимі/редаговані лише власником.

| Метод  | Шлях             | Відповідь                                          |
|--------|------------------|-------------------------------------------------------|
| GET    | `/notes`         | `200`, пагінація + фільтр `tag` + пошук `search` (лише свої нотатки) |
| GET    | `/notes/:noteId` | `200` / `404 Note not found` (лише своя нотатка)      |
| POST   | `/notes`         | `201`, нова нотатка з `userId` поточного користувача  |
| PATCH  | `/notes/:noteId` | `200` / `404 Note not found` (лише своя нотатка)      |
| DELETE | `/notes/:noteId` | `200` / `404 Note not found` (лише своя нотатка)      |

Помилки автентифікації: `401 Missing access token`, `401 Session not found`, `401 Access token expired`, або `401` без повідомлення, якщо користувача сесії більше не існує.

## Деплой на Render.com

1. Запуште гілку `04-auth` у свій GitHub-репозиторій `nodejs-hw`.
2. У Render: **New → Web Service** (або перемкніть Branch в існуючому сервісі), оберіть гілку `04-auth`.
3. Build command: `npm install`, Start command: `npm start`.
4. У розділі **Environment** додайте змінні `PORT` та `MONGO_URL`.
5. У MongoDB Atlas переконайтесь, що в **Network Access** дозволено `0.0.0.0/0`.
6. Після деплою перевірте `/auth/register`, `/auth/login`, `/notes` (з кукі) на задеплойованому URL.
