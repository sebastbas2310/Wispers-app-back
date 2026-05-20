import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: Types.ObjectId, ref: 'Echo', required: false })
  echoId?: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);