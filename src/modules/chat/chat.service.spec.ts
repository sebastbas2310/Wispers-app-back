import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

const mockChatModel = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
});

describe('ChatService', () => {
  let service: ChatService;
  let model: Model<Chat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken(Chat.name), useFactory: mockChatModel },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    model = module.get<Model<Chat>>(getModelToken(Chat.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
