import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vacancy, VacancySchema } from "src/schemas/vacancy.schema";
import { AuthModule } from "./auth.module";
import { VacanciesController } from "src/controllers/vacancies.controller";
import { VacanciesService } from "src/services/vacancies.service";
import { VacanciesRepository } from "src/repositories/vacancies.repository";
import { CompaniesModule } from "./companies.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vacancy.name, schema: VacancySchema }]),
    AuthModule,
    CompaniesModule,
  ],
  controllers: [VacanciesController],
  providers: [VacanciesService, VacanciesRepository],
  exports: [VacanciesService, VacanciesRepository],
})
export class VacanciesModule {}
