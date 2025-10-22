import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TeamMember from './models/TeamMember.js';
import Advantage from './models/Advantage.js';
import Stats from './models/Stats.js';
import Content from './models/Content.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bulltrading');
    console.log('✅ MongoDB connected');

    // Clear existing data
    await TeamMember.deleteMany({});
    await Advantage.deleteMany({});
    await Stats.deleteMany({});
    await Content.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed Team Members
    const teamMembers = [
      {
        name: "Олександр Коваленко",
        role: "Head Trader",
        initials: "ОК",
        photo: "",
        description: "10+ років досвіду на ринках. Спеціалізується на криптовалютах та деривативах.",
        order: 0,
      },
      {
        name: "Марія Шевченко",
        role: "Senior Analyst",
        initials: "МШ",
        photo: "",
        description: "Експерт з технічного аналізу та розробки торгових стратегій.",
        order: 1,
      },
      {
        name: "Андрій Мельник",
        role: "Risk Manager",
        initials: "АМ",
        photo: "",
        description: "Фахівець з управління ризиками та оптимізації торгових портфелів.",
        order: 2,
      },
      {
        name: "Катерина Бондаренко",
        role: "Trading Coach",
        initials: "КБ",
        photo: "",
        description: "Наставник та тренер для нових членів команди. 8 років у трейдингу.",
        order: 3,
      },
    ];
    await TeamMember.insertMany(teamMembers);
    console.log('✅ Team members seeded');

    // Seed Advantages
    const advantages = [
      {
        title: "Високий дохід",
        description: "Конкурентна заробітна плата з можливістю отримання бонусів за результати торгівлі",
        icon: "TrendingUp",
        color: "text-primary",
        order: 0,
      },
      {
        title: "Фінансова стабільність",
        description: "Гарантована оплата праці, своєчасні виплати та прозора система нарахувань",
        icon: "Wallet",
        color: "text-accent",
        order: 1,
      },
      {
        title: "Професійна команда",
        description: "Робота з досвідченими трейдерами та можливість обміну знаннями",
        icon: "Users",
        color: "text-primary",
        order: 2,
      },
      {
        title: "Навчання та розвиток",
        description: "Безкоштовне навчання, тренінги та доступ до професійних інструментів аналізу",
        icon: "GraduationCap",
        color: "text-secondary",
        order: 3,
      },
      {
        title: "Гнучкий графік",
        description: "Можливість працювати віддалено та обирати зручний для себе графік роботи",
        icon: "Clock",
        color: "text-accent",
        order: 4,
      },
      {
        title: "Безпека та підтримка",
        description: "Повна юридична підтримка, безпечні умови праці та страхування",
        icon: "Shield",
        color: "text-primary",
        order: 5,
      },
    ];
    await Advantage.insertMany(advantages);
    console.log('✅ Advantages seeded');

    // Seed Stats
    const stats = [
      { value: "50+", label: "Трейдерів", order: 0 },
      { value: "5+", label: "Років на ринку", order: 1 },
      { value: "24/7", label: "Підтримка", order: 2 },
    ];
    await Stats.insertMany(stats);
    console.log('✅ Stats seeded');

    // Seed Content
    const content = [
      {
        section: "hero",
        title: "BULL",
        subtitle: "Шукаємо співробітників з України від 18 років з базовими навичками у трейдингу",
        buttonText: "Залишити заявку",
      },
      {
        section: "about",
        title: "Про",
        titleHighlight: "компанію",
        paragraph1: "<span class='text-primary font-semibold'>BULL trading</span> — це динамічна команда професійних трейдерів, які спеціалізуються на торгівлі на фінансових ринках.",
        paragraph2: "Ми пропонуємо унікальну можливість для молодих талантів з України розвивати свої навички у трейдингу та досягати фінансового успіху разом з досвідченими наставниками.",
        paragraph3: "Наша місія — створити середовище, де кожен член команди може розкрити свій потенціал, отримати професійний розвиток та досягти високих результатів на ринку.",
      },
      {
        section: "advantages",
        title: "Наші переваги",
        subtitle: "Ми створюємо найкращі умови для професійного розвитку та успішної кар'єри у трейдингу",
      },
      {
        section: "team",
        title: "Наша команда",
        subtitle: "Досвідчені професіонали, готові поділитися своїми знаннями та допомогти вам досягти успіху",
      },
      {
        section: "contact",
        title: "Стань частиною",
        titleHighlight: "команди",
        subtitle: "Заповни форму і ми зв'яжемося з тобою для обговорення деталей співпраці",
      },
      {
        section: "footer",
        description: "Професійна команда трейдерів для вашого успіху на фінансових ринках",
        phone: "+380 12 345 67 89",
        email: "info@bulltrading.com",
        instagram: "#",
        telegram: "#",
        viber: "#",
        facebook: "#",
      },
    ];
    await Content.insertMany(content);
    console.log('✅ Content seeded');

    console.log('✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

