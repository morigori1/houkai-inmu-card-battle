import { GameState, Card, PlayResult } from './types';
import { createDeck, shuffleDeck } from './cards';

export function createInitialState(): GameState {
  const playerDeck = createDeck();
  const enemyDeck = createDeck();

  return {
    player: {
      id: 'player',
      name: 'あなた',
      hp: 100,
      maxHp: 100,
      san: 50,
      maxSAN: 100,
      heat: 0,
      maxHeat: 100,
    },
    enemy: {
      id: 'enemy',
      name: '田所浩二',
      hp: 120,
      maxHp: 120,
      san: 50,
      maxSAN: 100,
      heat: 0,
      maxHeat: 100,
    },
    playerHand: [],
    playerDeck,
    playerDiscard: [],
    enemyHand: [],
    enemyDeck,
    enemyDiscard: [],
    turn: 1,
    phase: 'player',
    energy: 3,
    maxEnergy: 3,
    combos: [],
    lastPlayedCards: [],
  };
}

export function drawCards(state: GameState, count: number, isPlayer: boolean): GameState {
  const newState = { ...state };
  const hand = isPlayer ? [...newState.playerHand] : [...newState.enemyHand];
  let deck = isPlayer ? [...newState.playerDeck] : [...newState.enemyDeck];
  let discard = isPlayer ? [...newState.playerDiscard] : [...newState.enemyDiscard];

  for (let i = 0; i < count; i++) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      deck = shuffleDeck(discard);
      discard = [];
    }
    const card = deck.pop();
    if (card) hand.push(card);
  }

  if (isPlayer) {
    newState.playerHand = hand;
    newState.playerDeck = deck;
    newState.playerDiscard = discard;
  } else {
    newState.enemyHand = hand;
    newState.enemyDeck = deck;
    newState.enemyDiscard = discard;
  }

  return newState;
}

export function playCard(state: GameState, card: Card, isPlayer: boolean): { state: GameState; result: PlayResult } {
  const newState = { ...state };
  const attacker = isPlayer ? { ...newState.player } : { ...newState.enemy };
  const defender = isPlayer ? { ...newState.enemy } : { ...newState.player };

  const result: PlayResult = {
    damage: card.attack,
    healing: 0,
    cardsDrawn: 0,
    sanGained: 0,
    heatGained: 0,
  };

  defender.hp = Math.max(0, defender.hp - card.attack);

  if (card.effect) {
    switch (card.effect.type) {
      case 'heal':
        result.healing = card.effect.value;
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + card.effect.value);
        break;
      case 'drawCard':
        result.cardsDrawn = card.effect.value;
        break;
      case 'gainSAN':
        result.sanGained = card.effect.value;
        attacker.san = Math.min(attacker.maxSAN, attacker.san + card.effect.value);
        break;
      case 'gainHeat':
        result.heatGained = card.effect.value;
        attacker.heat = Math.min(attacker.maxHeat, attacker.heat + card.effect.value);
        break;
    }
  }

  if (isPlayer) {
    newState.player = attacker;
    newState.enemy = defender;
    newState.energy -= card.cost;
    newState.playerHand = newState.playerHand.filter(c => c.id !== card.id);
    newState.playerDiscard.push(card);
    newState.lastPlayedCards = [...newState.lastPlayedCards, card];
  } else {
    newState.enemy = attacker;
    newState.player = defender;
    newState.enemyHand = newState.enemyHand.filter(c => c.id !== card.id);
    newState.enemyDiscard.push(card);
  }

  if (result.cardsDrawn > 0) {
    return { state: drawCards(newState, result.cardsDrawn, isPlayer), result };
  }

  return { state: newState, result };
}

export function checkCombo(state: GameState): { state: GameState; comboMessage?: string } {
  const lastTwo = state.lastPlayedCards.slice(-2);
  if (lastTwo.length < 2) return { state };

  const names = lastTwo.map(c => c.name);
  
  if (names.includes('野獣先輩') && names.includes('遠野')) {
    const newState = { ...state };
    newState.player.heat = Math.min(newState.player.maxHeat, newState.player.heat + 20);
    return { state: newState, comboMessage: 'コンボ！「野獣と遠野」熱量+20' };
  }

  if (names.includes('MUR') && names.includes('KMR')) {
    const newState = { ...state };
    newState.player.san = Math.min(newState.player.maxSAN, newState.player.san + 15);
    return { state: newState, comboMessage: 'コンボ！「四章」SAN+15' };
  }

  return { state };
}

export function enemyAI(state: GameState): GameState {
  let newState = { ...state };
  
  const playableCards = newState.enemyHand.filter(c => c.cost <= 3);
  if (playableCards.length === 0) {
    return endTurn(newState, false);
  }

  const enemyHP = newState.enemy.hp;
  const enemyMaxHP = newState.enemy.maxHp;
  const needsHealing = enemyHP < enemyMaxHP * 0.4;

  let cardToPlay: Card | undefined;

  if (needsHealing) {
    cardToPlay = playableCards.find(c => c.effect?.type === 'heal') || playableCards[0];
  } else {
    playableCards.sort((a, b) => b.attack - a.attack);
    cardToPlay = playableCards[0];
  }

  if (cardToPlay) {
    const { state: updatedState } = playCard(newState, cardToPlay, false);
    newState = updatedState;
  }

  return endTurn(newState, false);
}

export function endTurn(state: GameState, isPlayer: boolean): GameState {
  let newState = { ...state };

  if (newState.player.hp <= 0) {
    newState.phase = 'gameOver';
    newState.winner = 'enemy';
    return newState;
  }

  if (newState.enemy.hp <= 0) {
    newState.phase = 'gameOver';
    newState.winner = 'player';
    return newState;
  }

  if (isPlayer) {
    newState.playerDiscard.push(...newState.playerHand);
    newState.playerHand = [];
    newState.phase = 'enemy';
    newState = drawCards(newState, 3, false);
    newState.lastPlayedCards = [];
    return enemyAI(newState);
  } else {
    newState.enemyDiscard.push(...newState.enemyHand);
    newState.enemyHand = [];
    newState.phase = 'player';
    newState.turn += 1;
    newState.energy = Math.min(10, newState.maxEnergy + Math.floor(newState.turn / 3));
    newState.maxEnergy = newState.energy;
    newState = drawCards(newState, 4, true);
    newState.lastPlayedCards = [];
    return newState;
  }
}
