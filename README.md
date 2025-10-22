# BULL Trading - Сайт для найму трейдерів

Сучасний односторінковий веб-сайт для найму та рекрутингу трейдерів з адмін панеллю для управління контентом.

![BULL Trading](https://img.shields.io/badge/BULL-Trading-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🎯 Особливості

### Фронтенд
- ⚡ **Vite + React** - швидка розробка та build
- 🎨 **Tailwind CSS** - сучасний дизайн
- 🧩 **shadcn/ui** - високоякісні UI компоненти
- ✨ **Анімації** - плавні SVG анімації на фоні
- 📱 **Responsive** - адаптивний дизайн для всіх пристроїв
- 🎭 **Dark theme** - темна тема з зеленими акцентами

### Backend
- 🚀 **Express.js** - швидкий Node.js сервер
- 🗄️ **MongoDB** - NoSQL база даних
- 🔒 **JWT** - безпечна автентифікація
- 📊 **RESTful API** - чистий API для всіх операцій

### Адмін Панель
- 📩 **Управління заявками** - перегляд та обробка заявок з сайту
- 📤 **Telegram інтеграція** - автоматична відправка заявок в Telegram
- 👥 **Управління командою** - додавання/редагування членів команди
- 📸 **Завантаження фото** - підтримка фото або автоматичні ініціали
- 🎯 **Переваги** - керування перевагами компанії
- 📈 **Статистика** - редагування статистичних даних
- 📝 **Контент** - зміна всіх текстів на сайті
- 🔐 **Захищений доступ** - JWT автентифікація

## 📋 Зміст

- [Технології](#технології)
- [Швидкий старт](#швидкий-старт)
- [Структура проекту](#структура-проекту)
- [API Endpoints](#api-endpoints)
- [Адмін панель](#адмін-панель)
- [Telegram інтеграція](#telegram-інтеграція)
- [Деплой](#деплой)
- [Ліцензія](#ліцензія)

## 🛠 Технології

### Frontend
- **React 18** - UI бібліотека
- **TypeScript** - типізація
- **Vite** - build tool
- **Tailwind CSS** - utility-first CSS
- **shadcn/ui** - компоненти
- **React Router** - маршрутизація
- **Tanstack Query** - управління даними

### Backend
- **Node.js** - runtime
- **Express.js** - web framework
- **MongoDB** - база даних
- **Mongoose** - ODM
- **JWT** - автентифікація
- **bcryptjs** - хешування паролів
- **CORS** - cross-origin запити

### DevOps
- **Nodemon** - автоматичний перезапуск
- **Concurrently** - паралельний запуск
- **ESLint** - лінтинг
- **PostCSS** - обробка CSS

## 🚀 Швидкий старт

### Вимоги
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0 (локально або Atlas)

### Встановлення

1. **Клонуйте репозиторій**
```bash
git clone https://github.com/your-repo/bulltrading-ukraine-hiring.git
cd bulltrading-ukraine-hiring
```

2. **Встановіть залежності**
```bash
npm install
```

3. **Створіть файл .env**
```env
MONGODB_URI=mongodb://localhost:27017/bulltrading
# або для MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bulltrading

PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Telegram Bot (опціонально, для отримання заявок)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

**Примітка:** Для налаштування Telegram бота дивіться [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

4. **Ініціалізуйте базу даних**
```bash
npm run seed
```

5. **Запустіть проект**
```bash
# Запустити фронтенд та backend разом
npm run dev:all

# Або окремо:
npm run dev      # Тільки фронтенд (порт 8080)
npm run server   # Тільки backend (порт 5000)
```

6. **Відкрийте браузер**
- Головна сторінка: http://localhost:8080
- Адмін панель: http://localhost:8080/admin/login

### Дані для входу в адмін панель
- **Логін:** admin
- **Пароль:** admin123

## 📁 Структура проекту

```
bulltrading-ukraine-hiring/
├── src/                          # Frontend код
│   ├── components/              # React компоненти
│   │   ├── AboutSection.tsx
│   │   ├── AdvantagesSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ui/                  # shadcn/ui компоненти
│   ├── pages/                   # Сторінки
│   │   ├── Index.tsx
│   │   └── admin/               # Адмін панель
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── TeamManager.tsx
│   │       ├── AdvantagesManager.tsx
│   │       ├── StatsManager.tsx
│   │       └── ContentManager.tsx
│   ├── lib/                     # Утиліти
│   │   ├── api.ts              # API клієнт
│   │   └── utils.ts
│   ├── hooks/                   # Custom hooks
│   └── assets/                  # Статичні файли
│
├── server/                      # Backend код
│   ├── index.js                # Express сервер
│   ├── seed.js                 # Скрипт ініціалізації БД
│   ├── models/                 # Mongoose моделі
│   │   ├── TeamMember.js
│   │   ├── Advantage.js
│   │   ├── Stats.js
│   │   └── Content.js
│   ├── routes/                 # API маршрути
│   │   ├── auth.js
│   │   ├── team.js
│   │   ├── advantages.js
│   │   ├── stats.js
│   │   └── content.js
│   └── middleware/             # Middleware
│       └── auth.js
│
├── public/                      # Публічні файли
├── .env                        # Змінні середовища
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔌 API Endpoints

### Автентифікація
```
POST   /api/auth/login          # Вхід в систему
POST   /api/auth/verify         # Перевірка токену
```

### Заявки
```
GET    /api/applications        # Отримати всі заявки (auth)
GET    /api/applications/:id    # Отримати одну заявку (auth)
POST   /api/applications        # Створити заявку (public)
PUT    /api/applications/:id    # Оновити заявку (auth)
DELETE /api/applications/:id    # Видалити заявку (auth)
POST   /api/applications/:id/resend # Повторно відправити в Telegram (auth)
```

### Команда
```
GET    /api/team                # Отримати всіх членів
GET    /api/team/:id            # Отримати одного члена
POST   /api/team                # Створити члена (auth)
PUT    /api/team/:id            # Оновити члена (auth)
DELETE /api/team/:id            # Видалити члена (auth)
```

### Переваги
```
GET    /api/advantages          # Отримати всі переваги
POST   /api/advantages          # Створити перевагу (auth)
PUT    /api/advantages/:id      # Оновити перевагу (auth)
DELETE /api/advantages/:id      # Видалити перевагу (auth)
```

### Статистика
```
GET    /api/stats               # Отримати статистику
POST   /api/stats               # Створити статистику (auth)
PUT    /api/stats/:id           # Оновити статистику (auth)
DELETE /api/stats/:id           # Видалити статистику (auth)
```

### Контент
```
GET    /api/content             # Отримати весь контент
GET    /api/content/:section    # Отримати контент секції
POST   /api/content/:section    # Оновити контент (auth)
```

## 🎨 Адмін Панель

### Доступ
URL: `/admin/login`

### Розділи

#### 1. Dashboard (`/admin/dashboard`)
- Огляд всіх розділів
- Швидкий доступ до управління

#### 2. Заявки (`/admin/applications`)
- Перегляд всіх заявок з сайту
- Статуси: Нова, В обробці, Завершена, Відхилена
- Telegram статус (відправлено/помилка)
- Повторна відправка в Telegram
- Додавання приміток
- Видалення заявок

#### 3. Команда (`/admin/team`)
- Додавання нових членів
- Завантаження фото (до 2MB)
- Автоматичні ініціали з імені
- Редагування та видалення

#### 4. Переваги (`/admin/advantages`)
- Управління перевагами компанії
- Вибір іконок (6 варіантів)
- Вибір кольорів
- Зміна порядку

#### 5. Статистика (`/admin/stats`)
- Редагування цифр
- Зміна підписів
- Управління порядком

#### 6. Контент (`/admin/content`)
- Hero блок
- Про компанію
- Переваги
- Команда
- Контакти

## 📱 Telegram інтеграція

Сайт підтримує автоматичну відправку заявок в Telegram бот або групу.

### Як налаштувати:

1. Створіть Telegram бота через [@BotFather](https://t.me/BotFather)
2. Отримайте Bot Token
3. Отримайте Chat ID (особистий чат або група)
4. Додайте в `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

**Детальна інструкція:** [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

### Що відбувається:
- ✅ Користувач заповнює форму на сайті
- ✅ Заявка зберігається в MongoDB
- ✅ Автоматично надсилається в Telegram
- ✅ Адміністратор отримує повідомлення з даними
- ✅ Можна переглядати та обробляти в адмін панелі

### Формат повідомлення:
```
🎯 Нова заявка на сайті BULL Trading!

👤 Ім'я: Іван Петренко
📱 Телефон: +380501234567
📧 Email: ivan@example.com

🕐 Дата: 22.10.2025, 14:30

#новазаявка #bulltrading
```

## 🚢 Деплой

Детальні інструкції по деплою на різні платформи дивіться в [DEPLOYMENT.md](./DEPLOYMENT.md)

### Швидкий деплой на Render
1. Створіть акаунт на [Render.com](https://render.com)
2. Підключіть GitHub репозиторій
3. Створіть Web Service
4. Налаштуйте змінні середовища
5. Deploy!

Детальніше: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 Скрипти

```bash
npm run dev          # Запустити фронтенд (Vite)
npm run server       # Запустити backend (Express)
npm run dev:all      # Запустити фронтенд + backend
npm run seed         # Ініціалізувати базу даних
npm run build        # Build для production
npm run preview      # Preview production build
npm run lint         # Запустити ESLint
```

## 🔒 Безпека

⚠️ **ВАЖЛИВО для production:**

1. Змініть `JWT_SECRET` на складний випадковий рядок
2. Змініть `ADMIN_PASSWORD` на сильний пароль
3. Використовуйте HTTPS
4. Налаштуйте CORS для конкретних доменів
5. Додайте rate limiting
6. Використовуйте хешовані паролі
7. Регулярно оновлюйте залежності

## 🤝 Внесок

Contributions, issues та feature requests вітаються!

1. Fork проекту
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проект ліцензовано під MIT License.

## 👨‍💻 Автор

**kun3741**

- Website: https://vaysed.me

## 🙏 Подяки

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)

---
    
Зроблено з ❤️, by kun3741

