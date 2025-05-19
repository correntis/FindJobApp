import mongoose from "mongoose";
import { faker } from "@faker-js/faker/locale/ru";
import * as bcrypt from "bcrypt";
import { User, UserSchema } from "./dist/src/schemas/user.schema.js";
import { Company, CompanySchema } from "./dist/src/schemas/company.schema.js";
import { Resume, ResumeSchema } from "./dist/src/schemas/resume.schema.js";
import { Vacancy, VacancySchema } from "./dist/src/schemas/vacancy.schema.js";
import {
  Application,
  ApplicationSchema,
} from "./dist/src/schemas/application.schema.js";
import { ApplicationStatus } from "./dist/src/enums/applications-status.enum.js";

// Компиляция моделей
const UserModel = mongoose.model("User", UserSchema);
const CompanyModel = mongoose.model("Company", CompanySchema);
const ResumeModel = mongoose.model("Resume", ResumeSchema);
const VacancyModel = mongoose.model("Vacancy", VacancySchema);
const ApplicationModel = mongoose.model("Application", ApplicationSchema);

  const vacancyTags = [
    "Удалённая работа",
    "Гибкий график",
    "Полная занятость",
    "Частичная занятость",
    "Стажировка",
    "Без опыта",
    "Опыт от 1 года",
    "Опыт от 3 лет",
    "Опыт от 5 лет",
    "Начальный уровень",
    "Средний уровень",
    "Старший специалист",
    "Руководитель",
    "Тимлид",
    "Директор",
    "ИТ",
    "Маркетинг",
    "Продажи",
    "Финансы",
    "Бухгалтерия",
    "Логистика",
    "Транспорт",
    "Образование",
    "Наука",
    "Администрирование",
    "Производство",
    "Инженерия",
    "Строительство",
    "Медицина",
    "Фармацевтика",
    "HR",
    "Рекрутинг",
    "Копирайтинг",
    "Дизайн",
    "UI/UX",
    "Государственный сектор",
    "НКО",
    "Юриспруденция",
    "Аналитика",
    "Контент-менеджмент",
    "Техническая поддержка",
    "Обслуживание",
    "Туризм",
    "Гостиницы",
    "Рестораны",
    "Агросфера",
    "Автомобильный бизнес",
    "Ритейл",
    "Электроника",
    "Энергетика",
    "Клиентский сервис",
    "Call-центр",
    "E-commerce",
    "CRM",
    "ERP",
    "1С",
    "SQL",
    "JavaScript",
    "Python",
    "C#",
    "Java",
    "Excel",
    "Power BI",
    "Photoshop",
    "Illustrator",
    "AutoCAD",
    "SolidWorks",
    "СММ",
    "Таргетинг",
    "SEO",
    "PPC",
    "Google Ads",
    "Yandex Direct",
    "Методология Agile",
    "Scrum",
    "Kanban",
    "Офис",
    "Полевая работа",
    "Командировки",
    "Гибридный формат",
    "Работа в команде",
    "Самостоятельная работа",
    "Международная компания",
    "Малый бизнес",
    "Стартап",
    "Крупная компания",
    "Карьерный рост",
    "Обучение",
    "Бонусы",
    "ДМС",
    "Корпоративная культура",
    "Бесплатное питание",
    "Спортзал",
    "Оплата мобильной связи",
    "Компенсация проезда",
  ];

  const vacancySkills = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "PHP", "Go", "Ruby", "Swift",
  "HTML", "CSS", "SASS", "LESS", "React", "Angular", "Vue.js", "Next.js", "Node.js", "Express.js",
  "NestJS", "ASP.NET", "Spring", "Django", "Flask", "Laravel", "MySQL", "PostgreSQL", "MongoDB", "Redis",
  "Docker", "Kubernetes", "Nginx", "Git", "GitHub", "GitLab", "Bitbucket", "CI/CD", "Jenkins", "Ansible",
  "Linux", "Bash", "PowerShell", "AWS", "Azure", "Google Cloud", "Firebase", "REST API", "GraphQL", "gRPC",
  "Webpack", "Vite", "Rollup", "JIRA", "Trello", "Figma", "Photoshop", "Illustrator", "3ds Max", "Blender",
  "Unity", "Unreal Engine", "WordPress", "Shopify", "SEO", "Google Analytics", "Yandex Metrica", "SMM", "PPC",
  "Excel", "Power BI", "Tableau", "1C:Предприятие", "Командная строка", "Алгоритмы", "Структуры данных", "ООП", "SOLID",
  "Анализ требований", "Тестирование", "Unit-тесты", "Интеграционные тесты", "Postman", "Swagger", "Agile", "Scrum", "Kanban",
  "Управление проектами", "Бюджетирование", "Финансовый анализ", "Продажи", "Холодные звонки", "Договорная работа", "Деловая переписка", "MS Office", "Time management", "Critical thinking",
  "Английский язык", "Немецкий язык", "Французский язык", "Коммуникация", "Презентации", "Обучение других", "Аналитическое мышление", "Креативность", "Ответственность", "Стрессоустойчивость"
];

const vacancyRequirements = [
  "Опыт коммерческой разработки от 1 года",
  "Уверенные знания JavaScript и TypeScript",
  "Понимание принципов ООП и SOLID",
  "Опыт работы с Angular или React",
  "Знание HTML, CSS, адаптивной вёрстки",
  "Опыт работы с REST API и WebSocket",
  "Навыки работы с Git и системой контроля версий",
  "Умение работать в команде",
  "Опыт работы с Docker и контейнеризацией",
  "Знание баз данных (SQL/NoSQL)",
  "Опыт написания unit- и e2e-тестов",
  "Навыки работы с CI/CD",
  "Знание английского языка на уровне чтения документации",
  "Способность быстро обучаться",
  "Опыт работы по Agile/Scrum методологиям",
  "Хорошие коммуникативные навыки",
  "Знание архитектуры клиент-серверных приложений",
  "Умение работать с чужим кодом",
  "Желание развиваться и изучать новое",
  "Опыт настройки и сопровождения серверов",
  "Умение писать чистый и поддерживаемый код",
  "Опыт работы с Vue.js будет плюсом",
  "Знание принципов работы браузера",
  "Опыт написания документации",
  "Знание английского на уровне B1 и выше",
  "Опыт работы с системами логирования и мониторинга",
  "Понимание микросервисной архитектуры",
  "Опыт работы с GraphQL будет преимуществом",
  "Понимание жизненного цикла ПО",
  "Умение работать в условиях многозадачности",
  "Знание паттернов проектирования",
  "Опыт управления задачами через JIRA или аналог",
  "Умение быстро находить и устранять баги",
  "Базовые знания Linux",
  "Опыт работы с backend-фреймворками",
  "Понимание асинхронности и event loop",
  "Готовность к самостоятельной работе",
  "Умение формулировать и решать технические задачи",
  "Опыт работы с командой дизайнеров",
  "Готовность к ревью и обсуждению кода",
  "Базовые знания DevOps-инструментов",
  "Опыт миграции проектов",
  "Знание системы модулей ES6+",
  "Опыт работы с Webpack или Vite",
  "Понимание архитектуры SPA",
  "Навыки профилирования и оптимизации",
  "Знание английского на разговорном уровне — плюс",
  "Способность давать и принимать обратную связь",
  "Навыки технического лидерства приветствуются",
  "Опыт публичных выступлений будет плюсом",
  "Опыт интеграции сторонних API",
  "Опыт работы в удалённой команде",
  "Умение работать по дедлайнам",
  "Понимание UX/UI принципов",
  "Опыт настройки окружения разработки",
  "Участие в open-source проектах будет плюсом",
  "Навыки написания автотестов",
  "Способность декомпозировать задачи",
  "Готовность к менторству младших коллег",
  "Опыт участия в архитектурных решениях",
  "Опыт использования шаблонов проектирования",
  "Базовые знания алгоритмов и структур данных",
  "Опыт релизов и выкладки в продакшн",
  "Гибкость в подходах к решению задач",
  "Опыт работы в международной команде",
  "Опыт оценки трудозатрат по задачам",
  "Умение читать и понимать чужой код",
  "Знание основ безопасности веб-приложений",
  "Опыт рефакторинга устаревшего кода",
  "Навыки проведения интервью — плюс",
  "Навыки ведения технической документации",
  "Готовность пройти техническое собеседование",
  "Знание популярных библиотек и фреймворков",
  "Опыт работы с message broker'ами (RabbitMQ, Kafka)",
  "Навыки работы с системами сборки и деплоя",
  "Понимание клиент-серверного взаимодействия",
  "Желание работать в динамичной среде",
  "Умение работать с legacy-кодом",
  "Знание принципов функционального программирования",
  "Опыт проектирования баз данных",
  "Опыт настройки кэширования",
  "Готовность писать автотесты",
  "Опыт использования аналитики и метрик",
  "Навыки оценки и управления рисками",
  "Опыт сопровождения проектов в проде",
  "Базовые знания UX-исследований",
  "Навыки ведения документации в Confluence",
  "Знание API браузеров",
  "Умение строить архитектуру приложения",
  "Навыки логирования и трассировки ошибок",
  "Умение эффективно работать с тайм-менеджментом",
  "Желание делиться знаниями",
  "Готовность к командировкам (по необходимости)",
  "Навыки ведения технических обсуждений",
  "Способность адаптироваться к новым условиям",
  "Интерес к современным технологиям",
  "Опыт работы с монолитами и микросервисами",
  "Базовое понимание DevSecOps",
  "Опыт внедрения CI/CD процессов",
  "Опыт работы с системами контроля версий",
  "Готовность к обучению и развитию",
  "Стремление к высокому качеству кода"
];

const educationInstitutions = [
  "МГУ имени М.В. Ломоносова",
  "СПбГУ",
  "МГТУ им. Н.Э. Баумана",
  "НГУ (Новосибирский государственный университет)",
  "НИУ ВШЭ",
  "УрФУ (Уральский федеральный университет)",
  "КФУ (Казанский федеральный университет)",
  "ДВФУ (Дальневосточный федеральный университет)",
  "СФУ (Сибирский федеральный университет)",
  "ЮФУ (Южный федеральный университет)",
  "ТГУ (Томский государственный университет)",
  "ТПУ (Томский политехнический университет)",
  "МИФИ (НИЯУ МИФИ)",
  "МЭИ (Московский энергетический институт)",
  "МИЭТ",
  "РТУ МИРЭА",
  "МГИМО",
  "РАНХиГС",
  "Московский авиационный институт",
  "Московский архитектурный институт",
  "Московский государственный лингвистический университет",
  "Российский университет дружбы народов (РУДН)",
  "Российский государственный гуманитарный университет (РГГУ)",
  "Финансовый университет при Правительстве РФ",
  "Московский педагогический государственный университет",
  "ГИТИС",
  "ВГИК",
  "Санкт-Петербургский политехнический университет Петра Великого",
  "СПбГЭУ (ФИНЭК)",
  "СПбГТИ (Технический университет)",
  "СПбГАСУ (Архитектурно-строительный университет)",
  "БГТУ «Военмех»",
  "Московский институт электронной техники",
  "Национальный исследовательский университет ИТМО",
  "Институт космических исследований РАН",
  "Институт физики полупроводников СО РАН",
  "Ярославский государственный университет",
  "Пермский государственный университет",
  "Омский государственный технический университет",
  "Самарский государственный аэрокосмический университет",
  "Челябинский государственный университет",
  "Воронежский государственный университет",
  "АлтГУ (Алтайский государственный университет)",
  "Саратовский государственный университет",
  "БФУ им. Канта",
  "Кемеровский государственный университет",
  "Иркутский государственный университет",
  "Тюменский государственный университет",
  "Волгоградский государственный технический университет",
  "Севастопольский государственный университет",
  "МГППУ (психолого-педагогический университет)",
  "Институт международных отношений",
  "Московская высшая школа экономики",
  "Институт стали и сплавов (МИСиС)",
  "Российский государственный геологоразведочный университет",
  "Институт управления и права",
  "Институт предпринимательства и сервиса",
  "Институт математики и информатики",
  "Институт экономики и финансов",
  "Институт кибернетики",
  "Институт искусств и дизайна",
  "Тверской государственный университет",
  "Рязанский государственный университет",
  "Брянский государственный технический университет",
  "Смоленский государственный университет",
  "Мурманский арктический университет",
  "Архангельский технический университет",
  "Петрозаводский государственный университет",
  "Чувашский государственный университет",
  "Башкирский государственный университет",
  "Удмуртский государственный университет",
  "Марийский государственный университет",
  "Калужский филиал МГТУ",
  "Кубанский государственный университет",
  "Краснодарский университет МВД",
  "Ростовский государственный экономический университет",
  "Таганрогский радиотехнический институт",
  "Астраханский государственный технический университет",
  "Грозненский государственный нефтяной университет",
  "Кабардино-Балкарский госуниверситет",
  "Дагестанский государственный университет",
  "Владимирский государственный университет",
  "Костромской государственный университет",
  "Ивановский государственный химико-технологический университет",
  "Тульский государственный университет",
  "Орловский государственный университет",
  "Оренбургский государственный университет",
  "Ставропольский государственный аграрный университет",
  "Белгородский государственный университет",
  "Курский государственный университет",
  "Новгородский государственный университет",
  "Псковский государственный университет",
  "Московская академия экономики и права",
  "Институт прикладной математики РАН",
  "Институт экономики и управления в промышленности",
  "Открытый университет",
  "Российский новый университет",
  "Московский технологический институт",
  "Российский университет транспорта (МИИТ)",
  "Российская академия народного хозяйства",
  "Университет Иннополис",
  "Университет Лобачевского",
  "Политехнический институт МАИ",
  "Академия Яндекса"
];



async function seed() {
  await mongoose.connect(
    "mongodb://root:password@localhost:27017/test?authSource=admin&authMechanism=SCRAM-SHA-1"
  );
  console.log("Connected to MongoDB");

  // Очистка
  await Promise.all([
    ApplicationModel.deleteMany(),
    VacancyModel.deleteMany(),
    ResumeModel.deleteMany(),
    CompanyModel.deleteMany(),
    UserModel.deleteMany(),
  ]);

  const users = [];

  const defaultUser = new UserModel({
    email: "user@example.com",
    passwordHash: await bcrypt.hash("string", 10),
    role: "User",
    firstName: "Максим",
    lastName: "Русецкий",
  });

  const defaultCompanyUser = new UserModel({
    email: "comp@example.com",
    passwordHash: await bcrypt.hash("string", 10),
    role: "Company",
    firstName: "МаксимК",
    lastName: "РусецкийК",
  });

  users.push(await defaultUser.save());
  users.push(await defaultCompanyUser.save());

  // 1) Генерируем пользователей с ролями User/Company
  const totalUsers = 150;
  for (let i = 0; i < totalUsers; i++) {
    const role = faker.helpers.arrayElement(["User", "Company"]);
    const user = new UserModel({
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      role,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
    users.push(await user.save());
  }

  // Разделяем по ролям
  const userRoleUsers = users.filter((u) => u.role === "User");
  const userRoleCompanies = users.filter((u) => u.role === "Company");

  // 2) Генерируем компании: одна компания на пользователя с ролью Company
  const companies = [];
  for (const owner of userRoleCompanies) {
    const company = new CompanyModel({
      userId: owner._id,
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      industry: faker.commerce.department(),
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      phone: faker.phone.number("+375 (44) ###-##-##"),
      email: faker.internet.email(),
      webSite: faker.internet.url(),
    });
    companies.push(await company.save());
  }

  // 3) Генерируем резюме: одно резюме на пользователя с ролью User
  const resumes = [];
  for (const user of userRoleUsers) {
    const exps = Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) },
      () => ({
        jobTitle: faker.person.jobTitle(),
        years: faker.number.int({ min: 1, max: 4 }),
      })
    );
    const langs = Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => ({
        name: faker.helpers.arrayElement([
          "Русский",
          "Английский",
          "Немецкий",
          "Французский",
        ]),
        level: faker.helpers.arrayElement(["A1", "A2", "B1", "B2", "C1", "C2"]),
      })
    );

    const resume = new ResumeModel({
      userId: user._id,
      title: faker.person.jobTitle(),
      summary: faker.lorem.sentences(3),
      educations: faker.helpers.arrayElements(educationInstitutions, faker.number.int({min: 2, max: 5})),
      experiences: exps,
      tags: faker.helpers.arrayElements(vacancyTags, faker.number.int({min: 2, max: 5})),
      skills: faker.helpers.arrayElements(vacancySkills, faker.number.int({min: 3, max: 6})),
      languages: langs,
    });
    resumes.push(await resume.save());
  }

  // 4) Генерируем вакансии для компаний





  const vacancies = [];
  const totalVacancies = 500;
  for (let i = 0; i < totalVacancies; i++) {
    const company = faker.helpers.arrayElement(companies);
    const exLevel = {
      min: faker.number.int({ min: 0, max: 2 }),
      max: faker.number.int({ min: 3, max: 10 }),
    };
    const salary = {
      min: faker.number.int({ min: 30000, max: 70000 }),
      max: faker.number.int({ min: 70000, max: 200000 }),
    };
    const langsReq = Array.from(
      { length: faker.number.int({ min: 1, max: 3 }) },
      () => ({
        name: faker.helpers.arrayElement([
          "Русский",
          "Английский",
          "Немецкий",
          "Испанский",
          "Китайский",
        ]),
        level: faker.helpers.arrayElement(["A1", "A2", "B1", "B2", "C1", "C2"]),
      })
    );

    const vacancy = new VacancyModel({
      companyId: company._id,
      title: faker.person.jobTitle(),
      min_age: faker.number.int({ min: 16, max: 45 }),
      for_invalids: faker.datatype.boolean(),
      empl_type: faker.helpers.arrayElement([
        "Полное",
        "Пол ставки",
        "Контракт",
        "Стажировка",
        "Удаленно",
      ]),
      is_archived: faker.datatype.boolean(),
      requirements: faker.helpers.arrayElements(vacancyRequirements, faker.number.int({min: 5, max: 10})),
      skills: faker.helpers.arrayElements(vacancySkills, faker.number.int({min: 3, max: 6})),
      tags: faker.helpers.arrayElements(vacancyTags, faker.number.int({min: 2, max: 5})),
      salary,
      experience_level: exLevel,
      languages: langsReq,
    });
    vacancies.push(await vacancy.save());
  }

  const totalApplications = 1000;
  for (let i = 0; i < totalApplications; i++) {
    const applicant = faker.helpers.arrayElement(userRoleUsers);
    const vacancy = faker.helpers.arrayElement(vacancies);
    const application = new ApplicationModel({
      userId: applicant._id,
      vacancyId: vacancy._id,
      status: faker.helpers.arrayElement(Object.values(ApplicationStatus)),
      appliedAt: faker.date.past(1),
    });

    if (application.status === ApplicationStatus.Applied) {
      application.replyMessage = faker.lorem.sentence();
    }

    if (application.status !== ApplicationStatus.Pending) {
      application.appliedAt = faker.date.past(1);
    }

    await application.save();
  }

  console.log("Seeding done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
