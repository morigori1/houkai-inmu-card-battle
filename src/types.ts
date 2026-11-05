export interface Card {
  id: string;
  name: string;
  cost: number;
  attack: number;
  description: string;
  quote: string;
  rarity: 'common' | 'rare' | 'legendary';
  effect?: CardEffect;
}

export interface CardEffect {
  type: 'damage' | 'heal' | 'drawCard' | 'gainSAN' | 'gainHeat';
  value: number;
}

export interface Character {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  san: number;
  maxSAN: number;
  heat: number;
  maxHeat: number;
}

export interface GameState {
  player: Character;
  enemy: Character;
  playerHand: Card[];
  playerDeck: Card[];
  playerDiscard: Card[];
  enemyHand: Card[];
  enemyDeck: Card[];
  enemyDiscard: Card[];
  turn: number;
  phase: 'player' | 'enemy' | 'gameOver';
  winner?: 'player' | 'enemy';
  energy: number;
  maxEnergy: number;
  combos: string[];
  lastPlayedCards: Card[];
}

export interface PlayResult {
  damage: number;
  healing: number;
  cardsDrawn: number;
  sanGained: number;
  heatGained: number;
  comboTriggered?: string;
}
