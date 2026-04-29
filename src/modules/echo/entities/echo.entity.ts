import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as shortid from 'shortid';

export type EchoDocument = HydratedDocument<Echo>;

@Schema({ _id: false })
export class MemberRole {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  roleId: Types.ObjectId;

  @Prop({ default: Date.now })
  assignedAt: Date;
}

@Schema()
export class Echo {
  @Prop({ default: () => shortid.generate() })
  ID: string;

  @Prop({ required: true })
  echoName: string;

  @Prop()
  echoDesc: string;

  @Prop({ default: Date.now })
  echoCreatedTime: Date;

  @Prop([String])
  echoMembers: string[];

  @Prop([String])
  echoMessages: string[];

  @Prop()
  echoCreator: string;

  @Prop([String])
  echoTags: string[];

  @Prop()
  echoImage: string;

  @Prop({ required: true })
  membershipType: string;

  @Prop({ required: true, enum: ['public', 'private'], default: 'public' })
  privacy: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  echoType: string;

  @Prop({ type: [MemberRole], default: [] })
  memberRoles: MemberRole[];
}

export const EchoSchema = SchemaFactory.createForClass(Echo);
