import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IntegracaoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getClans(): Promise<any[]> {
    const apiKey = this.configService.getOrThrow<string>('APY_KEY');
    const response = await firstValueFrom(
      this.httpService.get('https://api.clashroyale.com/v1/clans?minMembers=10&limit=100', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }),
    );

    return response.data.items;
  }

  // Implemente métodos adicionais para obter membros e jogadores relevantes
}
