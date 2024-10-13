import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Battle } from './battle.schema';

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
  id: number;

  @Prop({ required: true })
  maxLevel: number;

  @Prop({ required: true })
  elixirCost: number;

  @Prop({ type: { medium: String } })
  iconUrls: { medium: string };

  @Prop({ required: true })
  rarity: string;

  @Prop({ required: false })
  battlesPlayed: number;

  @Prop({ required: true, type: [Battle] })
  battles: Battle[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);