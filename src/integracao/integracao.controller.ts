import { Controller, Get, Query } from '@nestjs/common';
import { IntegracaoService } from './integracao.service';
import { NewAppService } from './new-app.service';

@Controller('integracao')
export class IntegracaoController {

    constructor(private readonly integracaoService: IntegracaoService, private readonly newAppService: NewAppService) {}

    @Get('clans')
    async getClans() {
      return this.integracaoService.getClans();
    }

    @Get('ingestPlayers')
    async ingestPlayers(){
      return this.newAppService.ingestPlayers();
    }

    @Get('ingestPlayerBattles')
    async ingestPlayerBattles(@Query('playerTag') playerTag: string) {
      if (!playerTag) {
        return { error: 'playerTag is required' };
      }
      try {
        await this.newAppService.ingestPlayerBattles(playerTag);
        return { message: 'Player battles ingested successfully' };
      } catch (error) {
        return { error: 'Failed to ingest player battles', details: error.message };
      }
    }

    @Get('ingestCards')
    async ingestCards(){
      return this.newAppService.ingestCards();
    }
}
