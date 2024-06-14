import { Test, TestingModule } from '@nestjs/testing';
import { MediaPathController } from './media-path.controller';

describe('MediaPathController', () => {
  let controller: MediaPathController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaPathController],
    }).compile();

    controller = module.get<MediaPathController>(MediaPathController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
