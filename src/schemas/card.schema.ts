import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class Card {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  maxLevel: number;

  @Prop({ required: false }) // Tornar o campo opcional
  elixirCost: number;

  @Prop({ type: { medium: String } })
  iconUrls: { medium: string };

  @Prop({ required: true })
  rarity: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);