import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  industry: string;

  @Prop()
  city: string;

  @Prop()
  street: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  webSite: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

CompanySchema.virtual("id").get(function () {
  return this._id.toString();
});

CompanySchema.set("toJSON", {
  virtuals: true,
});

export type CompanyDocument = HydratedDocument<Company>;
