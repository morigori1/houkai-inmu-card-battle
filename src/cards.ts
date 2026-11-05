import { Card } from './types';

export const CARDS: Card[] = [
  {
    id: 'c1',
    name: '野獣先輩',
    cost: 3,
    attack: 40,
    description: '標準的な攻撃カード',
    quote: 'まずウチさぁ、屋上あんだけど',
    rarity: 'legendary',
  },
  {
    id: 'c2',
    name: '遠野',
    cost: 2,
    attack: 25,
    description: '素早い攻撃',
    quote: 'いいよ、こいよ',
    rarity: 'rare',
  },
  {
    id: 'c3',
    name: 'MUR',
    cost: 1,
    attack: 15,
    description: '低コスト攻撃',
    quote: 'オッスお願いしまーす',
    rarity: 'common',
  },
  {
    id: 'c4',
    name: 'KMR',
    cost: 2,
    attack: 20,
    description: '標準攻撃',
    quote: '何だこいつ!?',
    rarity: 'common',
  },
  {
    id: 'c5',
    name: 'ジャスティス学園',
    cost: 4,
    attack: 50,
    description: '強力な一撃',
    quote: 'ジャスティス学園強いんすよ',
    rarity: 'rare',
  },
  {
    id: 'c6',
    name: '114514点',
    cost: 5,
    attack: 60,
    description: '大ダメージ',
    quote: '114514点',
    rarity: 'legendary',
  },
  {
    id: 'c7',
    name: 'ハッキリわかんだね',
    cost: 1,
    attack: 10,
    description: 'カードを1枚引く',
    quote: 'ハッキリわかんだね',
    rarity: 'common',
    effect: { type: 'drawCard', value: 1 },
  },
  {
    id: 'c8',
    name: 'アイスティー',
    cost: 2,
    attack: 0,
    description: '体力を20回復',
    quote: 'アイスティーください',
    rarity: 'rare',
    effect: { type: 'heal', value: 20 },
  },
  {
    id: 'c9',
    name: 'なんでもしますから！',
    cost: 1,
    attack: 5,
    description: 'SAN+10',
    quote: 'なんでもしますから！',
    rarity: 'common',
    effect: { type: 'gainSAN', value: 10 },
  },
  {
    id: 'c10',
    name: 'イキスギィ！',
    cost: 3,
    attack: 35,
    description: '熱量+15',
    quote: 'イキスギィ！',
    rarity: 'rare',
    effect: { type: 'gainHeat', value: 15 },
  },
  {
    id: 'c11',
    name: 'ンアッー！',
    cost: 2,
    attack: 30,
    description: '叫び攻撃',
    quote: 'ンアッー！',
    rarity: 'common',
  },
  {
    id: 'c12',
    name: 'ヌッ！',
    cost: 1,
    attack: 20,
    description: '素早い一撃',
    quote: 'ヌッ！',
    rarity: 'common',
  },
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  CARDS.forEach(card => {
    const count = card.rarity === 'legendary' ? 1 : card.rarity === 'rare' ? 2 : 3;
    for (let i = 0; i < count; i++) {
      deck.push({ ...card, id: `${card.id}_${i}` });
    }
  });
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
