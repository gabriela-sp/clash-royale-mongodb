import { Controller, Get } from '@nestjs/common';
import { NewAppService } from './new-app.service';

@Controller('integracao')
export class IntegracaoController {
  constructor(private readonly newAppService: NewAppService) {}

  @Get('ingestPlayers')
  async ingestPlayers() {
    await this.newAppService.ingestPlayers();
    return { message: 'Players ingested successfully' };
  }

  @Get('ingestPlayerBattles')
  async ingestPlayerBattles() {
    await this.newAppService.ingestPlayers(); // This will ingest players and their battles
    return { message: 'Player battles ingested successfully' };
  }
}