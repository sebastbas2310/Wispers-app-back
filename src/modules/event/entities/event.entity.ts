import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as shortid from 'shortid';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ default: () => shortid.generate() })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: number;

  @Prop()
  location: string;

  @Prop([String])
  attendees: string[];

  @Prop({ required: true })
  hour: number;

  @Prop()
  maxAttendees: number;

  @Prop()
  imageUrl: string;

  @Prop()
  echoID: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  comments: string[];
} 

export const EventSchema = SchemaFactory.createForClass(Event);
