import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: [{ userId: String, createdAt: Date }], default: [] })
  likes: Array<{ userId: string; createdAt: Date }>;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
