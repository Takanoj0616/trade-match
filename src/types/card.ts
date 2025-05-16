export interface CardData {
  id: string; 
  name: string;
  imageUrl: string;
  cost: number; 
  attack?: number;
  health?: number; 
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; 
  type: 'unit' | 'action'; /
}