# nodejs-hw — 03-validation

Express-додаток для роботи з колекцією нотаток: MongoDB через Mongoose, повний CRUD, пагінація, фільтрація за тегом, повнотекстовий пошук та валідація вхідних даних через `celebrate`.

## Стек

- Express 5
- Mongoose
- celebrate + Joi (валідація)
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
│   │   └── tags.js
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
│   ├── validations/
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

## Маршрути

### GET /notes

Повертає нотатки з пагінацією, фільтрацією за тегом і текстовим пошуком.

Query-параметри (усі необов'язкові):

| Параметр  | Тип    | За замовчуванням | Обмеження                          |
|-----------|--------|-------------------|--------------------------------------|
| `page`    | number | `1`                | ціле, мінімум 1                      |
| `perPage` | number | `10`               | ціле, від 5 до 20                    |
| `tag`     | string | —                  | одне з `src/constants/tags.js`       |
| `search`  | string | —                  | шукає в `title` і `content` (regex, регістронезалежно) |

Приклад:
```
GET /notes?page=1&perPage=15&tag=Todo&search=hello
```

Відповідь `200`:
```json
{
  "page": 1,
  "perPage": 15,
  "totalNotes": 150,
  "totalPages": 10,
  "notes": [ /* масив нотаток */ ]
}
```

### Інші маршрути

| Метод  | Шлях             | Валідація                                                | Відповідь                                     |
|--------|------------------|------------------------------------------------------------|--------------------------------------------------|
| GET    | `/notes/:noteId` | `noteId` — валідний Mongo ObjectId                          | `200`, об'єкт нотатки / `404 Note not found`      |
| POST   | `/notes`         | `title` обов'язковий (мін. 1 символ), `content`/`tag` необов'язкові | `201`, створений об'єкт                          |
| PATCH  | `/notes/:noteId` | `noteId` валідний; тіло — хоча б одне з `title`/`content`/`tag` | `200`, оновлений об'єкт / `404 Note not found`   |
| DELETE | `/notes/:noteId` | `noteId` — валідний Mongo ObjectId                          | `200`, видалений об'єкт / `404 Note not found`   |
| *      | будь-що інше     | —                                                            | `404 { "message": "Route not found" }`            |

Помилки валідації (celebrate) повертають `400` з деталями по кожному сегменту запиту (`query` / `params` / `body`). Інші серверні помилки — `500`, або відповідний статус, якщо кинуто через `http-errors`.

## Деплой на Render.com

1. Запуште гілку `03-validation` у свій GitHub-репозиторій `nodejs-hw`.
2. У Render: **New → Web Service**, підключіть репозиторій, оберіть гілку `03-validation`.
3. Build command: `npm install`, Start command: `npm start`.
4. У розділі **Environment** додайте змінні `PORT` та `MONGO_URL`.
5. У MongoDB Atlas переконайтесь, що в **Network Access** дозволено `0.0.0.0/0`.
6. Після деплою перевірте всі маршрути на задеплойованому URL.
