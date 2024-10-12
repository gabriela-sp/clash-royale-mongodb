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
        const players = await this.integracaoService.getClans(); // Obtenha os dados do jogador com o getPlayers
        for (const player of players) {
          if (player.tag === 'PlayerRamdon') { // Verifique se o jogador é o PlayerRamdon
            await this.newAppService.ingestPlayerBattles(player); // Ingeste os dados de batalhas do jogador
            return { message: 'Player battles ingested successfully' };
          }
        }
        return { error: 'Jogador não encontrado' };
      } catch (error) {
        return { error: 'Failed to ingest player battles', details: error.message };
      }
    }

    @Get('ingestCards')
    async ingestCards(){
      return this.newAppService.ingestCards();
    }
}
