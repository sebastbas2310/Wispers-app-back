import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EchoDocument = HydratedDocument<Echo>;

@Schema()
export class Echo {
  @Prop({ required: true, unique: true })
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
}

export const EchoSchema = SchemaFactory.createForClass(Echo);
