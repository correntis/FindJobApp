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

  async findAllByCompany(companyId: string): Promise<VacancyDocument[]> {
    return this.vacancyModel.find({ companyId }).exec();
  }

  async findAllByUser(userId: string): Promise<VacancyDocument[]> {
    return this.vacancyModel.find({ userId }).exec();
  }

  async archive(vacancyId: string): Promise<VacancyDocument | null> {
    return this.vacancyModel.findByIdAndUpdate(
      vacancyId,
      { is_archived: true },
      { new: true }
    );
  }

  async toggleArchive(vacancyId: string, isArchived: boolean): Promise<VacancyDocument | null> {
    return this.vacancyModel.findByIdAndUpdate(
      vacancyId,
      { is_archived: isArchived },
      { new: true }
    );
  }

  async search(filters: any): Promise<VacancyDocument[]> {
    const query: any = {};

    console.log("filter", filters);

    if (filters.minSalary || filters.maxSalary) {
      query["$and"] = query["$and"] || [];

      if (filters.minSalary) {
        query["$and"].push({ "salary.max": { $gte: filters.minSalary } });
      }

      if (filters.maxSalary) {
        query["$and"].push({ "salary.min": { $lte: filters.maxSalary } });
      }
    }

    if (filters.minExperience || filters.maxExperience) {
      query["$and"] = query["$and"] || [];

      if (filters.minExperience) {
        query["$and"].push({
          "experience_level.max": { $gte: filters.minExperience },
        });
      }

      if (filters.maxExperience) {
        query["$and"].push({
          "experience_level.min": { $lte: filters.maxExperience },
        });
      }
    }

    if (filters.empl_type) query.empl_type = filters.empl_type;
    if (filters.is_archived !== undefined)
      query.is_archived = filters.is_archived;

    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $in: filters.skills };
    }
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.languages && filters.languages.length > 0) {
      query.languages = { $elemMatch: { name: { $in: filters.languages } } };
    }

    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 10);
    const skip = (page - 1) * limit;

    console.log("Generated Query:", JSON.stringify(query, null, 2));

    return this.vacancyModel.find(query).skip(skip).limit(limit).exec();
  }
}
