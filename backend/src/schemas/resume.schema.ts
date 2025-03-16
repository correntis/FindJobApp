import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

class Experience {
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  years: number;
}

class Language {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: string;
}

@Schema({ timestamps: true })
export class Resume {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String] })
  educations: string[];

  @Prop({ type: [Experience], required: true })
  experiences: Experience[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ type: [Language], required: true })
  languages: Language[];
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

ResumeSchema.virtual("id").get(function () {
  return this._id.toString();
});

ResumeSchema.set("toJSON", {
  virtuals: true,
});

export type ResumeDocument = HydratedDocument<Resume>;
