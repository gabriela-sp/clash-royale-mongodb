import { Controller, Get } from '@nestjs/common';
import { IntegracaoService } from './integracao.service';

@Controller('integracao')
export class IntegracaoController {

    constructor(private readonly integracaoService: IntegracaoService) {}

    @Get('clans')
    async getClans() {
      return this.integracaoService.getClans();
    }
}
