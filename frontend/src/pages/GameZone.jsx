import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const GameZone = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'tebakangka', name: 'Tebak Angka', emoji: '🎯' },
    { id: 'tictactoe', name: 'Tic Tac Toe', emoji: '❌' },
    { id: 'dadu', name: 'Dadu', emoji: '🎲' },
  ];

  return (
    <div className="min-h-screen bg-primary flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 glow-text">Game Zone</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect rounded-xl p-6 glow-border text-center cursor-pointer"
                  onClick={() => setActiveGame(game.id)}
                >
                  <div className="text-5xl mb-3">{game.emoji}</div>
                  <h3 className="text-lg font-semibold">{game.name}</h3>
                  <p className="text-sm text-gray-500">Klik untuk bermain</p>
                </motion.div>
              ))}
            </div>

            {activeGame === 'tebakangka' && (
              <div className="glass-effect rounded-xl p-6 glow-border">
                <TebakAngka />
              </div>
            )}

            {activeGame === 'tictactoe' && (
              <div className="glass-effect rounded-xl p-6 glow-border">
                <TicTacToe />
              </div>
            )}

            {activeGame === 'dadu' && (
              <div className="glass-effect rounded-xl p-6 glow-border">
                <Dadu />
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Game Component: Tebak Angka
const TebakAngka = () => {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('Masukkan angka 1-100!');
      return;
    }

    setAttempts(attempts + 1);
    if (num === target) {
      setMessage(`🎉 Benar! Jawaban: ${target} (${attempts + 1} percobaan)`);
      setTarget(Math.floor(Math.random() * 100) + 1);
      setAttempts(0);
    } else if (num < target) {
      setMessage('⬆️ Terlalu kecil!');
    } else {
      setMessage('⬇️ Terlalu besar!');
    }
    setGuess('');
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">🎯 Tebak Angka (1-100)</h3>
      <div className="flex gap-3">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
          className="bg-dark/50 border border-accent/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent w-32"
          placeholder="Angka"
        />
        <button
          onClick={handleGuess}
          className="bg-accent hover:bg-glow text-white px-6 py-2 rounded-lg transition"
        >
          Tebak
        </button>
        <button
          onClick={() => { setTarget(Math.floor(Math.random() * 100) + 1); setAttempts(0); setMessage(''); }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
        >
          Reset
        </button>
      </div>
      {message && (
        <p className={`mt-4 ${message.includes('Benar') ? 'text-cyber' : 'text-gray-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

// Game Component: Tic Tac Toe
const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(sq => sq !== null);

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? '❌' : '⭕';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">❌ Tic Tac Toe ⭕</h3>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="aspect-square bg-dark/50 border border-accent/20 rounded-lg text-3xl flex items-center justify-center hover:bg-dark/70 transition"
            disabled={cell || winner || isDraw}
          >
            {cell}
          </button>
        ))}
      </div>
      <div className="text-center mt-4">
        {winner && <p className="text-cyber text-lg">🏆 Pemenang: {winner}</p>}
        {isDraw && <p className="text-yellow-500 text-lg">🤝 Seri!</p>}
        <button
          onClick={resetGame}
          className="bg-accent hover:bg-glow text-white px-6 py-2 rounded-lg transition mt-2"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

// Game Component: Dadu
const Dadu = () => {
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    setRolling(true);
    const interval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setDice(Math.floor(Math.random() * 6) + 1);
      setRolling(false);
    }, 1000);
  };

  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">🎲 Dadu</h3>
      <div className="text-8xl mb-4">{diceEmojis[dice - 1]}</div>
      <p className="text-2xl font-bold text-accent mb-4">{dice}</p>
      <button
        onClick={rollDice}
        disabled={rolling}
        className="bg-accent hover:bg-glow text-white px-8 py-3 rounded-lg transition disabled:opacity-50"
      >
        {rolling ? '🌀 Lempar...' : '🎲 Lempar Dadu'}
      </button>
    </div>
  );
};

export default GameZone;
