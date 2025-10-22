  import express from 'express';
  import Application from '../models/Application.js';
  import { authMiddleware as auth } from '../middleware/auth.js';

  const router = express.Router();

  // Telegram Bot Configuration
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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
      const { name, phone, email } = req.body;

      // Validation
      if (!name || !phone || !email) {
        return res.status(400).json({ 
          message: 'Будь ласка, заповніть всі поля' 
        });
      }

      // Create application
      const application = new Application({
        name,
        phone,
        email,
        status: 'new'
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
