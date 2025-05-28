import { useEffect, useState, useRef, useActionState } from "react";
import "./App.css";

const API_URL = "https://cheaderthecoder.github.io/5-Letter-words/words.json";
const WORD_LENGTH = 5;
const NUM_OF_GUESSES = 6;
const BASE_COLORS = ["black", "black", "black", "black", "black"];

export default function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(new Array(6).fill(["", BASE_COLORS]));
  const refIndex = useRef(0);
  const refGuess = useRef(["", BASE_COLORS]);
  const wordBank = useRef(new Set());
  const isGameover = useRef(false);
  const [guessMessage, setGuessMessage] = useState(null);

  const handleGameOver = () => {
    if (!isGameover.current) {
      setTimeout(() => {
        isGameover.current = true;
      }, 4000);
    } else {
      isGameover.current = false;
    }
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const randomWord =
          data.words[Math.floor(Math.random() * (data.words.length - 1))];
        data.words.forEach((word) => wordBank.current.add(word.toUpperCase()));
        setSolution(randomWord.toUpperCase());
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////

  const updateGuesses = (colors) => {
    const shallowGuess = [refGuess.current[0], colors];
    refGuess.current = shallowGuess;
    const shallowGuesses = [...guesses];
    shallowGuesses[refIndex.current] = refGuess.current;
    setGuesses(shallowGuesses);
  };

  const checkGuess = () => {
    if (wordBank.current.has(refGuess.current[0])) {
      let matchCount = 0;
      const updateColors = [];
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (refGuess.current[0][i] === solution[i]) {
          updateColors.push("green");
          matchCount++;
        } else if (solution.includes(refGuess.current[0][i])) {
          updateColors.push("yellow");
        } else {
          updateColors.push("grey");
        }
      }
      updateGuesses(updateColors);
      if (matchCount === WORD_LENGTH) {
        setGuessMessage(<p className="correct">Correct!</p>);
        return true;
      } else {
        setGuessMessage(<p className="try-again">Try again!</p>);
        return false;
      }
    } else {
      setGuessMessage(<p className="not-a-word">Not a word!</p>);
      return false;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Backspace" && refGuess.current[0].length > 0) {
        refGuess.current[0] = refGuess.current[0].slice(0, -1);
        updateGuesses(BASE_COLORS);
        return;
      }
      if (event.key === "Enter" && refGuess.current[0].length === WORD_LENGTH) {
        if (checkGuess() || refIndex.current === NUM_OF_GUESSES - 1) {
          handleGameOver();
          return;
        } else {
          const shallowGuess = ["", BASE_COLORS];
          refGuess.current = shallowGuess;
          refIndex.current++;
          return;
        }
      }
      if (
        /[a-zA-Z]/.test(event.key) &&
        event.key.length === 1 &&
        refGuess.current[0].length < WORD_LENGTH
      ) {
        refGuess.current[0] += event.key.toUpperCase();
        updateGuesses(BASE_COLORS);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses]);

  return (
    <>
      {guessMessage}
      <div>
        <div>{solution}</div>
        <div className="board">
          {guesses.map((guess, index) => {
            return <Row guess={guess} key={index} />;
          })}
        </div>
      </div>
      {isGameover.current && <button onClick={handleGameOver}>Reset</button>}
    </>
  );
}

function Row({ guess }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[0][i];
    const className = `tile ${guess[1][i]}`;
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
}
