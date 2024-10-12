// src/integracao/integracao.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegracaoService } from './integracao.service';
import { IntegracaoController } from './integracao.controller';
import { NewAppService } from './new-app.service';
import { CardService } from './card.service';
import { Player, BattleSchema } from '../schemas/battle.schema';
import { Card, CardSchema } from 'src/schemas/card.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Player.name, schema: BattleSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  providers: [IntegracaoService, NewAppService, CardService],
  controllers: [IntegracaoController],
  exports: [CardService],
})
export class IntegracaoModule {}
