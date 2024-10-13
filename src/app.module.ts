import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongoConnection } from './infrastructure/mongo-connection.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BattleSchema, Battle } from './schemas/battle.schema';
import { IntegracaoController } from './integracao/integracao.controller';
import { IntegracaoService } from './integracao/integracao.service';
import { IntegracaoModule } from './integracao/integracao.module';
import { HttpModule } from '@nestjs/axios';
import { NewAppService } from './integracao/new-app.service';
import { Player, PlayerSchema } from './schemas/player.schema';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true }), MongoConnection, MongooseModule.forFeature([{ name: Battle.name, schema: BattleSchema },{ name: Player.name, schema: PlayerSchema}]), IntegracaoModule],
  controllers: [AppController, IntegracaoController],
  providers: [AppService, IntegracaoService, NewAppService],
})
export class AppModule { }
