import { useEffect, useState, useRef } from "react";
import "./App.css";

const API_URL = "https://cheaderthecoder.github.io/5-Letter-words/words.json";
const WORD_LENGTH = 5;

export default function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(new Array(6).fill(""));
  const refIndex = useRef(0);
  const refGuess = useRef("");
  const wordBank = useRef(new Set());
  const isGameover = useRef(false);
  const [guessMessage, setGuessMessage] = useState(null);

  const updateGuesses = () => {
    const shallowGuesses = [...guesses];
    shallowGuesses[refIndex.current] = refGuess.current;
    setGuesses(shallowGuesses);
  };

  const checkGuess = () => {
    if (wordBank.current.has(refGuess.current)) {
      for (let i = 0; i < WORD_LENGTH; i++){

      }
    } else {
      setGuessMessage(<p className="not-a-word">Not a word!</p>);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Backspace" && refGuess.current.length > 0) {
        refGuess.current = refGuess.current.slice(0, -1);
        updateGuesses();
        return;
      }
      if (event.key === "Enter" && refGuess.current.length === 5) {
        refGuess.current = "";
        refIndex.current++;
        return;
      }
      if (
        /[a-zA-Z]/.test(event.key) &&
        event.key.length === 1 &&
        refGuess.current.length < 5
      ) {
        refGuess.current += event.key.toUpperCase();
        updateGuesses();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses]);

  return (
    <>
      {guessMessage}
      {!isGameover.current && (
        <div>
          <div>{solution}</div>
          <div className="board">
            {guesses.map((guess, index) => {
              return <Row guess={guess} key={index} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}

function Row({ guess }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    tiles.push(
      <div key={i} className="tile">
        {char}
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
}
