import { Test, TestingModule } from '@nestjs/testing';
import { IntegracaoService } from './integracao.service';

describe('IntegracaoService', () => {
  let service: IntegracaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegracaoService],
    }).compile();

    service = module.get<IntegracaoService>(IntegracaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
