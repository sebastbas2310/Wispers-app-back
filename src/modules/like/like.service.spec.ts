import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { getModelToken } from '@nestjs/mongoose';
import { Like } from './entities/like.entity';

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: getModelToken(Like.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
