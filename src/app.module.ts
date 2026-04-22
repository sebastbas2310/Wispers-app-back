import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationMongo } from './configuration/configuration-mongo';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { EchoModule } from './modules/echo/echo.module';
import { ChatModule } from './modules/chat/chat.module';
import { MensajeModule } from './modules/mensaje/mensaje.module';
import { PostModule } from './modules/post/post.module';
import { EventModule } from './modules/event/event.module';
import { VotacionModule } from './modules/votacion/votacion.module';
import { TagsModule } from './modules/tags/tags.module';
import { RoleModule } from './modules/role/role.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';

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
    // register feature modules
    EchoModule,
    ChatModule,
    MensajeModule,
    PostModule,
    LikeModule,
    CommentModule,
    EventModule,
    VotacionModule,
    TagsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
