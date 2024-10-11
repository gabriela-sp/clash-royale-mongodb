import { Test, TestingModule } from '@nestjs/testing';
import { NewAppService } from './new-app.service';

describe('NewAppService', () => {
  let service: NewAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewAppService],
    }).compile();

    service = module.get<NewAppService>(NewAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
