import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from '../schemas/battle.schema'; 
import { IntegracaoService } from './integracao.service'; 

@Injectable()
export class NewAppService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    private readonly integracaoService: IntegracaoService,
  ) {}

  async ingestPlayers(): Promise<void> {
    try {
      const players = await this.integracaoService.getClans(); 
      for (const playerData of players) {
        const player = new this.playerModel(playerData);
        await player.save();
      }
      console.log('Players ingestados com sucesso!');
    } catch (error) {
      console.error('Erro ao ingestar players:', error);
    }
  }

  async ingestPlayerBattles(playerTag: string): Promise<void> {
    try {
      const battles = await this.integracaoService.getPlayerBattleLog(playerTag);
      for (const battleData of battles) {

        const player = new this.playerModel({
          name: battleData.playerName,
          battlesplayed: battleData.battles.length,
          level: battleData.playerLevel,
          trophies: battleData.trophies,
          battles: battleData.battles,
        });
        await player.save();
      }
      console.log('Batalhas ingestadas com sucesso!');
    } catch (error) {
      console.error('Erro ao ingestar batalhas:', error);
    }
  }

  async ingestCards(): Promise<void> {
    try {
      const cards = await this.integracaoService.getCards();
      console.log('Cartas obtidas:', cards);
    } catch (error) {
      console.error('Erro ao obter cartas:', error);
    }
  }
}
