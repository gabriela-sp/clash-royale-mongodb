import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegracaoService } from './integracao.service';
import { IntegracaoController } from './integracao.controller';
import { NewAppService } from './new-app.service';
import { CardService } from './card.service';
import { Battle, BattleSchema } from '../schemas/battle.schema';
import { Card, CardSchema } from 'src/schemas/card.schema';
import { Player, PlayerSchema } from 'src/schemas/player.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Battle.name, schema: BattleSchema },
      { name: Card.name, schema: CardSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
  ],
  providers: [IntegracaoService, NewAppService, CardService],
  controllers: [IntegracaoController],
  exports: [CardService],
})
export class IntegracaoModule {}
