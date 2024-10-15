import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { IntegracaoController } from './integracao/integracao.controller';
import { NewAppService } from './integracao/new-app.service';
import { Player, PlayerSchema } from './schemas/player.schema';
import { Card, CardSchema } from './schemas/card.schema';
import { Clan, ClanSchema } from './schemas/clan.schema';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Card.name, schema: CardSchema },
      { name: Clan.name, schema: ClanSchema },
      { name: Tournament.name, schema: TournamentSchema },
    ]),
  ],
  controllers: [IntegracaoController],
  providers: [NewAppService],
})
export class AppModule {}