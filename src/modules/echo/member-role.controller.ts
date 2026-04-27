import { Controller, Get, Post, Body, Param, Delete, BadRequestException } from '@nestjs/common';
import { MemberRoleService } from './member-role.service';

@Controller('member-role')
export class MemberRoleController {
  constructor(private readonly memberRoleService: MemberRoleService) {}

  @Post()
  create(@Body() body: { echoId: string; userId: string; roleId: string }) {
    if (!body.echoId || !body.userId || !body.roleId) {
      throw new BadRequestException('echoId, userId, and roleId are required');
    }
    return this.memberRoleService.create(body.echoId, body.userId, body.roleId);
  }

  @Get('echo/:echoId')
  findByEcho(@Param('echoId') echoId: string) {
    return this.memberRoleService.findByEcho(echoId);
  }

  @Get('echo/:echoId/user/:userId')
  findByEchoAndUser(@Param('echoId') echoId: string, @Param('userId') userId: string) {
    return this.memberRoleService.findByEchoAndUser(echoId, userId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.memberRoleService.findByUser(userId);
  }

  @Delete('echo/:echoId/user/:userId')
  remove(@Param('echoId') echoId: string, @Param('userId') userId: string) {
    return this.memberRoleService.remove(echoId, userId);
  }
}
