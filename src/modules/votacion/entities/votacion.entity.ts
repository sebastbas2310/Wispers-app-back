import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type VotacionDocument = HydratedDocument<Votacion>;

@Schema()
export class Votacion {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop({ required: true })
  pregunta: string;

  @Prop([String])
  opciones: string[];

  @Prop([Number])
  votos: number[];

  @Prop()
  EchoID: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  comments: string[];
} 

export const VotacionSchema = SchemaFactory.createForClass(Votacion);
