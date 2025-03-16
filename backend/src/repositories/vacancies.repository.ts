import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { Vacancy, VacancyDocument } from "src/schemas/vacancy.schema";

@Injectable()
export class VacanciesRepository {
  constructor(
    @InjectModel(Vacancy.name) private vacancyModel: Model<VacancyDocument>
  ) {}

async create(vacancyData: Partial<Vacancy>): Promise<VacancyDocument> {
    const vacancy = new this.vacancyModel(vacancyData);
    return vacancy.save();
  }

  async update(
    vacancyId: string,
    vacancyData: Partial<Vacancy>
  ): Promise<VacancyDocument | null> {
    return this.vacancyModel
      .findByIdAndUpdate(vacancyId, vacancyData, { new: true })
      .exec();
  }

  async findById(vacancyId: string): Promise<VacancyDocument | null> {
    return this.vacancyModel.findById(vacancyId).exec();
  }

  async archive(vacancyId: string): Promise<VacancyDocument | null> {
    return this.vacancyModel.findByIdAndUpdate(
      vacancyId,
      { is_archived: true },
      { new: true }
    );
  }
}
