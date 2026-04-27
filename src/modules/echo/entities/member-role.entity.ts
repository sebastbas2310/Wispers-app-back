import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MemberRoleDocument = HydratedDocument<MemberRole>;

@Schema()
export class MemberRole {
  @Prop({ type: Types.ObjectId, ref: 'Echo', required: true })
  echoId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  roleId: Types.ObjectId;

  @Prop({ default: Date.now })
  assignedAt: Date;
}

export const MemberRoleSchema = SchemaFactory.createForClass(MemberRole);
