import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class RelevantCard {
  @Prop()
  name: string;
}

@Schema()
class RelevantBattle {
  @Prop()
  won: boolean;

  @Prop()
  battleTime: string;

  @Prop([RelevantCard])
  deck: RelevantCard[];

  @Prop([RelevantCard])
  oppDeck: RelevantCard[];

  @Prop()
  towersDestroyed: number;

  @Prop()
  oppTowersDestroyed: number;

  @Prop()
  trophiesOnStart: number;

  @Prop()
  oppTrophiesOnStart: number;
}

@Schema()
export class Player extends Document {
  @Prop()
  name: string;

  @Prop()
  battlesPlayed: number;

  @Prop()
  level: number;

  @Prop()
  trophies: number;

  @Prop([RelevantBattle])
  battles: RelevantBattle[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);