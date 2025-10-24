  import express from 'express';
  import Application from '../models/Application.js';
  import { authMiddleware as auth } from '../middleware/auth.js';

  const router = express.Router();

  // Telegram Bot Configuration
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Validation functions
  function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, message: 'Телефон обов\'язковий' };
    }
    
    // Trim whitespace
    const trimmedPhone = phone.trim();
    
    // Remove spaces, dashes, parentheses for validation
    const cleanPhone = trimmedPhone.replace(/[\s\-()]/g, '');
    
    // Check if contains only digits and +
    if (!/^[\+\d]+$/.test(cleanPhone)) {
      return { valid: false, message: 'Телефон може містити тільки цифри та знак +' };
    }
    
    // Check Ukrainian phone format (+380XXXXXXXXX - 13 characters)
    if (cleanPhone.startsWith('+380')) {
      if (cleanPhone.length !== 13) {
        return { valid: false, message: 'Невірний формат українського номера (+380XXXXXXXXX)' };
      }
    } else if (cleanPhone.startsWith('+')) {
      // Other international numbers (up to 15 digits according to E.164)
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return { valid: false, message: 'Невірна довжина міжнародного номера (8-15 символів)' };
      }
    } else if (cleanPhone.startsWith('0')) {
      // Local format (0XXXXXXXXX - 10 digits)
      if (cleanPhone.length !== 10) {
        return { valid: false, message: 'Невірний формат номера (10 цифр)' };
      }
    } else {
      return { valid: false, message: 'Номер повинен починатися з + або 0' };
    }
    
    return { valid: true, cleaned: cleanPhone };
  }

  function validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, message: 'Email обов\'язковий' };
    }
    
    // Trim and lowercase
    const trimmedEmail = email.trim().toLowerCase();
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { valid: false, message: 'Невірний формат email' };
    }
    
    // Check maximum length (RFC 5321)
    if (trimmedEmail.length > 254) {
      return { valid: false, message: 'Email занадто довгий' };
    }
    
    // Check for Cyrillic characters
    if (/[а-яА-ЯіІїЇєЄґҐ]/.test(trimmedEmail)) {
      return { valid: false, message: 'Email не може містити кирилицю' };
    }
    
    // Check local part length (before @)
    const localPart = trimmedEmail.split('@')[0];
    if (localPart.length > 64) {
      return { valid: false, message: 'Невірний формат email' };
    }
    
    return { valid: true, cleaned: trimmedEmail };
  }

  // Function to send message to Telegram
  async function sendToTelegram(application) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram bot not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env');
      return { success: false, error: 'Telegram not configured' };
    }

    const message = `
  🎯 <b>Нова заявка на сайті BULL Trading!</b>

  👤 <b>Ім'я:</b> ${application.name}
  📱 <b>Телефон:</b> ${application.phone}
  📧 <b>Email:</b> ${application.email}

  🕐 <b>Дата:</b> ${new Date(application.createdAt).toLocaleString('uk-UA')}
  🌐 <b>IP:</b> ${application.ipAddress || 'Unknown'}
  📊 <b>User Agent:</b> ${application.userAgent?.substring(0, 50) || 'Unknown'}...
  🔗 <b>Referer:</b> ${application.referer || 'Direct'}

  #новазаявка #bulltrading
    `.trim();

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }),
        }
      );

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
      }

      return { success: true };
    } catch (error) {
      console.error('Telegram send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all applications (admin only)
  router.get('/', auth, async (req, res) => {
    try {
      const applications = await Application.find()
        .sort({ createdAt: -1 });
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single application (admin only)
  router.get('/:id', auth, async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create new application (public)
  router.post('/', async (req, res) => {
    try {
      const { name, phone, email, website } = req.body;

      // Honeypot field check - якщо заповнене, це бот
      if (website) {
        console.warn('🤖 Bot detected - honeypot field filled:', req.ip);
        // Повертаємо успішну відповідь, щоб бот не розумів що його виявлено
        return res.status(201).json({ 
          message: 'Заявку успішно надіслано!' 
        });
      }

      // Get client metadata
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent') || 'Unknown';
      const referer = req.get('referer') || req.get('referrer') || 'Direct';

      // Log submission attempt
      console.log(`📝 Application submission from IP: ${ipAddress}`);

      // Basic validation
      if (!name || !phone || !email) {
        return res.status(400).json({ 
          message: 'Будь ласка, заповніть всі поля' 
        });
      }

      // Validate name
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return res.status(400).json({ 
          message: 'Ім\'я повинно містити мінімум 2 символи' 
        });
      }
      if (trimmedName.length > 100) {
        return res.status(400).json({ 
          message: 'Ім\'я занадто довге' 
        });
      }

      // Validate phone
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
        return res.status(400).json({ 
          message: phoneValidation.message 
        });
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({ 
          message: emailValidation.message 
        });
      }

      // Check for duplicate submissions from same IP in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentSubmissions = await Application.countDocuments({
        ipAddress: ipAddress,
        createdAt: { $gte: oneHourAgo }
      });

      if (recentSubmissions >= 2) {
        console.warn(`⚠️ Multiple submissions detected from IP: ${ipAddress}`);
        return res.status(429).json({ 
          message: 'Ви вже відправили заявку. Будь ласка, зачекайте перед наступною відправкою.' 
        });
      }

      // Create application with validated and cleaned data
      const application = new Application({
        name: trimmedName,
        phone: phoneValidation.cleaned,
        email: emailValidation.cleaned,
        status: 'new',
        ipAddress: ipAddress,
        userAgent: userAgent,
        referer: referer,
        submissionCount: recentSubmissions + 1
      });

      await application.save();

      // Send to Telegram
      const telegramResult = await sendToTelegram(application);
      
      if (telegramResult.success) {
        application.telegramSent = true;
      } else {
        application.telegramError = telegramResult.error;
      }
      
      await application.save();

      res.status(201).json({ 
        message: 'Заявку успішно надіслано!',
        application: {
          id: application._id,
          telegramSent: application.telegramSent
        }
      });
    } catch (error) {
      console.error('Application creation error:', error);
      res.status(500).json({ message: 'Помилка при надсиланні заявки' });
    }
  });

  // Update application status (admin only)
  router.put('/:id', auth, async (req, res) => {
    try {
      const { status, notes } = req.body;
      
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      if (status) application.status = status;
      if (notes !== undefined) application.notes = notes;

      await application.save();
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete application (admin only)
  router.delete('/:id', auth, async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      await Application.findByIdAndDelete(req.params.id);
      res.json({ message: 'Application deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Resend to Telegram (admin only)
  router.post('/:id/resend', auth, async (req, res) => {
    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      const telegramResult = await sendToTelegram(application);
      
      application.telegramSent = telegramResult.success;
      application.telegramError = telegramResult.error || null;
      await application.save();

      res.json({ 
        success: telegramResult.success,
        message: telegramResult.success 
          ? 'Відправлено в Telegram!' 
          : 'Помилка відправки',
        error: telegramResult.error
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  export default router;
