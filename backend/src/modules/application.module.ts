import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApplicationsRepository } from "src/repositories/applications.repository";
import { VacanciesRepository } from "src/repositories/vacancies.repository";
import { UsersRepository } from "src/repositories/users.repository";
import { Application, ApplicationSchema } from "src/schemas/application.schema";
import { Vacancy, VacancySchema } from "src/schemas/vacancy.schema";
import { User, UserSchema } from "src/schemas/user.schema";
import { ApplicationsService } from "src/services/application.service";
import { ApplicationsController } from "src/controllers/applications.controller";
import { TelegramService } from "src/services/telegram.service";
import { TelegramModule } from "./telegram.module";
import { CompaniesModule } from "./companies.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Vacancy.name, schema: VacancySchema },
      { name: User.name, schema: UserSchema },
    ]),
    TelegramModule,
    CompaniesModule,
  ],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationsRepository,
    VacanciesRepository,
    UsersRepository,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
