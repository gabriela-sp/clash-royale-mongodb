import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegracaoService } from './integracao.service'; 
import { CardService } from './card.service';
import { Player } from 'src/schemas/player.schema';

@Injectable()
export class NewAppService {
  private players: any[] = [];

  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    private readonly integracaoService: IntegracaoService,
    private readonly cardService: CardService,
  ) {}

  async ingestPlayers(): Promise<void> {
    try {
      const players = await this.integracaoService.getCards();
      this.players = players; // Armazenar jogadores
      for (const player of players) {
        try {
          const playerModel = new this.playerModel({
            name: player.name,
            id: player.id,
            maxLevel: player.maxLevel,
            elixirCost: player.elixirCost,
            iconUrls: player.iconUrls,
            rarity: player.rarity,
          });
          await playerModel.save();
        } catch (error) {
          console.error(`Erro ao obter dados do jogador ${player.name}: ${error.message}`);
        }
      }
      console.log('Players ingestados com sucesso!');
    } catch (error) {
      console.error('Erro ao ingestar players:', error);
    }
  }

  async ingestPlayerBattles(player: any) {
    console.log('Ingesting battles for player:', player.name);
    try {
      const battles = await this.integracaoService.getPlayerBattleLog(player.tag);
      console.log('Battles:', battles);
      for (const battleData of battles) {
        const playerData = new this.playerModel({
          name: player.name,
          battlesplayed: battleData.battles.length,
          level: player.expLevel,
          trophies: player.trophies,
          battles: battleData.battles,
        });
        console.log('Saving player data:', playerData);
        await playerData.save();
      }
      console.log('Battles ingested successfully for player:', player.name);
    } catch (error) {
      console.error('Error ingesting battles for player:', player.name, error);
    }
  }

  async ingestCards(): Promise<void> {
    try {
      const cards = await this.integracaoService.getCards();
      for (const card of cards) {
        if (!card.elixirCost) {
          card.elixirCost = 0; // Definir um valor padrão se o campo não estiver presente
        }
        await this.cardService.saveCard(card);
      }
      console.log('Cartas ingestadas com sucesso!');
    } catch (error) {
      console.error('Erro ao ingestar cartas:', error);
    }
  }
}
