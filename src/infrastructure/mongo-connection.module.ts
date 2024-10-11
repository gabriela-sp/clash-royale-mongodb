import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: "mongodb+srv://devairasoares:pato@cluster0.9rwot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
                dbName: "clash_royale",
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MongoConnection { }
