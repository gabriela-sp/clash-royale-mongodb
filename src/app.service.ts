import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './schemas/player.schema';


@Injectable()
export class AppService {
  constructor(@InjectModel(Player.name) private readonly battleModel: Model<Player>) { }

  async getWinLossPercentage(cardName: string, startDate: Date, endDate: Date) {

    const startBattletime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';
    const endBattletime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';

    const battles = await this.battleModel.aggregate([
      { $unwind: '$battles' },
      {
        $match: {
          'battles.battletime': {
            $gte: startBattletime,
            $lte: endBattletime,
          },
        },
      },
      { $match: { 'battles.deck.name': cardName } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          wins: { $sum: { $cond: ['$battles.won', 1, 0] } },
        },
      },
      {
        $project: {
          winPercentage: { $multiply: [{ $divide: ['$wins', '$total'] }, 100] },
          lossPercentage: { $multiply: [{ $divide: [{ $subtract: ['$total', '$wins'] }, '$total'] }, 100] },
        },
      },
    ]);
  
    return battles[0] || { winPercentage: 0, lossPercentage: 0 };
  }
  
  

  async getDecksWithWinPercentage(minPercentage: number, startDate: Date, endDate: Date) {
    const startBattletime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';
    const endBattletime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';
   
    const battles = await this.battleModel.aggregate([
      { $unwind: '$battles' },
      { $unwind: '$battles.deck' },
      { $match: { 'battles.battletime': { $gte: startBattletime, $lte: endBattletime } } },
      {
        $group: {
          _id: '$battles.deck.name', 
          total: { $sum: 1 }, 
          wins: { $sum: { $cond: ['$battles.won', 1, 0] } }, 
        },
      },
      {
        $project: {
          _id: 0, 
          cardName: '$_id',
          total: 1,
          wins: 1,
          winPercentage: { $multiply: [{ $divide: ['$wins', '$total'] }, 100] },
        },
      },
      { $match: { winPercentage: { $gte: minPercentage } } },
    ]);
    

    return battles;
  }

  async getLossesByCombo(combo: string[] | string, startDate: Date, endDate: Date) {
    const startBattletime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';
    const endBattletime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';

    combo = Array.isArray(combo) ? combo : [combo];

    const battles = await this.battleModel.aggregate([
      { $unwind: '$battles' },
      { $match: { 'battles.battletime': { $gte: startBattletime, $lte: endBattletime } } },
      {
        $match: {
          'battles.deck.name': { $all: combo },
          'battles.won': false,
        },
      },
      {
        $group: {
          _id: null,
          totalLosses: { $sum: 1 },
        },
      },
    ]);

    return battles[0] ? battles[0].totalLosses : 0;
  }

  async getSpecificWins(cardName: string, trophyDiffPercentage: number) {
    const result = await this.battleModel.aggregate([
      { $unwind: '$battles' }, 
      {
        $match: {
          'battles.deck.name': cardName,         
          'battles.won': true,                  
          'battles.opptowersdestroyed': { $gte: 2 }, 
          $expr: {
            $lt: [
              { $subtract: ['$battles.trophiesonstart', '$battles.opptrophiesonstart'] }, 
              { $multiply: ['$battles.opptrophiesonstart', trophyDiffPercentage / 100] }, 
            ],
          },
        },
      },
      { $count: 'totalWins' }, 
    ]);
  
    return result.length > 0 ? result[0].totalWins : 0; 
  }
  
  
  async getTopCombos(comboSize: number, winPercentage: number, startDate: Date, endDate: Date) {
    const startBattletime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';
    const endBattletime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';

    const battles = await this.battleModel.aggregate([
      { $unwind: '$battles' },
      { $match: { 'battles.battletime': { $gte: startBattletime, $lte: endBattletime } } },
      {
        $project: {
          deck: {
            $slice: ['$battles.deck', comboSize],
          },
          won: '$battles.won',
        },
      },
      {
        $group: {
          _id: '$deck',
          total: { $sum: 1 },
          wins: { $sum: { $cond: ['$won', 1, 0] } },
        },
      },
      {
        $project: {
          winPercentage: { $multiply: [{ $divide: ['$wins', '$total'] }, 100] },
        },
      },
      { $match: { winPercentage: { $gte: winPercentage } } },
    ]);

    return battles;
  }

  async findMostUsedCardsByLevel(level: number, limit: number) {
    return this.battleModel.aggregate([
      {
        $match: {
          level: level
        }
      },
      {
        $unwind: '$battles' 
      },
      {
        $unwind: '$battles.deck' 
      },
      {
        $group: {
          _id: '$battles.deck.name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      }
    ]);
  }
  

  async getUndefeatedPlayers(trophies: number) {
    return this.battleModel.find({
      trophies: { $gt: trophies },
      'battles.won': { $ne: false },
      battles: { $elemMatch: { won: true } } 
    });
  }

  async getCardsWithHighLossRate(startDate: Date, endDate: Date, limit: number = 10) {
    const startBattletime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';
    const endBattletime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + '000Z';

    return await this.battleModel.aggregate([
      {
        $match: {
          'battles.battletime': { $gte: startBattletime, $lte: endBattletime }
        }
      },
      {
        $unwind: '$battles'
      },
      {
        $unwind: '$battles.deck'
      },
      {
        $group: {
          _id: '$battles.deck.name',
          totalGames: { $sum: 1 }, 
          totalLosses: {
            $sum: {
              $cond: [{ $eq: ['$battles.won', false] }, 1, 0] 
            }
          }
        }
      },
      {
        $project: {
          lossRate: {
            $cond: [
              { $gt: ['$totalGames', 0] }, 
              { $divide: ['$totalLosses', '$totalGames'] },
              0
            ]
          },
          totalGames: 1,
          totalLosses: 1
        }
      },
      {
        $sort: { lossRate: -1 } 
      },
      {
        $limit: limit 
      }
    ]);
  } 

}
