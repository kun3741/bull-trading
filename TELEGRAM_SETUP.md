# 🤖 Налаштування Telegram Бота

Покрокова інструкція як налаштувати відправку заявок з сайту в Telegram.

## 📋 Зміст

1. [Створення Telegram бота](#створення-telegram-бота)
2. [Отримання Chat ID](#отримання-chat-id)
3. [Налаштування змінних середовища](#налаштування-змінних-середовища)
4. [Тестування](#тестування)
5. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Створення Telegram Бота

### Крок 1: Відкрийте BotFather

1. Відкрийте Telegram
2. Знайдіть **@BotFather** (офіційний бот для створення ботів)
3. Натисніть **Start** або напишіть `/start`

### Крок 2: Створіть нового бота

1. Надішліть команду:
```
/newbot
```

2. BotFather запитає ім'я бота. Введіть, наприклад:
```
BULL Trading Applications
```

3. Потім введіть username бота (має закінчуватись на `bot`):
```
bulltrading_applications_bot
```

### Крок 3: Збережіть токен

BotFather надішле вам повідомлення з токеном:
```
Done! Congratulations on your new bot. You will find it at t.me/bulltrading_applications_bot. 
You can now add a description...

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
```

**ВАЖЛИВО:** Скопіюйте цей токен! Це ваш `TELEGRAM_BOT_TOKEN`

---

## 2️⃣ Отримання Chat ID

Є два способи отримати Chat ID - для особистих повідомлень або для групи.

### Варіант A: Особистий Chat (рекомендовано для початку)

1. Знайдіть **@userinfobot** в Telegram
2. Натисніть **Start**
3. Бот надішле ваш Chat ID, наприклад:
```
Id: 123456789
```

Це ваш `TELEGRAM_CHAT_ID`

### Варіант B: Груповий Chat (для команди)

1. Створіть нову групу в Telegram
2. Додайте вашого бота до групи:
   - Натисніть на назву групи → Add members
   - Знайдіть вашого бота за username
   - Додайте його

3. Додайте **@userinfobot** до тієї ж групи

4. @userinfobot надішле Chat ID групи:
```
Chat:
Id: -1001234567890
Type: supergroup
Title: BULL Trading Team
```

Скопіюйте **Id** (включаючи мінус, якщо є). Це ваш `TELEGRAM_CHAT_ID`

5. **Важливо:** Видаліть @userinfobot з групи після отримання ID

6. Переконайтеся що ваш бот є адміністратором групи:
   - Група → Manage → Administrators
   - Додайте вашого бота як адміна

---

## 3️⃣ Налаштування змінних середовища

### Для локальної розробки

1. Створіть файл `.env` в корені проекту (якщо його немає)

2. Додайте змінні:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
TELEGRAM_CHAT_ID=123456789
```

Замініть значення на ваші реальні дані!

### Для production (Render)

1. Відкрийте ваш Web Service на Render.com
2. Перейдіть до **Environment** → **Environment Variables**
3. Додайте дві змінні:

| Key | Value |
|-----|-------|
| `TELEGRAM_BOT_TOKEN` | `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890` |
| `TELEGRAM_CHAT_ID` | `123456789` |

4. Натисніть **Save Changes**
5. Render автоматично перезапустить сервер

---

## 4️⃣ Тестування

### Локальне тестування

1. Переконайтеся що backend запущено:
```bash
npm run server
```

2. Відкрийте сайт: http://localhost:8080

3. Прокрутіть до форми "Стань частиною команди"

4. Заповніть форму:
   - Ім'я: Тест
   - Телефон: +380123456789
   - Email: test@example.com

5. Натисніть **"Відправити заявку"**

6. Перевірте Telegram:
   - Відкрийте особистий чат з ботом (або групу)
   - Повинно прийти повідомлення:

```
🎯 Нова заявка на сайті BULL Trading!

👤 Ім'я: Тест
📱 Телефон: +380123456789
📧 Email: test@example.com

🕐 Дата: 22.10.2025, 14:30

#новазаявка #bulltrading
```

### Перевірка в адмін панелі

1. Увійдіть в адмін панель: http://localhost:8080/admin/login
   - Логін: `admin`
   - Пароль: `admin123`

2. Перейдіть до **Заявки**

3. Знайдіть вашу тестову заявку

4. Перевірте статус Telegram:
   - ✅ Зелений badge "Відправлено" - все працює!
   - ❌ Червоний badge - є проблема (див. Troubleshooting)

5. Якщо є помилка, спробуйте натиснути кнопку **📤 Telegram** для повторної відправки

---

## 5️⃣ Troubleshooting

### Помилка: "Telegram not configured"

**Проблема:** Не налаштовані змінні середовища

**Рішення:**
1. Перевірте файл `.env`
2. Переконайтеся що `TELEGRAM_BOT_TOKEN` та `TELEGRAM_CHAT_ID` заповнені
3. Перезапустіть сервер: `npm run server`

---

### Помилка: "Unauthorized"

**Проблема:** Невірний токен бота

**Рішення:**
1. Перевірте `TELEGRAM_BOT_TOKEN` в `.env`
2. Токен має бути у форматі: `NUMBER:STRING`
3. Приклад: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
4. Отримайте новий токен від @BotFather якщо потрібно:
   ```
   /mybots
   → Виберіть вашого бота
   → API Token
   → Revoke current token (якщо потрібно)
   ```

---

### Помилка: "Bad Request: chat not found"

**Проблема:** Невірний Chat ID або бот не має доступу

**Рішення:**

**Для особистого чату:**
1. Відкрийте чат з вашим ботом
2. Натисніть **Start** (це дає боту дозвіл писати вам)
3. Перевірте Chat ID через @userinfobot

**Для групи:**
1. Переконайтеся що бот додано до групи
2. Зробіть бота адміністратором групи
3. Chat ID групи має починатись з мінуса: `-1001234567890`
4. Перевірте що використовуєте правильний ID

---

### Помилка: "Forbidden: bot was blocked by the user"

**Проблема:** Ви заблокували бота

**Рішення:**
1. Знайдіть вашого бота в Telegram
2. Розблокуйте його
3. Натисніть **Start**

---

### Заявка зберігається, але не приходить в Telegram

**Діагностика:**

1. Перевірте логи сервера:
```bash
npm run server
```
Шукайте повідомлення типу: `Telegram send error:...`

2. Перевірте статус у базі даних:
   - Зайдіть в адмін панель → Заявки
   - Перегляньте деталі заявки
   - Якщо `telegramError` не пустий - там буде опис помилки

3. Спробуйте повторну відправку:
   - Відкрийте заявку в адмін панелі
   - Натисніть кнопку **📤 Telegram**
   - Перевірте результат

---

### Тестування через curl

Перевірте чи працює Telegram API напряму:

```bash
# Замініть YOUR_BOT_TOKEN та YOUR_CHAT_ID
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"YOUR_CHAT_ID","text":"Test message"}'
```

Якщо отримаєте:
```json
{"ok":true,"result":{...}}
```
То Telegram налаштовано правильно, проблема в коді.

Якщо отримаєте помилку - дивіться опис помилки в `description`.

---

## 📱 Додаткові налаштування

### Форматування повідомлень

Повідомлення використовують HTML formatting. Ви можете змінити шаблон в файлі:
```
server/routes/applications.js
```

У функції `sendToTelegram`:
```javascript
const message = `
🎯 <b>Нова заявка на сайті BULL Trading!</b>

👤 <b>Ім'я:</b> ${application.name}
📱 <b>Телефон:</b> ${application.phone}
📧 <b>Email:</b> ${application.email}

🕐 <b>Дата:</b> ${new Date(application.createdAt).toLocaleString('uk-UA')}

#новазаявка #bulltrading
`.trim();
```

Доступні теги:
- `<b>текст</b>` - жирний
- `<i>текст</i>` - курсив
- `<code>текст</code>` - моноширинний
- `<a href="url">текст</a>` - посилання

---

### Додавання кнопок

Можете додати inline кнопки до повідомлення:

```javascript
body: JSON.stringify({
  chat_id: TELEGRAM_CHAT_ID,
  text: message,
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        { 
          text: '✅ Прийняти', 
          callback_data: `accept_${application._id}` 
        },
        { 
          text: '❌ Відхилити', 
          callback_data: `reject_${application._id}` 
        }
      ]
    ]
  }
}),
```

**Примітка:** Для обробки callback потрібен webhook handler.

---

### Множинні отримувачі

Щоб надсилати в кілька чатів:

```javascript
const TELEGRAM_CHAT_IDS = [
  '123456789',    // Chat 1
  '-1001234567890', // Chat 2 (група)
];

for (const chatId of TELEGRAM_CHAT_IDS) {
  await fetch(..., {
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    })
  });
}
```

---

## 🎯 Корисні команди BotFather

```
/mybots          - Список ваших ботів
/setdescription  - Встановити опис бота
/setabouttext    - Встановити текст "About"
/setuserpic      - Встановити аватар
/setcommands     - Встановити команди бота
/deletebot       - Видалити бота
```

---

## 📚 Корисні посилання

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#6-botfather)
- [Telegram Bot Examples](https://core.telegram.org/bots/samples)

---

## ✅ Чеклист налаштування

- [ ] Створено бота через @BotFather
- [ ] Отримано `TELEGRAM_BOT_TOKEN`
- [ ] Отримано `TELEGRAM_CHAT_ID`
- [ ] Додано змінні в `.env` (локально)
- [ ] Додано змінні на Render (production)
- [ ] Натиснуто **Start** у боті (для особистого чату)
- [ ] Або додано бота до групи та зроблено адміном
- [ ] Перезапущено сервер
- [ ] Протестовано відправку форми
- [ ] Отримано повідомлення в Telegram
- [ ] Перевірено статус у адмін панелі

---

**Готово! Тепер всі заявки з сайту будуть автоматично надсилатись в Telegram! 🎉**

