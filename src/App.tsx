import { useState, useEffect, useCallback } from 'react';
import { GameState, Card } from './types';
import { createInitialState, drawCards, playCard, endTurn, checkCombo } from './gameLogic';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = createInitialState();
    return drawCards(initial, 4, true);
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [comboMessage, setComboMessage] = useState<string | null>(null);
  const [shakeEnemy, setShakeEnemy] = useState(false);
  const [cardEffect, setCardEffect] = useState<string | null>(null);

  const handlePlayCard = useCallback((card: Card) => {
    if (gameState.phase !== 'player' || gameState.energy < card.cost) return;

    setCardEffect(card.id);
    setTimeout(() => setCardEffect(null), 500);

    const { state: newState, result } = playCard(gameState, card, true);
    
    if (result.damage > 0) {
      setShakeEnemy(true);
      setTimeout(() => setShakeEnemy(false), 500);
    }

    const { state: comboState, comboMessage: combo } = checkCombo(newState);
    
    if (combo) {
      setComboMessage(combo);
      setTimeout(() => setComboMessage(null), 2000);
    }

    setGameState(comboState);
    setSelectedCard(null);
  }, [gameState]);

  const handleEndTurn = useCallback(() => {
    if (gameState.phase !== 'player') return;
    const newState = endTurn(gameState, true);
    setGameState(newState);
  }, [gameState]);

  const handleRestart = useCallback(() => {
    const initial = createInitialState();
    setGameState(drawCards(initial, 4, true));
    setSelectedCard(null);
    setComboMessage(null);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.phase !== 'player') return;

      if (e.key === 'e' || e.key === 'E') {
        handleEndTurn();
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const card = gameState.playerHand[index];
        if (card && gameState.energy >= card.cost) {
          handlePlayCard(card);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, handleEndTurn, handlePlayCard]);

  if (gameState.phase === 'gameOver') {
    return (
      <div className="game-container">
        <h1 className="title">崩壊淫夢カードバトル</h1>
        <div className="game-over">
          <div className="game-over-title">
            {gameState.winner === 'player' ? 'You Win!' : 'Game Over'}
          </div>
          <div className="game-over-message">
            {gameState.winner === 'player'
              ? 'イキスギィ！完全勝利UC'
              : 'まずいですよ！'}
          </div>
          <button className="btn btn-primary" onClick={handleRestart}>
            もう一回いいっすか？
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="title">崩壊淫夢カードバトル</h1>
      <div className="turn-info">
        ターン {gameState.turn} | {gameState.phase === 'player' ? 'あなたのターン' : '相手のターン'}
      </div>

      {comboMessage && <div className="combo-message">{comboMessage}</div>}

      <div className="battlefield">
        <div className={`character-area ${shakeEnemy ? 'shake' : ''}`}>
          <div className="character-header">
            <div className="character-name">{gameState.enemy.name}</div>
          </div>
          <div className="stats-grid">
            <div className="stat-bar">
              <div className="stat-label">HP</div>
              <div className="stat-value">
                {gameState.enemy.hp} / {gameState.enemy.maxHp}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill hp"
                  style={{ width: `${(gameState.enemy.hp / gameState.enemy.maxHp) * 100}%` }}
                />
              </div>
            </div>
            <div className="stat-bar">
              <div className="stat-label">SAN値</div>
              <div className="stat-value">
                {gameState.enemy.san} / {gameState.enemy.maxSAN}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill san"
                  style={{ width: `${(gameState.enemy.san / gameState.enemy.maxSAN) * 100}%` }}
                />
              </div>
            </div>
            <div className="stat-bar">
              <div className="stat-label">熱量</div>
              <div className="stat-value">
                {gameState.enemy.heat} / {gameState.enemy.maxHeat}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill heat"
                  style={{ width: `${(gameState.enemy.heat / gameState.enemy.maxHeat) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="character-area">
          <div className="character-header">
            <div className="character-name">{gameState.player.name}</div>
          </div>
          <div className="stats-grid">
            <div className="stat-bar">
              <div className="stat-label">HP</div>
              <div className="stat-value">
                {gameState.player.hp} / {gameState.player.maxHp}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill hp"
                  style={{ width: `${(gameState.player.hp / gameState.player.maxHp) * 100}%` }}
                />
              </div>
            </div>
            <div className="stat-bar">
              <div className="stat-label">SAN値</div>
              <div className="stat-value">
                {gameState.player.san} / {gameState.player.maxSAN}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill san"
                  style={{ width: `${(gameState.player.san / gameState.player.maxSAN) * 100}%` }}
                />
              </div>
            </div>
            <div className="stat-bar">
              <div className="stat-label">熱量</div>
              <div className="stat-value">
                {gameState.player.heat} / {gameState.player.maxHeat}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill heat"
                  style={{ width: `${(gameState.player.heat / gameState.player.maxHeat) * 100}%` }}
                />
              </div>
            </div>
            <div className="stat-bar">
              <div className="stat-label">エネルギー</div>
              <div className="stat-value">
                {gameState.energy} / {gameState.maxEnergy}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill energy"
                  style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hand-area">
        <div className="hand-header">手札</div>
        <div className="hand-grid">
          {gameState.playerHand.map((card) => {
            const canPlay = gameState.phase === 'player' && gameState.energy >= card.cost;
            const isSelected = selectedCard?.id === card.id;
            return (
              <div
                key={card.id}
                className={`card ${card.rarity} ${!canPlay ? 'disabled' : ''} ${
                  cardEffect === card.id ? 'card-effect' : ''
                }`}
                onClick={() => canPlay && handlePlayCard(card)}
                style={{
                  borderColor: isSelected ? '#fbbf24' : undefined,
                  borderWidth: isSelected ? '3px' : undefined,
                }}
              >
                <div className="card-cost">{card.cost}</div>
                <div className="card-name">{card.name}</div>
                {card.attack > 0 && <div className="card-attack">⚔️ {card.attack}</div>}
                <div className="card-description">{card.description}</div>
                <div className="card-quote">「{card.quote}」</div>
              </div>
            );
          })}
        </div>
        {gameState.phase === 'player' && (
          <div className="keyboard-hint">
            キーボード: 1-9でカードをプレイ | Eでターン終了
          </div>
        )}
      </div>

      {gameState.phase === 'player' && (
        <div className="actions">
          <button className="btn btn-primary" onClick={handleEndTurn}>
            ターン終了 (E)
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
