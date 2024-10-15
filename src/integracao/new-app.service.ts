import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Player } from '../schemas/player.schema';
import { Card } from '../schemas/card.schema';
import { Clan } from '../schemas/clan.schema';
import { Tournament } from '../schemas/tournament.schema';

@Injectable()
export class NewAppService {
  private readonly baseUrl = 'https://api.clashroyale.com/v1';

  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    @InjectModel(Clan.name) private readonly clanModel: Model<Clan>,
    @InjectModel(Tournament.name) private readonly tournamentModel: Model<Tournament>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getAuthHeaders() {
    const apiKey = this.configService.get<string>('CLASH_API_KEY');
    return {
      Authorization: `Bearer ${apiKey}`,
    };
  }

  async ingestPlayers(): Promise<void> {
    try {
      const clans = await this.getClans();
      for (const clan of clans) {
        const members = await this.getMembers(clan);
        for (const member of members) {
          const relevantPlayer = await this.makeRelevantPlayerFrom(member);
          await this.savePlayer(relevantPlayer);
        }
      }
      console.log('Players ingestados com sucesso!');
    } catch (error) {
      console.error('Erro ao ingestar players:', error);
    }
  }

  private async getClans(): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ items: any[] }>(`${this.baseUrl}/clans`, {
          params: { minMembers: 10, limit: 100 },
          headers: this.getAuthHeaders(),
        })
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }
  private async getMembers(clan: any): Promise<any[]> {
    const htmlTransformedTag = clan.tag.replace('#', '%23');
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ items: any[] }>(
          `${this.baseUrl}/clans/${htmlTransformedTag}/members`,
          { headers: this.getAuthHeaders() }
        )
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private async getPlayer(member: any): Promise<any> {
    const htmlTransformedTag = member.tag.replace('#', '%23');
    try {
      const response = await lastValueFrom(
        this.httpService.get<any>(
          `${this.baseUrl}/players/${htmlTransformedTag}`,
          { headers: this.getAuthHeaders() }
        )
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private async getBattles(member: any): Promise<any[]> {
    const htmlTransformedTag = member.tag.replace('#', '%23');
    try {
      const response = await lastValueFrom(
        this.httpService.get<any[]>(
          `${this.baseUrl}/players/${htmlTransformedTag}/battlelog`,
          { headers: this.getAuthHeaders() }
        )
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private async makeRelevantPlayerFrom(member: any): Promise<any> {
    const playerInfo: any = {};
    const responsePlayer = await this.getPlayer(member);

    playerInfo.name = member.name;
    playerInfo.level = member.expLevel;
    playerInfo.trophies = responsePlayer.trophies;
    playerInfo.battlesPlayed = responsePlayer.battleCount;

    console.log("Player name: ", playerInfo.name);
    console.log("Player level: ", playerInfo.level);
    console.log("Player trophies: ", playerInfo.trophies);
    console.log("Player battles: ", playerInfo.battlesPlayed);

    const responseBattles = await this.getBattles(member);
    playerInfo.battles = responseBattles.map(battle => {
      const battleInfo: any = {};
      battleInfo.won = battle.team[0].crowns > battle.opponent[0].crowns;
      battleInfo.battleTime = battle.battleTime;
      battleInfo.deck = battle.team[0].cards.map(card => ({ name: card.name }));
      battleInfo.oppDeck = battle.opponent[0].cards.map(card => ({ name: card.name }));
      battleInfo.towersDestroyed = battle.team[0].crowns;
      battleInfo.oppTowersDestroyed = battle.opponent[0].crowns;
      battleInfo.trophiesOnStart = battle.team[0].startingTrophies;
      battleInfo.oppTrophiesOnStart = battle.opponent[0].startingTrophies;
      return battleInfo;
    });

    return playerInfo;
  }

  private async savePlayer(playerData: any): Promise<void> {
    try {
      const player = new this.playerModel(playerData);
      await player.save();
    } catch (error) {
      console.error('Error saving player:', error);
    }
  }
private handleHttpError(error: any): never {
    if (error.response) {
      throw new HttpException(
        error.response.data.message || 'Erro ao se comunicar com a API externa',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      throw new HttpException(
        'Não foi possível obter resposta da API externa',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      throw new HttpException(
        'Erro ao configurar a requisição para a API externa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async ingestPlayerBattles(player: any): Promise<void> {
    try {
      const relevantPlayer = await this.makeRelevantPlayerFrom(player);
      await this.savePlayer(relevantPlayer);
      console.log('Battles ingested successfully for player:', player.name);
    } catch (error) {
      console.error('Error ingesting battles for player:', player.name, error);
    }
  }

  async ingestClans(): Promise<void> {
    try {
      const clans = await this.getClans();
      for (const clan of clans) {
        await this.saveClan(clan);
      }
      console.log('Clans ingested successfully!');
    } catch (error) {
      console.error('Error ingesting clans:', error);
    }
  }
  
  private async saveClan(clanData: any): Promise<void> {
    try {
      // Assumindo que você tem um modelo Clan
      const clan = new this.clanModel(clanData);
      await clan.save();
    } catch (error) {
      console.error('Error saving clan:', error);
    }
  }

  async ingestCards(): Promise<void> {
    try {
      const cards = await this.getCards();
      for (const card of cards) {
        await this.saveCard(card);
      }
      console.log('Cards ingested successfully!');
    } catch (error) {
      console.error('Error ingesting cards:', error);
    }
  }
  
  private async getCards(): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ items: any[] }>(`${this.baseUrl}/cards`, {
          headers: this.getAuthHeaders(),
        })
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }
  
  private async saveCard(cardData: any): Promise<void> {
    try {
      // Assumindo que você tem um modelo Card
      const card = new this.cardModel(cardData);
      await card.save();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  }

  async ingestTournaments(): Promise<void> {
    try {
      const tournaments = await this.getTournaments();
      for (const tournament of tournaments) {
        await this.saveTournament(tournament);
      }
      console.log('Tournaments ingested successfully!');
    } catch (error) {
      console.error('Error ingesting tournaments:', error);
    }
  }

  private async getClans(): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ items: any[] }>(`${this.baseUrl}/clans`, {
          params: { minMembers: 10, limit: 100 },
          headers: this.getAuthHeaders(),
        })
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private async saveClan(clanData: any): Promise<void> {
    try {
      const clan = new this.clanModel(clanData);
      await clan.save();
    } catch (error) {
      console.error('Error saving clan:', error);
    }
  }

  private async getCards(): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ items: any[] }>(`${this.baseUrl}/cards`, {
          headers: this.getAuthHeaders(),
        })
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private async saveCard(cardData: any): Promise<void> {
    try {
      const card = new this.cardModel(cardData);
      await card.save();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  }

  private async getTournaments(): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<{ items: any[] }>(`${this.baseUrl}/tournaments`, {
          headers: this.getAuthHeaders(),
        })
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private async saveTournament(tournamentData: any): Promise<void> {
    try {
      const tournament = new this.tournamentModel(tournamentData);
      await tournament.save();
    } catch (error) {
      console.error('Error saving tournament:', error);
    }
  }

  private handleHttpError(error: any): never {
    if (error.response) {
      throw new HttpException(
        error.response.data.message || 'Erro ao se comunicar com a API externa',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      throw new HttpException(
        'Não foi possível obter resposta da API externa',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      throw new HttpException(
        'Erro ao configurar a requisição para a API externa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
