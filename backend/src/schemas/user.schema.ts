import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  telegram: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: "User" })
  role: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function() {
  return this._id.toString();
});

UserSchema.set('toJSON', {
  virtuals: true,
});

export type UserDocument = HydratedDocument<User>;