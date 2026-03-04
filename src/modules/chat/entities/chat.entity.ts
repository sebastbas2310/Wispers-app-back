import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop([String])
  participants: string[];

  @Prop([String])
  messages: string[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
