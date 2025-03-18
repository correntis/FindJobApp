import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Application, ApplicationDocument } from "src/schemas/application.schema";

@Injectable()
export class ApplicationsRepository {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>
  ) {}

  async create(applicationData: Partial<Application>): Promise<ApplicationDocument> {
    const application = new this.applicationModel(applicationData);
    return application.save();
  }

  async update(applicationId: string, applicationData: Partial<Application>): Promise<ApplicationDocument | null> {
    return this.applicationModel.findByIdAndUpdate(applicationId, applicationData, { new: true }).exec();
  }

  async findById(applicationId: string): Promise<ApplicationDocument | null> {
    return this.applicationModel.findById(applicationId).exec();
  }

  async findByUserId(userId: string): Promise<ApplicationDocument[]> {
    return this.applicationModel.find({ userId }).exec();
  }

  async findByVacancyId(vacancyId: string): Promise<ApplicationDocument[]> {
    return this.applicationModel.find({ vacancyId }).exec();
  }

  async delete(applicationId: string): Promise<ApplicationDocument | null> {
    return this.applicationModel.findByIdAndDelete(applicationId).exec();
  }
}
