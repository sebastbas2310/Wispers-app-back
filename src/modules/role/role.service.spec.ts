import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';

const mockRoleModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('RoleService', () => {
  let service: RoleService;
  let model: Model<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: getModelToken(Role.name), useFactory: mockRoleModel },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    model = module.get<Model<Role>>(getModelToken(Role.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});