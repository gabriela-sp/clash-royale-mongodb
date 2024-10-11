import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URL'),
                dbName: configService.get<string>('MONGO_DB_NAME'),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MongoConnection { }
