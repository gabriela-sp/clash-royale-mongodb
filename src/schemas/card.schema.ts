import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Card extends Document {
  @Prop()
  name: string;

  @Prop()
  id: number;

  @Prop()
  maxLevel: number;

  @Prop()
  elixirCost: number;

  @Prop({ type: { medium: String } })
  iconUrls: { medium: string };
}

export const CardSchema = SchemaFactory.createForClass(Card);