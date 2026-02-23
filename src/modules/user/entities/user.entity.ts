import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  dateOfBirth: number;

  @Prop([String])
  chatHistory: string[];

  @Prop([String])
  echos: string[];

  @Prop()
  profilePicture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
