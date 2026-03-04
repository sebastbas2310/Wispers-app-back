import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop({ default: () => shortid.generate() })
  ID: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  color: string;

  @Prop()
  echoID: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
