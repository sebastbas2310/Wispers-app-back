import { Module } from '@nestjs/common';
import { EchoService } from './echo.service';
import { EchoController } from './echo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Echo, EchoSchema } from './entities/echo.entity';
import { MemberRole, MemberRoleSchema } from './entities/member-role.entity';
import { AuthModule } from '../auth/auth.module';
import { MemberRoleService } from './member-role.service';
import { MemberRoleController } from './member-role.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Echo.name, schema: EchoSchema },
      { name: MemberRole.name, schema: MemberRoleSchema },
    ]),
    AuthModule,
    RoleModule,
  ],
  controllers: [EchoController, MemberRoleController],
  providers: [EchoService, MemberRoleService],
  exports: [EchoService, MemberRoleService],
})
export class EchoModule {}
