import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Company, CompanyDocument } from "src/schemas/company.schema";

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) {}

  async create(companyData: Partial<Company>): Promise<CompanyDocument> {
    const company = new this.companyModel(companyData);
    return company.save();
  }

  async update(
    companyId: string,
    companyData: Partial<Company>
  ): Promise<CompanyDocument | null> {
    return this.companyModel
      .findByIdAndUpdate(companyId, companyData, { new: true })
      .exec();
  }

  async delete(companyId: string): Promise<CompanyDocument | null> {
    return this.companyModel.findByIdAndDelete(companyId);
  }

  async findById(companyId: string): Promise<CompanyDocument | null> {
    return this.companyModel.findById(companyId).exec();
  }

  async findByName(companyName: string): Promise<CompanyDocument | null> {
    return this.companyModel.findOne({ name: companyName }).exec();
  }

  async findByUser(userId: string): Promise<CompanyDocument | null> {
    return this.companyModel.findOne({ userId }).exec();
  }
}
