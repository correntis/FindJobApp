import mongoose from "mongoose";
import { faker } from "@faker-js/faker/locale/ru";

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

async function seed() {
  await mongoose.connect(
    "mongodb://root:password@localhost:27017/test?authSource=admin&authMechanism=SCRAM-SHA-1"
  );
  console.log("Connected to MongoDB");

  // Очистка
  // await Promise.all([
  //   ApplicationModel.deleteMany(),
  //   VacancyModel.deleteMany(),
  //   ResumeModel.deleteMany(),
  //   CompanyModel.deleteMany(),
  //   UserModel.deleteMany(),
  // ]);

  // 1) Генерируем пользователей с ролями User/Company
  const users = [];
  const totalUsers = 50;
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
        years: faker.number.int({ min: 1, max: 10 }),
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
      educations: Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => faker.lorem.sentence()
      ),
      experiences: exps,
      tags: faker.helpers.uniqueArray(() => faker.lorem.word(), 5),
      skills: faker.helpers.uniqueArray(() => faker.hacker.noun(), 5),
      languages: langs,
    });
    resumes.push(await resume.save());
  }

  // 4) Генерируем вакансии для компаний
  const vacancies = [];
  const totalVacancies = 80;
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
      empl_type: faker.helpers.arrayElement([
        "Полное",
        "Пол ставки",
        "Контракт",
        "Стажировка",
        "Удаленно",
      ]),
      is_archived: faker.datatype.boolean(),
      requirements: faker.helpers.uniqueArray(() => faker.lorem.word(), 5),
      skills: faker.helpers.uniqueArray(() => faker.hacker.verb(), 5),
      tags: faker.helpers.uniqueArray(() => faker.lorem.word(), 5),
      salary,
      experience_level: exLevel,
      languages: langsReq,
    });
    vacancies.push(await vacancy.save());
  }

  const totalApplications = 200;
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
