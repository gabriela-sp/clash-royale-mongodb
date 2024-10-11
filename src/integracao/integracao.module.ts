import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegracaoService } from './integracao.service';
import { IntegracaoController } from './integracao.controller';
import { AppService } from './new-app.service'; 
import { Player, BattleSchema } from '../schemas/battle.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Player.name, schema: BattleSchema }]),
  ],
  providers: [IntegracaoService, AppService],
  controllers: [IntegracaoController],
})
export class IntegracaoModule {}
