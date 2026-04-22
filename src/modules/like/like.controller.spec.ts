import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

describe('LikeController', () => {
  let controller: LikeController;
  let service: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [
        {
          provide: LikeService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LikeController>(LikeController);
    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
