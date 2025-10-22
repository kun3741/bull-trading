# 🚀 Інструкція по деплою на Render

Повне керівництво по розгортанню BULL Trading сайту на Render.com

## 📋 Зміст

1. [Підготовка](#підготовка)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Деплой Backend на Render](#деплой-backend-на-render)
4. [Деплой Frontend на Render](#деплой-frontend-на-render)
5. [Налаштування Telegram](#налаштування-telegram)
6. [Налаштування доменів](#налаштування-доменів)
7. [Поради по оптимізації](#поради-по-оптимізації)

---

## 1️⃣ Підготовка

### Що вам потрібно:
- ✅ GitHub акаунт
- ✅ Render акаунт (безкоштовний)
- ✅ MongoDB Atlas акаунт (безкоштовний)

### Підготовка коду:

1. **Створіть GitHub репозиторій**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bulltrading.git
git push -u origin main
```

2. **Оновіть package.json для production**

Переконайтеся що є ці скрипти:
```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "build": "vite build",
    "preview": "vite preview",
    "seed": "node server/seed.js",
    "start": "node server/index.js"
  }
}
```

3. **Створіть `.gitignore`** (якщо немає)
```
node_modules/
dist/
.env
.DS_Store
*.log
```

---

## 2️⃣ MongoDB Atlas Setup

### Крок 1: Створення кластеру

1. Перейдіть на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Зареєструйтесь або увійдіть
3. Натисніть **"Build a Database"**
4. Виберіть **FREE tier (M0)**
5. Виберіть регіон closest to your users (наприклад, Frankfurt для Європи)
6. Назвіть кластер: `bulltrading-cluster`
7. Натисніть **"Create"**

### Крок 2: Налаштування доступу

1. **Database Access** (ліва панель)
   - Натисніть **"Add New Database User"**
   - Username: `bulltrading_user`
   - Password: згенеруйте сильний пароль (збережіть його!)
   - Database User Privileges: **Read and write to any database**
   - **Add User**

2. **Network Access** (ліва панель)
   - Натисніть **"Add IP Address"**
   - Натисніть **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Це потрібно для Render
   - **Confirm**

### Крок 3: Отримання Connection String

1. Повернтесь до **Database** → **Connect**
2. Виберіть **"Connect your application"**
3. Driver: **Node.js**
4. Version: **5.5 or later**
5. Скопіюйте connection string:
```
mongodb+srv://bulltrading_user:<password>@bulltrading-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
6. Замініть `<password>` на ваш реальний пароль
7. Додайте назву бази після `.net/`: 
```
mongodb+srv://bulltrading_user:PASSWORD@cluster.xxxxx.mongodb.net/bulltrading?retryWrites=true&w=majority
```

---

## 3️⃣ Деплой Backend на Render

### Крок 1: Створення Web Service

1. Увійдіть на [Render.com](https://render.com)
2. Dashboard → **New +** → **Web Service**
3. Підключіть GitHub репозиторій
4. Дайте дозвіл Render читати ваші репо
5. Виберіть ваш репозиторій `bulltrading`

### Крок 2: Налаштування Backend Service

**Заповніть форму:**

| Поле | Значення |
|------|----------|
| **Name** | `bulltrading-backend` |
| **Region** | Frankfurt (EU Central) |
| **Branch** | `main` |
| **Root Directory** | (залиште порожнім) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run server` |
| **Instance Type** | `Free` |

### Крок 3: Змінні середовища (Environment Variables)

Натисніть **"Advanced"** і додайте:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://bulltrading_user:PASSWORD@cluster.xxxxx.mongodb.net/bulltrading?retryWrites=true&w=majority` |
| `PORT` | `5000` |
| `JWT_SECRET` | `your_super_secret_jwt_key_at_least_32_characters_long` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `your_secure_password_here` |
| `NODE_ENV` | `production` |
| `TELEGRAM_BOT_TOKEN` | `your_telegram_bot_token` (опціонально) |
| `TELEGRAM_CHAT_ID` | `your_telegram_chat_id` (опціонально) |

⚠️ **ВАЖЛИВО:** 
- Використовуйте сильні паролі!
- JWT_SECRET має бути мінімум 32 символи
- Telegram змінні опціональні - дивіться [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

### Крок 4: Deploy

1. Натисніть **"Create Web Service"**
2. Render почне build процес
3. Зачекайте 3-5 хвилин
4. Ваш backend буде доступний на: `https://bulltrading-backend.onrender.com`

### Крок 5: Ініціалізація бази даних

Після успішного деплою:

1. Відкрийте **Shell** в Render dashboard
2. Запустіть seed скрипт:
```bash
npm run seed
```

Або через API:
```bash
curl -X POST https://bulltrading-backend.onrender.com/api/seed
```

---

## 4️⃣ Деплой Frontend на Render

### Крок 1: Оновіть API URL

**Створіть файл `.env.production`:**
```env
VITE_API_URL=https://bulltrading-backend.onrender.com/api
```

**Або оновіть `src/lib/api.ts`:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD 
                  ? 'https://bulltrading-backend.onrender.com/api'
                  : '/api');
```

Commit і push:
```bash
git add .
git commit -m "Add production API URL"
git push
```

### Крок 2: Створення Static Site

1. Render Dashboard → **New +** → **Static Site**
2. Виберіть той самий GitHub репозиторій
3. Налаштуйте:

| Поле | Значення |
|------|----------|
| **Name** | `bulltrading-frontend` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Крок 3: Environment Variables (Frontend)

Додайте:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://bulltrading-backend.onrender.com/api` |

### Крок 4: Deploy

1. Натисніть **"Create Static Site"**
2. Зачекайте build
3. Ваш сайт буде на: `https://bulltrading-frontend.onrender.com`

---

## 5️⃣ Налаштування Telegram

### Навіщо це потрібно?

Telegram інтеграція дозволяє автоматично отримувати заявки з сайту прямо в Telegram бот або групу.

### Швидке налаштування

1. **Створіть бота:**
   - Відкрийте [@BotFather](https://t.me/BotFather) в Telegram
   - Надішліть `/newbot`
   - Введіть ім'я: `BULL Trading Applications`
   - Введіть username: `bulltrading_app_bot`
   - Збережіть токен: `1234567890:ABCdef...`

2. **Отримайте Chat ID:**
   - Відкрийте [@userinfobot](https://t.me/userinfobot)
   - Натисніть Start
   - Скопіюйте ваш Chat ID: `123456789`

3. **Додайте змінні на Render:**
   - Backend Service → Environment
   - Add Environment Variable:
     - `TELEGRAM_BOT_TOKEN`: ваш токен
     - `TELEGRAM_CHAT_ID`: ваш chat ID
   - Save Changes

4. **Готово!** Тепер всі заявки з сайту будуть надходити в Telegram.

### Детальна інструкція

Для повної покрокової інструкції з troubleshooting та додатковими можливостями дивіться:
📖 [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

### Груповий чат (для команди)

Якщо хочете отримувати заявки в групу:

1. Створіть групу в Telegram
2. Додайте вашого бота до групи
3. Зробіть бота адміністратором
4. Додайте @userinfobot до групи
5. Скопіюйте Group Chat ID (починається з `-`)
6. Видаліть @userinfobot
7. Використовуйте Group Chat ID в `TELEGRAM_CHAT_ID`

---

## 6️⃣ Налаштування доменів

### Використання власного домену

#### На Render:

1. **Backend:**
   - Settings → Custom Domain
   - Додайте: `api.yourdomain.com`
   - Налаштуйте DNS (CNAME):
     ```
     api.yourdomain.com → bulltrading-backend.onrender.com
     ```

2. **Frontend:**
   - Settings → Custom Domain
   - Додайте: `yourdomain.com` та `www.yourdomain.com`
   - Налаштуйте DNS:
     ```
     yourdomain.com → bulltrading-frontend.onrender.com (A record)
     www.yourdomain.com → bulltrading-frontend.onrender.com (CNAME)
     ```

#### Оновіть API URL:

Після налаштування домену, оновіть `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 7️⃣ Поради по оптимізації

### Backend

1. **CORS налаштування**
```javascript
// server/index.js
app.use(cors({
  origin: [
    'https://bulltrading-frontend.onrender.com',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true
}));
```

2. **Compression**
```bash
npm install compression
```
```javascript
const compression = require('compression');
app.use(compression());
```

3. **Rate Limiting**
```bash
npm install express-rate-limit
```
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Frontend

1. **Lazy Loading компонентів**
```typescript
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
```

2. **Image optimization**
- Стисніть зображення перед завантаженням
- Використовуйте WebP формат
- Lazy load images

3. **Build optimization**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
```

### MongoDB

1. **Індекси**
```javascript
// В моделях
teamMemberSchema.index({ order: 1 });
advantageSchema.index({ order: 1 });
```

2. **Connection pooling**
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});
```

---

## 🔍 Troubleshooting

### Backend не запускається

1. Перевірте logs в Render Dashboard
2. Перевірте змінні середовища
3. Перевірте MongoDB connection string

### Frontend не може з'єднатися з API

1. Перевірте CORS налаштування
2. Перевірте VITE_API_URL
3. Відкрийте DevTools → Network

### База даних порожня

Запустіть seed через Shell:
```bash
npm run seed
```

### Free tier обмеження

Render free tier:
- ⏱️ Засинає після 15 хвилин неактивності
- 🔄 Перший запит після сну займає ~30 секунд
- 💾 750 годин на місяць

**Рішення:**
- Оновіть до paid tier ($7/міс)
- Використовуйте cron job для ping кожні 10 хвилин
- Або комбінуйте з іншими платформами

---

## ✅ Чеклист деплою

**Основне:**
- [ ] MongoDB Atlas створено і налаштовано
- [ ] Connection string отримано
- [ ] Backend задеплоєно на Render
- [ ] Змінні середовища налаштовані
- [ ] База даних ініціалізована (seed)
- [ ] Frontend задеплоєно на Render
- [ ] API URL оновлено
- [ ] CORS налаштовано
- [ ] Сайт відкривається
- [ ] Адмін панель працює

**Telegram (опціонально):**
- [ ] Telegram бот створено
- [ ] TELEGRAM_BOT_TOKEN додано на Render
- [ ] TELEGRAM_CHAT_ID додано на Render
- [ ] Протестовано відправку заявки
- [ ] Повідомлення приходить в Telegram

**Додатково:**
- [ ] Власний домен налаштовано (опціонально)
- [ ] SSL сертифікат активний
- [ ] Тестування всіх функцій

---

## 🎉 Готово!

Ваш сайт тепер live на:
- 🌐 Frontend: https://bulltrading-frontend.onrender.com
- 🔌 Backend: https://bulltrading-backend.onrender.com

Адмін панель: https://bulltrading-frontend.onrender.com/admin/login

---

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте Render logs
2. Перевірте MongoDB Atlas metrics
3. Відкрийте issue на GitHub
4. Зверніться до Render Support

---

**Happy Deploying! 🚀**

