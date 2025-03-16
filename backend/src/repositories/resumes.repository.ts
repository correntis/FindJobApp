import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Resume, ResumeDocument } from "src/schemas/resume.schema";

@Injectable()
export class ResumesRepository {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>
  ) {}

  async create(resumeData: Partial<Resume>): Promise<ResumeDocument> {
    const resume = new this.resumeModel(resumeData);
    return resume.save();
  }

  async update(
    resumeId: string,
    resumeData: Partial<Resume>
  ): Promise<ResumeDocument | null> {
    return this.resumeModel
      .findByIdAndUpdate(resumeId, resumeData, { new: true })
      .exec();
  }

  async findById(resumeId: string): Promise<ResumeDocument | null> {
    return this.resumeModel.findById(resumeId).exec();
  }

  async findByUserId(userId: string): Promise<ResumeDocument | null> {
    return this.resumeModel.findOne({ userId }).exec();
  }

  async delete(resumeId: string): Promise<ResumeDocument | null> {
    return this.resumeModel.findByIdAndDelete(resumeId).exec();
  }
}
