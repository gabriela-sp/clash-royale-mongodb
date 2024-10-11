import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IntegracaoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getAuthHeaders() {
    const apiKey = this.configService.getOrThrow<string>('APY_KEY');
    return {
      Authorization: `Bearer ${apiKey}`,
    };
  }

  async getClans(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.clashroyale.com/v1/clans?minMembers=10&limit=100', {
          headers: this.getAuthHeaders(),
        }),
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async getPlayer(playerTag: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.clashroyale.com/v1/players/${encodeURIComponent(playerTag)}`, {
          headers: this.getAuthHeaders(),
        }),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async getPlayerBattleLog(playerTag: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.clashroyale.com/v1/players/${encodeURIComponent(playerTag)}/battlelog`, {
          headers: this.getAuthHeaders(),
        }),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async getCards(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.clashroyale.com/v1/cards', {
          headers: this.getAuthHeaders(),
        }),
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async getTournaments(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.clashroyale.com/v1/tournaments', {
          headers: this.getAuthHeaders(),
        }),
      );
      return response.data.items;
    } catch (error) {
      this.handleHttpError(error);
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