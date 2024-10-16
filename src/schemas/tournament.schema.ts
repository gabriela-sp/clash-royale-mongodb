import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class GameMode {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

@Schema()
export class Tournament extends Document {
  @Prop()
  tag: string;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop()
  creatorTag: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  capacity: number;

  @Prop()
  maxCapacity: number;

  @Prop()
  preparationDuration: number;

  @Prop()
  duration: number;

  @Prop()
  createdTime: string;

  @Prop()
  startedTime: string;

  @Prop()
  endedTime: string;

  @Prop()
  levelCap: number;

  @Prop()
  firstPlaceCardPrize: number;

  @Prop({ type: GameMode })
  gameMode: GameMode;

  @Prop([{ type: Object }])
  members: any[];
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);