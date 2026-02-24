import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationMongo } from './configuration/configuration-mongo';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EchoModule } from './modules/echo/echo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationMongo],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    //MongooseModule.forRoot('mongodb://localhost:27017/wispersdb', { }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory : (configService: ConfigService) =>({
        uri: configService.get("mongo.MONGO_URI")
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    // register echo module for CRUD operations
    EchoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
