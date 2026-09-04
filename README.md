# nodejs-hw — 02-mongodb

Express-додаток для роботи з колекцією нотаток, підключений до MongoDB через Mongoose. Реалізовано повний набір CRUD-операцій, код розбитий на модулі (роути / контролери / модель / middleware / підключення до БД).

## Стек

- Express 5
- Mongoose
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
│   ├── controllers/
│   │   └── notesController.js
│   ├── db/
│   │   └── connectMongoDB.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── notFoundHandler.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── note.js
│   ├── routes/
│   │   └── notesRoutes.js
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

Проєкт використовує ES-модулі (`"type": "module"`), `src/server.js` — єдина точка входу.

## Налаштування MongoDB Atlas

1. Створіть безкоштовний кластер на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. У **Network Access** додайте `0.0.0.0/0` (Allow access from anywhere).
3. У **Database Access** створіть користувача з паролем.
4. Скопіюйте connection string (Drivers → Node.js) і підставте у змінну `MONGO_URL` у `.env`.
5. За бажанням імпортуйте базовий набір нотаток з `notes.json` у колекцію `notes` через Compass або UI Atlas.

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
   При вдалому підключенні до бази в консолі з'явиться:
   ```
   ✅ MongoDB connection established successfully
   ```

## Маршрути

| Метод  | Шлях             | Опис                    | Відповідь                                    |
|--------|------------------|--------------------------|-------------------------------------------------|
| GET    | `/notes`         | Отримати всі нотатки     | `200`, масив нотаток                             |
| GET    | `/notes/:noteId` | Отримати нотатку за ID   | `200`, об'єкт нотатки / `404 Note not found`     |
| POST   | `/notes`         | Створити нотатку         | `201`, створений об'єкт                          |
| PATCH  | `/notes/:noteId` | Оновити нотатку за ID    | `200`, оновлений об'єкт / `404 Note not found`   |
| DELETE | `/notes/:noteId` | Видалити нотатку за ID   | `200`, видалений об'єкт / `404 Note not found`   |
| *      | будь-що інше     | Неіснуючий маршрут       | `404 { "message": "Route not found" }`           |

Помилки на сервері (валідація Mongoose тощо) повертають `500 { "message": "<текст помилки>" }`, а помилки, кинуті через `http-errors` (наприклад `Note not found`), повертають відповідний статус (404) з тим самим форматом.

### Модель Note

```js
{
  title: String,    // обов'язкове, trim
  content: String,  // необов'язкове, за замовчуванням '', trim
  tag: String,      // одне з: Work, Personal, Meeting, Shopping, Ideas,
                     // Travel, Finance, Health, Important, Todo
                     // за замовчуванням 'Todo'
  createdAt: Date,  // автоматично (timestamps: true)
  updatedAt: Date,  // автоматично (timestamps: true)
}
```

## Деплой на Render.com

1. Запуште гілку `02-mongodb` у свій GitHub-репозиторій `nodejs-hw`.
2. У Render: **New → Web Service**, підключіть репозиторій, оберіть гілку `02-mongodb`.
3. Налаштування білду:
   - Build command: `npm install`
   - Start command: `npm start`
4. У розділі **Environment** додайте змінні `PORT` та `MONGO_URL` (той самий connection string, що й локально; переконайтесь, що в Atlas дозволений доступ з будь-якої IP — `0.0.0.0/0`).
5. Після деплою перевірте всі маршрути на задеплоєному URL.
