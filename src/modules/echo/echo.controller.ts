import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { EchoService } from './echo.service';
import { CreateEchoDto } from './dto/create-echo.dto';
import { UpdateEchoDto } from './dto/update-echo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller('echo')
export class EchoController {
  constructor(private readonly echoService: EchoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEchoDto: CreateEchoDto, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    const payload = {
      ...createEchoDto,
      echoCreator: userId || createEchoDto.echoCreator,
    };
    return this.echoService.create(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMy(@Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.echoService.findByCreator(userId);
  }

  @Get()
  findAll() {
    return this.echoService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id', ParseMongoIdPipe) id: string) {
    return this.echoService.findByCreator(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Param('id', ParseMongoIdPipe) id: string, @Body() body: { password?: string }, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    return this.echoService.addMember(id, userId, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/message')
  addMessage(@Param('id', ParseMongoIdPipe) id: string, @Body('message') message: string) {
    return this.echoService.addMessage(id, message);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/tag')
  addTag(@Param('id', ParseMongoIdPipe) id: string, @Body('tag') tag: string) {
    return this.echoService.addTag(id, tag);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.echoService.findOne(id);
  }

  @Post(':id/access')
  accessPrivateEcho(@Param('id', ParseMongoIdPipe) id: string, @Body('password') password?: string) {
    return this.echoService.findOneWithPasswordValidation(id, password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateEchoDto: UpdateEchoDto, @Request() req: any) {
    const userId = req.user?._id || req.user?.id || req.user?.sub;
    // Opcional: control de dueño para no actualizar echos ajenos
    return this.echoService.update(id, updateEchoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.echoService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':echoId/member/:userId')
  removeMember(@Param('echoId', ParseMongoIdPipe) echoId: string, @Param('userId') userId: string) {
    return this.echoService.removeMember(echoId, userId);
  }

  @Get(':echoId/members/roles')
  getMemberRoles(@Param('echoId', ParseMongoIdPipe) echoId: string) {
    return this.echoService.getMemberRoles(echoId);
  }

  @Get(':echoId/creator')
  getCreator(@Param('echoId', ParseMongoIdPipe) echoId: string) {
    return this.echoService.getCreatorRole(echoId);
  }

  @Get(':echoId/members/:userId/role')
  getMemberRole(@Param('echoId', ParseMongoIdPipe) echoId: string, @Param('userId') userId: string) {
    return this.echoService.getMemberRole(echoId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':echoId/members/:userId/role')
  assignMemberRole(
    @Param('echoId', ParseMongoIdPipe) echoId: string,
    @Param('userId') userId: string,
    @Body('roleId') roleId: string,
  ) {
    return this.echoService.assignMemberRole(echoId, userId, roleId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':echoId/members/:userId/role')
  removeMemberRole(@Param('echoId', ParseMongoIdPipe) echoId: string, @Param('userId') userId: string) {
    return this.echoService.removeMemberRole(echoId, userId);
  }
}
