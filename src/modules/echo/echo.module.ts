import { Module } from '@nestjs/common';
import { EchoService } from './echo.service';
import { EchoController } from './echo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Echo, EchoSchema } from './entities/echo.entity';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Echo.name, schema: EchoSchema },
    ]),
    AuthModule,
    RoleModule,
  ],
  controllers: [EchoController],
  providers: [EchoService],
  exports: [EchoService],
})
export class EchoModule {}
