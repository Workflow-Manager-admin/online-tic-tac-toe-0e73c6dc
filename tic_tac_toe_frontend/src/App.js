import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette as CSS variables for inline styles and custom styling
const COLORS = {
  primary: "#388e3c",   // Green
  secondary: "#1976d2", // Blue
  accent: "#fbc02d"     // Yellow
};

// Game helpers
const emptyBoard = () => Array(9).fill(null);

const getWinner = (squares) => {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],     // rows
    [0,3,6], [1,4,7], [2,5,8],     // cols
    [0,4,8], [2,4,6]               // diags
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const isDraw = (squares) => {
  return squares.every(cell => cell) && !getWinner(squares);
};

// PUBLIC_INTERFACE
function App() {
  const [board, setBoard] = useState(emptyBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Set up theme with provided color scheme - always light per requirements
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    const win = getWinner(board);
    setWinner(win);
    setDraw(isDraw(board) && !win);
  }, [board]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    // Don't allow moves after win/draw or on filled cells
    if (winner || board[idx]) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(emptyBoard());
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
  };

  // Game status message logic
  let statusMessage;
  if (winner) {
    statusMessage = (
      <span>
        <strong style={{ color: COLORS.primary }}>{winner}</strong> wins!
      </span>
    );
  } else if (draw) {
    statusMessage = <span style={{ color: COLORS.accent }}>It's a draw!</span>;
  } else {
    statusMessage = (
      <span>
        Turn: <strong style={{ color: xIsNext ? COLORS.primary : COLORS.secondary }}>
          {xIsNext ? "X" : "O"}
        </strong>
      </span>
    );
  }

  // Responsive Board size (vw units for true centering)
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#282c34",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: 380,
          minHeight: 540,
          padding: "36px 16px 20px 16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <header style={{ marginBottom: 16 }}>
          <h1
            style={{
              fontWeight: 700,
              fontSize: "2.1rem",
              margin: 0,
              letterSpacing: 0.5,
              color: COLORS.primary
            }}
          >
            Tic Tac Toe
          </h1>
          <p
            style={{
              fontSize: "1rem",
              margin: "6px 0 0 0",
              color: "#757575"
            }}
          >
            Two players · Minimalist UI · Modern design
          </p>
        </header>

        <section
          aria-label="Game Status"
          data-testid="game-status"
          style={{
            marginBottom: 10,
            fontSize: "1.15rem",
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {statusMessage}
        </section>

        <section
          className="game-board"
          aria-label="Tic Tac Toe Board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: 4,
            width: "min(70vw, 330px)",
            height: "min(70vw, 330px)",
            background: "#f8f9fa",
            borderRadius: 16,
            boxShadow: "0 1px 4px rgba(56, 142, 60, 0.08)",
            margin: "0 auto 24px auto",
            padding: 8,
            transition: "box-shadow 0.18s"
          }}
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              aria-label={`Cell ${idx} ${cell ? cell : "empty"}`}
              tabIndex={winner || board[idx] ? -1 : 0}
              className="ttt-cell"
              onClick={() => handleSquareClick(idx)}
              disabled={!!winner || !!cell}
              style={{
                width: "100%",
                height: "100%",
                fontSize: "2.1rem",
                lineHeight: 1,
                fontWeight: 600,
                color: cell === "X" ? COLORS.primary : cell === "O" ? COLORS.secondary : "#aaa",
                background: "#fff",
                border: `2px solid ${cell ? "#e0e0e0" : "#e9ecef"}`,
                borderRadius: 8,
                transition: "color 0.1s, background 0.12s, border 0.13s",
                cursor: !!winner || !!cell ? "not-allowed" : "pointer",
                appearance: "none",
                outline: "none"
              }}
            >
              {cell}
            </button>
          ))}
        </section>

        <section style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <button
            className="btn-reset"
            onClick={handleRestart}
            style={{
              background: COLORS.accent,
              color: "#212121",
              border: "none",
              borderRadius: 8,
              padding: "12px 30px",
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: 12,
              cursor: "pointer",
              boxShadow: "0 2px 9px rgba(251,192,45,0.06)",
              letterSpacing: ".08em",
              transition: "background 0.14s"
            }}
            aria-label="Reset game"
          >
            Restart Game
          </button>
          <small style={{
            color: "#aaa",
            fontSize: "0.89em"
          }}>
            Made with React · Light theme · <span style={{ color: COLORS.secondary }}>KAVIA</span> style
          </small>
        </section>
      </main>
      {/* Responsive style - optional for minimal touch */}
      <style>
        {`
          @media (max-width: 540px) {
            main {
              min-height: 415px !important;
              max-width: 98vw !important;
              padding: 22px 5vw 8vw 5vw !important;
            }
            .game-board {
              width: min(98vw, 98vw);
              height: min(98vw, 98vw);
              min-width: 215px;
              min-height: 215px;
            }
          }
          .ttt-cell:active {
            background: #f8f9fa;
          }
          .ttt-cell:focus {
            border: 2px solid ${COLORS.accent};
            outline: none;
          }
          .btn-reset:hover, .btn-reset:focus {
            background: #ffe28e;
          }
        `}
      </style>
    </div>
  );
}

export default App;
