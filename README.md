<<<<<<< Updated upstream
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
=======
# nodejs-hw — 05-mail-and-img

Express-додаток для роботи з колекцією нотаток: MongoDB через Mongoose, повний CRUD, пагінація, фільтрація, пошук, валідація через `celebrate`, реєстрація/логін/сесії на кукі, приватні нотатки — і тепер ще скидання пароля через email та завантаження аватара користувача в Cloudinary.

## Стек

- Express 5, Mongoose
- celebrate + Joi (валідація)
- bcrypt (хешування паролів), jsonwebtoken (токен скидання пароля)
- nodemailer (SMTP, напр. Brevo/SendGrid), handlebars (HTML-шаблон листа)
- multer (memoryStorage) + cloudinary (аватари)
- cookie-parser, http-errors, cors, dotenv
- pino-http + pino-pretty (логування запитів)
- nodemon (розробка), eslint (лінтинг)
>>>>>>> Stashed changes

## Файлова структура

```
nodejs-hw/
├── src/
│   ├── constants/
│   │   ├── tags.js
│   │   └── time.js
│   ├── controllers/
│   │   ├── authController.js
<<<<<<< Updated upstream
│   │   └── notesController.js
=======
│   │   ├── notesController.js
│   │   └── userController.js
>>>>>>> Stashed changes
│   ├── db/
│   │   └── connectMongoDB.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── logger.js
<<<<<<< Updated upstream
=======
│   │   ├── multer.js
>>>>>>> Stashed changes
│   │   ├── notFoundHandler.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── note.js
│   │   ├── session.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
<<<<<<< Updated upstream
│   │   └── notesRoutes.js
│   ├── services/
│   │   └── auth.js
=======
│   │   ├── notesRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── auth.js
│   ├── templates/
│   │   └── reset-password-email.html
│   ├── utils/
│   │   ├── saveFileToCloudinary.js
│   │   └── sendMail.js
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
## Запуск локально
=======
## Налаштування
>>>>>>> Stashed changes

1. Встановіть залежності:
   ```
   npm install
   ```
<<<<<<< Updated upstream
2. Скопіюйте `.env.example` у `.env` і підставте свої значення `PORT` та `MONGO_URL`:
=======
2. Скопіюйте `.env.example` у `.env` і заповніть усі значення:
>>>>>>> Stashed changes
   ```
   cp .env.example .env
   ```

### Змінні оточення

| Змінна | Опис |
|---|---|
| `PORT` | Порт сервера |
| `MONGO_URL` | Рядок підключення до MongoDB Atlas |
| `JWT_SECRET` | Довільний секретний рядок для підпису JWT-токена скидання пароля |
| `FRONTEND_DOMAIN` | Домен фронтенда, на який веде посилання в листі (напр. `http://localhost:3001`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Дані SMTP-акаунта (Brevo або SendGrid) |
| `SMTP_FROM` | Пошта відправника (та, на яку реєстрували SMTP-акаунт) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Дані акаунта Cloudinary |

3. Запустіть сервер у режимі розробки:
   ```
   npm run dev
   ```

<<<<<<< Updated upstream
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
=======
## Скидання пароля

### POST /auth/request-reset-email

Тіло: `{ "email": "..." }`.

- Завжди повертає `200 { "message": "Password reset email sent successfully" }` — навіть якщо користувача з таким email не існує (щоб не розкривати наявність акаунтів).
- Якщо користувач існує: генерується JWT (термін дії 15 хв), формується HTML-лист із шаблону `src/templates/reset-password-email.html` (через handlebars) з посиланням `<FRONTEND_DOMAIN>/reset-password?token=<jwt>`, і надсилається через `nodemailer`.
- `500 { "message": "Failed to send the email, please try again later." }` — якщо надсилання не вдалося.

### POST /auth/reset-password

Тіло: `{ "token": "...", "password": "..." }`.

- `401 Invalid or expired token` — токен невалідний/прострочений
- `404 User not found` — користувача з токена не знайдено
- `200 { "message": "Password reset successfully" }` — пароль оновлено (хешується через bcrypt)

## Аватар користувача

### PATCH /users/me/avatar

Захищений маршрут (потрібен дійсний `accessToken`). Тіло — `multipart/form-data` з полем `avatar` (файл зображення, до 2MB).

- `401` — якщо не авторизований
- `400 { "message": "No file" }` — якщо файл не передано
- Файл завантажується в Cloudinary через `saveFileToCloudinary`, поле `avatar` користувача оновлюється на `secure_url`
- `200 { "url": "<посилання на аватар>" }` — у разі успіху

## Деплой на Render.com

1. Запуште гілку `05-mail-and-img` у свій GitHub-репозиторій `nodejs-hw`.
2. У Render: **New → Web Service** (або перемкніть Branch в існуючому сервісі), оберіть гілку `05-mail-and-img`.
3. Build command: `npm install`, Start command: `npm start`.
4. У розділі **Environment** додайте **усі** змінні з таблиці вище (`PORT`, `MONGO_URL`, `JWT_SECRET`, `FRONTEND_DOMAIN`, SMTP-*, CLOUDINARY-*).
5. У MongoDB Atlas переконайтесь, що в **Network Access** дозволено `0.0.0.0/0`.
6. Після деплою перевірте `/auth/request-reset-email` (чи справді приходить лист) та `/users/me/avatar` (чи завантажується файл у Cloudinary).
>>>>>>> Stashed changes
