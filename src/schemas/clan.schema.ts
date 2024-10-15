import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Clan extends Document {
  @Prop()
  tag: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  badgeId: number;

  @Prop()
  clanScore: number;

  @Prop()
  clanWarTrophies: number;

  @Prop()
  location: {
    id: number;
    name: string;
    isCountry: boolean;
    countryCode: string;
  };

  @Prop()
  requiredTrophies: number;

  @Prop()
  donationsPerWeek: number;

  @Prop()
  clanChestStatus: string;

  @Prop()
  clanChestLevel: number;

  @Prop()
  clanChestMaxLevel: number;

  @Prop()
  members: number;

  @Prop([{ type: Object }])
  memberList: any[];
}

export const ClanSchema = SchemaFactory.createForClass(Clan);
