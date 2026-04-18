import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VotacionService } from './votacion.service';
import { CreateVotacionDto } from './dto/create-votacion.dto';
import { UpdateVotacionDto } from './dto/update-votacion.dto';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller('votacion')
export class VotacionController {
  constructor(private readonly votacionService: VotacionService) {}

  @Post()
  create(@Body() createVotacionDto: CreateVotacionDto) {
    return this.votacionService.create(createVotacionDto);
  }

  @Get()
  findAll() {
    return this.votacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.votacionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateVotacionDto: UpdateVotacionDto) {
    return this.votacionService.update(id, updateVotacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.votacionService.remove(id);
  }
}
