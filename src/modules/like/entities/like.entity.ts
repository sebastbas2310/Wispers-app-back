import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
