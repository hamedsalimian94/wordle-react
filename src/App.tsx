import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const ANS_LENGTH = 5;
  const ATTEMPTS_COUNT = 6;
  const FINAL_ANSWER = "PANEL";

  const [guesses, setGuesses] = useState(Array(ATTEMPTS_COUNT).fill(""));
  const [attempt, setAttempt] = useState(0);
  const [gameIsOver, setGameIsOver] = useState(false);

  function handleSubmit() {
    const currentGuess = guesses[attempt];
    if (currentGuess.length < ANS_LENGTH) return;
    else {
      if (currentGuess.toUpperCase() === FINAL_ANSWER.toUpperCase()) {
        setGameIsOver(true);
        window.removeEventListener("keyup", keyUpHandler);
      } else {
        // make colorized letters
        if (attempt === ATTEMPTS_COUNT - 1) {
          setGameIsOver(true);
          window.removeEventListener("keyup", keyUpHandler);
        } else setAttempt(attempt + 1);
      }
    }
  }

  function keyUpHandler(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Backspace") {
      setGuesses((guesses) => {
        const newGuesses = [...guesses];
        newGuesses[attempt] = newGuesses[attempt].slice(0, -1);
        return newGuesses;
      });
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      setGuesses((guesses) => {
        if (guesses[attempt].length < 5) {
          const newGuesses = [...guesses];
          newGuesses[attempt] = newGuesses[attempt] + e.key.toUpperCase();
          return newGuesses;
        } else return guesses;
      });
    }
  }

  function getLetterColor(row: number, column: number) {
    const char = guesses[row][column];
    const answerChar = FINAL_ANSWER[column];
    if (char === answerChar) return "correct";
    if (FINAL_ANSWER.includes(char)) return "misplaced";
    return "wrong";
  }

  const Row = ({ guess, index }: { guess: string; index: number }) => {
    return (
      <div className="row">
        {Array(ANS_LENGTH)
          .fill(null)
          .map((_, i) => (
            <span
              className={`letter ${
                index < attempt || (gameIsOver && index === attempt)
                  ? getLetterColor(index, i)
                  : ""
              }`}
            >
              {guess[i]}
            </span>
          ))}
      </div>
    );
  };

  const Board = () => {
    return (
      <>
        {guesses.map((guess, idx) => (
          <Row guess={guess} index={idx} />
        ))}
      </>
    );
  };

  useEffect(() => {
    window.addEventListener("keyup", keyUpHandler);
    return () => window.removeEventListener("keyup", keyUpHandler);
  }, [guesses, attempt]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome to the Wordle world!</h1>
      <div className="board">
        <Board />

        {gameIsOver ? (
          <h1>Game Is Over</h1>
        ) : (
          <div className="button-container">
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
