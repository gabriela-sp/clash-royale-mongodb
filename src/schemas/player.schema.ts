import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class Player {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  maxLevel: number;

  @Prop({ required: true })
  elixirCost: number;

  @Prop({ type: { medium: String } })
  iconUrls: { medium: string };

  @Prop({ required: true })
  rarity: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);