# Швидкий Старт 🚀

## Крок 1: Встановіть MongoDB

### Windows:
1. Завантажте MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Встановіть з налаштуваннями за замовчуванням
3. MongoDB автоматично запуститься як служба

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Крок 2: Створіть файл .env

Створіть файл `.env` у корені проекту з таким вмістом:

```env
MONGODB_URI=mongodb://localhost:27017/bulltrading
PORT=5000
JWT_SECRET=your_super_secret_key_12345
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Крок 3: Ініціалізуйте базу даних

```bash
npm run seed
```

## Крок 4: Запустіть проект

```bash
npm run dev:all
```

Це запустить і фронтенд (порт 8080) і backend (порт 5000) одночасно.

## Крок 5: Відкрийте сайт

- **Головна сторінка:** http://localhost:8080
- **Адмін панель:** http://localhost:8080/admin/login

### Дані для входу в адмін панель:
- **Логін:** admin
- **Пароль:** admin123

## Що можна робити в адмін панелі? 🎨

1. **Команда** - Додавати/редагувати/видаляти членів команди
2. **Контент** - Змінювати всі тексти на сайті
3. **Переваги** - Управляти перевагами компанії (створюється автоматично при seed)
4. **Статистика** - Змінювати цифри статистики (створюється автоматично при seed)

## Як це працює? 🔧

1. Весь контент зберігається в MongoDB
2. Фронтенд отримує дані через API
3. Адмін панель дозволяє змінювати контент
4. Зміни одразу відображаються на сайті після оновлення сторінки

## Проблеми? 🐛

### MongoDB не запускається
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Порти зайняті
Змініть порти у файлах:
- Frontend: `vite.config.ts` (port: 8080)
- Backend: `.env` (PORT=5000)

### Помилка при seed
Переконайтесь що MongoDB запущено:
```bash
mongosh  # Має підключитися без помилок
```

## Корисні команди 📝

```bash
# Запустити тільки фронтенд
npm run dev

# Запустити тільки backend
npm run server

# Запустити обидва одночасно
npm run dev:all

# Перезаповнити базу даних
npm run seed

# Build для production
npm run build
```

## Готово! ✨

Тепер ви можете:
- ✅ Переглядати сайт на http://localhost:8080
- ✅ Редагувати контент через адмін панель
- ✅ Всі зміни зберігаються в MongoDB
- ✅ Контент оновлюється в реальному часі

Насолоджуйтесь! 🎉

