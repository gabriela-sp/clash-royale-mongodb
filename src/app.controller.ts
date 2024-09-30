import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Battles')
@Controller('battles')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('win-loss-percentage')
  @ApiOperation({
    summary: 'Calcula a porcentagem de vitórias e derrotas utilizando uma carta específica em um intervalo de tempo',
  })
  @ApiResponse({ status: 200, description: 'Porcentagens calculadas com sucesso' })
  @ApiQuery({ name: 'cardName', type: String, description: 'Nome da carta' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: String, description: 'Data de fim (ISO 8601)' })
  async getWinLossPercentage(
    @Query('cardName') cardName: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.appService.getWinLossPercentage(cardName, start, end);
  }

  @Get('decks-with-win-percentage')
  @ApiOperation({
    summary: 'Lista os decks que produziram mais que X% de vitórias em um intervalo de tempo',
  })
  @ApiResponse({ status: 200, description: 'Decks listados com sucesso' })
  @ApiQuery({ name: 'winPercentage', type: Number, description: 'Porcentagem mínima de vitórias' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: String, description: 'Data de fim (ISO 8601)' })
  async getDecksWithWinPercentage(
    @Query('winPercentage', ParseIntPipe) winPercentage: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.appService.getDecksWithWinPercentage(winPercentage, start, end);
  }

  @Get('losses-by-combo')
  @ApiOperation({
    summary: 'Calcula a quantidade de derrotas utilizando um combo de cartas em um intervalo de tempo',
  })
  @ApiResponse({ status: 200, description: 'Quantidade de derrotas calculada com sucesso' })
  @ApiQuery({ name: 'combo', type: [String], description: 'Array de nomes das cartas do combo' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: String, description: 'Data de fim (ISO 8601)' })
  async getLossesByCombo(
    @Query('combo') combo: string[] | string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.appService.getLossesByCombo(combo, start, end);
  }

  // Consulta 4
  @Get('specific-wins')
  @ApiOperation({
    summary:
      'Calcula a quantidade de vitórias envolvendo uma carta específica com certas condições',
  })
  @ApiResponse({ status: 200, description: 'Vitórias calculadas com sucesso' })
  @ApiQuery({ name: 'cardName', type: String, description: 'Nome da carta' })
  @ApiQuery({ name: 'trophyDiffPercentage', type: Number, description: 'Diferença percentual de troféus' })
  async getSpecificWins(
    @Query('cardName') cardName: string,
    @Query('trophyDiffPercentage', ParseIntPipe) trophyDiffPercentage: number,
  ) {
    return await this.appService.getSpecificWins(cardName, trophyDiffPercentage);
  }

  @Get('top-combos')
  @ApiOperation({
    summary: 'Lista combos de cartas que produziram mais que Y% de vitórias em um intervalo de tempo',
  })
  @ApiResponse({ status: 200, description: 'Combos listados com sucesso' })
  @ApiQuery({ name: 'comboSize', type: Number, description: 'Tamanho do combo' })
  @ApiQuery({ name: 'winPercentage', type: Number, description: 'Porcentagem mínima de vitórias' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: String, description: 'Data de fim (ISO 8601)' })
  async getTopCombos(
    @Query('comboSize', ParseIntPipe) comboSize: number,
    @Query('winPercentage', ParseIntPipe) winPercentage: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.appService.getTopCombos(comboSize, winPercentage, start, end);
  }

  @Get('most-used-cards')
  @ApiOperation({ summary: 'Obter cartas mais usadas por jogadores de um nível específico' })
  @ApiResponse({ status: 200, description: 'Lista das cartas mais usadas com base no nível do jogador.' })
  async getMostUsedCards(
    @Query('level', ParseIntPipe) level: number,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.appService.findMostUsedCardsByLevel(level, limit);
  }

  @Get('undefeated-players')
  @ApiOperation({ summary: 'Obter jogadores com mais de X troféus que nunca perderam uma batalha' })
  @ApiResponse({ status: 200, description: 'Lista de jogadores que nunca perderam com mais de X troféus.' })
  async getUndefeatedPlayers(
    @Query('trophies', ParseIntPipe) trophies: number
  ) {
    return this.appService.getUndefeatedPlayers(trophies);
  }

  @Get('cards-with-high-loss-rate')
  @ApiOperation({ summary: 'Lista cartas com a maior taxa de derrota' })
  @ApiResponse({ status: 200, description: 'Cartas listadas com sucesso.' })
  @ApiQuery({ name: 'startDate', type: String, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: String, description: 'Data de fim (ISO 8601)' })
  async getCardsWithHighLossRate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.appService.getCardsWithHighLossRate(start, end, limit);
  }
  
}