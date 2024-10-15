import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { IntegracaoController } from './integracao/integracao.controller';
import { NewAppService } from './integracao/new-app.service';
import { Player, PlayerSchema } from './schemas/player.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [IntegracaoController],
  providers: [NewAppService],
})
export class AppModule {}
