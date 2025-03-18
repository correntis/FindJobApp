import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ApplicationStatus } from "src/enums/applications-status.enum";

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  vacancyId: string;

  @Prop({ required: true, enum: ApplicationStatus, default: ApplicationStatus.Pending })
  status: ApplicationStatus;

  @Prop()
  replyMessage?: string;

  @Prop({ default: Date.now })
  appliedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.virtual("id").get(function () {
  return this._id.toString();
});

ApplicationSchema.set("toJSON", {
  virtuals: true,
});

export type ApplicationDocument = HydratedDocument<Application>;
