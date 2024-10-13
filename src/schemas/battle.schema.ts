// src/schemas/battle.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BattleDocument = Battle & Document;

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class Battle {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false }) 
  battlesplayed: number;

  @Prop({ required: false }) 
  level: number;

  @Prop({ required: false }) 
  trophies: number;

  @Prop({
    type: [
      {
        won: { type: Boolean, required: true },
        battletime: { type: Date, required: true },
        deck: [
          {
            name: { type: String, required: true },
          },
        ],
        oppdeck: [
          {
            name: { type: String, required: true },
          },
        ],
        towersdestroyed: { type: Number, required: true },
        opptowersdestroyed: { type: Number, required: true },
        trophiesonstart: { type: Number, required: true },
        opptrophiesonstart: { type: Number, required: true },
      },
    ],
    required: true,
  })
  battles: {
    won: boolean;
    battletime: string;
    deck: { name: string }[];
    oppdeck: { name: string }[];
    towersdestroyed: number;
    opptowersdestroyed: number;
    trophiesonstart: number;
    opptrophiesonstart: number;
  }[];
}

export const BattleSchema = SchemaFactory.createForClass(Battle);