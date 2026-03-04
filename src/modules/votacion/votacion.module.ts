import { Module } from '@nestjs/common';
import { VotacionService } from './votacion.service';
import { VotacionController } from './votacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Votacion, VotacionSchema } from './entities/votacion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Votacion.name, schema: VotacionSchema }]),
  ],
  controllers: [VotacionController],
  providers: [VotacionService],
  exports: [VotacionService],
})
export class VotacionModule {}
