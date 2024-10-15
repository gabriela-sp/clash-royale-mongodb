import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Card {
  @Prop()
  name: string;
}

@Schema()
class Battle {
  @Prop()
  won: boolean;

  @Prop()
  battletime: string;

  @Prop([Card])
  deck: Card[];

  @Prop([Card])
  oppdeck: Card[];

  @Prop()
  towersdestroyed: number;

  @Prop()
  opptowersdestroyed: number;

  @Prop()
  trophiesonstart: number;

  @Prop()
  opptrophiesonstart: number;
}

@Schema()
export class Player extends Document {
  @Prop()
  name: string;

  @Prop()
  battlesplayed: number;

  @Prop()
  level: number;

  @Prop()
  trophies: number;

  @Prop([Battle])
  battles: Battle[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
