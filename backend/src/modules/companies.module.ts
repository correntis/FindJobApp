import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Company, CompanySchema } from "src/schemas/company.schema";
import { AuthModule } from "./auth.module";
import { CompaniesService } from "src/services/companies.service";
import { CompaniesRepository } from "src/repositories/companies.repository";
import { CompaniesController } from "src/controllers/companies.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    AuthModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {}
