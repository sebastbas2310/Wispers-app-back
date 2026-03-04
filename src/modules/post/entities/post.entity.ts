import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ default: false })
  anonymous: boolean;

  @Prop([String])
  likes: string[];

  @Prop([String])
  comments: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
