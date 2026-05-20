import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from './role.service';
import { Echo, EchoDocument } from '../echo/entities/echo.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    @InjectModel(Echo.name) private echoModel: Model<EchoDocument>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRoleDto: CreateRoleDto, @Request() req: any) {
    // If echoId is provided, validate that the user is the creator of that echo
    if (createRoleDto.echoId) {
      const echo = await this.echoModel.findById(createRoleDto.echoId).exec();
      if (!echo) {
        throw new BadRequestException(`Echo with id ${createRoleDto.echoId} not found`);
      }

      const userId = req.user?._id || req.user?.id || req.user?.sub;

      if (echo.echoCreator !== userId) {
        throw new BadRequestException('Solo el creador del echo puede crear roles personalizados');
      }
    }

    return this.roleService.create(createRoleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}