import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongoConnection } from './infrastructure/mongo-connection.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, BattleSchema } from './schemas/battle.schema';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongoConnection, MongooseModule.forFeature([{ name: Player.name, schema: BattleSchema }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
