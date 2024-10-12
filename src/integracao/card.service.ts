import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from '../schemas/card.schema'

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private readonly cardModel: Model<Card>) {}

  async saveCard(card: Card): Promise<Card> {
    const newCard = new this.cardModel(card);
    return await newCard.save();
  }
}