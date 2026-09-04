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

## Файлова структура
