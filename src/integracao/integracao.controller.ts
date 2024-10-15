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

  @Get('ingestClans')
  async ingestClans() {
    await this.newAppService.ingestClans();
    return { message: 'Clans ingested successfully' };
  }

  @Get('ingestCards')
  async ingestCards() {
    await this.newAppService.ingestCards();
    return { message: 'Cards ingested successfully' };
  }

  @Get('ingestTournaments')
  async ingestTournaments() {
    await this.newAppService.ingestTournaments();
    return { message: 'Tournaments ingested successfully' };
  }

  @Get('ingestAll')
  async ingestAll() {
    await this.newAppService.ingestPlayers();
    await this.newAppService.ingestClans();
    await this.newAppService.ingestCards();
    await this.newAppService.ingestTournaments();
    return { message: 'All data ingested successfully' };
  }
}