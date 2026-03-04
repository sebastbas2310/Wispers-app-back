import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type MensajeDocument = HydratedDocument<Mensaje>;

@Schema()
export class Mensaje {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MensajeSchema = SchemaFactory.createForClass(Mensaje);
