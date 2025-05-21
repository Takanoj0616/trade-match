export type CardType = 'unit' | 'spell' | 'trap';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CardData {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: CardType;
  rarity: CardRarity;
  imageUrl: string;
  attack?: number;  // ユニットカードの場合のみ
  health?: number;  // ユニットカードの場合のみ
}