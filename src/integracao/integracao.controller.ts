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
    async ingestPlayerBattles() {
      try {
        const players = await this.integracaoService.getClans();
        for (const player of players) {
          if (player.tag) { 
            await this.newAppService.ingestPlayerBattles(player); 
          } else {
            console.error(`Jogador sem tag: ${player.name}`);
          }
        }
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
