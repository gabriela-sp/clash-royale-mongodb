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
  name: string;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  trophies: number;

  @Prop({ required: true })
  battlesPlayed: number;

  @Prop({ required: true, type: [Battle] })
  battles: Battle[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);