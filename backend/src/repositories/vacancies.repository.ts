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

  async search(filters: any): Promise<VacancyDocument[]> {
    const query: any = {};

    if (filters.minSalary || filters.maxSalary) {
      query["$or"] = [];
    
      if (filters.minSalary) {
        query["$or"].push({ "salary.max": { $gte: filters.minSalary } });
      }
    
      if (filters.maxSalary) {
        query["$or"].push({ "salary.min": { $lte: filters.maxSalary } });
      }
    }

    if (filters.minExperience || filters.maxExperience) {
      query["$or"] = [];
    
      if (filters.minExperience) {
        query["$or"].push({ "experience_level.max": { $gte: filters.minExperience } });
      }
    
      if (filters.maxExperience) {
        query["$or"].push({ "experience_level.min": { $lte: filters.maxExperience } });
      }
    }
    
    if (filters.empl_type) query.empl_type = filters.empl_type;
    if (filters.companyId) query.companyId = filters.companyId;
    if (filters.is_archived !== undefined) query.is_archived = filters.is_archived;
    if (filters.skills) query.skills = { $in: filters.skills };
    if (filters.languages) query.languages = { $elemMatch: { name: { $in: filters.languages } } };
    if (filters.tags) query.tags = { $in: filters.tags };

    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 10);
    const skip = (page - 1) * limit;

    return this.vacancyModel.find(query).skip(skip).limit(limit).exec();
  }
}
