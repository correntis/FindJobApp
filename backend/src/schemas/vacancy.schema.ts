import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

class Salary {
  @Prop({ required: true })
  min: number;

  @Prop({ required: true })
  max: number;
}

class ExperienceLevel {
  @Prop({ required: true })
  min: number;

  @Prop({ required: true })
  max: number;
}

class Language {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: string;
}

@Schema({ timestamps: true })
export class Vacancy {
  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  empl_type: string;

  @Prop({ default: false })
  is_archived: boolean;
  
  @Prop({ default: false })
  for_invalids: boolean;

  @Prop()
  min_age: number;

  @Prop({ type: [String] })
  requirements: string[];

  @Prop({ type: [String] })
  skills: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Salary})
  salary: Salary;

  @Prop({ type: ExperienceLevel })
  experience_level: ExperienceLevel;

  @Prop({ type: [Language] })
  languages: Language[];

}

export const VacancySchema = SchemaFactory.createForClass(Vacancy);

VacancySchema.virtual("id").get(function () {
  return this._id.toString();
});

VacancySchema.set("toJSON", {
  virtuals: true,
});

export type VacancyDocument = HydratedDocument<Vacancy>;
