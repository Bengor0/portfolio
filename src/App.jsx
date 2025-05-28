import { useRef, useState, useEffect } from "react";
import './App.css';

const API_URL = "https://cheaderthecoder.github.io/5-Letter-words/words.json";
const WORD_LENGTH = 5;
const NUM_OF_GUESSES = 6;
const BASE_COLORS = ["", "", "", "", ""];

export default function App() {
  const solution = useRef("");
  const guess = useRef(["", BASE_COLORS]);
  const [guesses, setGuesses] = useState(
    new Array(NUM_OF_GUESSES).fill(["", BASE_COLORS])
  );
  const rowIndex = useRef(0);
  const isGameOver = useRef(false);
  const restart = useRef(false);
  const wordSet = useRef(new Set());
  const [message, setMessage] = useState(<p className="message">----</p>);

  const restartGame = () => {
    guess.current = ["", BASE_COLORS];
    setGuesses(new Array(NUM_OF_GUESSES).fill(["", BASE_COLORS]));
    rowIndex.current = 0;
    isGameOver.current = false;
    wordSet.current = new Set();
    setMessage(<p className="message"></p>);
    restart.current = !restart.current;
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const wordArray = [...data.words];
        wordArray.forEach((word) => wordSet.current.add(word.toUpperCase()));
        const randomWord =
          wordArray[Math.floor(Math.random() * (wordArray.length - 1))];
        solution.current = randomWord.toUpperCase();
        console.log(solution.current);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, [restart.current]);

  const updateGuesses = () => {
    const shallowGuesses = [...guesses];
    shallowGuesses[rowIndex.current] = guess.current;
    setGuesses(shallowGuesses);
  };

  const checkGuess = () => {
    const colors = [];
    let correctCount = 0;

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess.current[0][i] === solution.current[i]) {
        colors.push("green flipped");
        correctCount++;
      } else if (solution.current.includes(guess.current[0][i])) {
        colors.push("orange flipped");
      } else colors.push("grey flipped");
    }

    if (correctCount === WORD_LENGTH) {
      setMessage(<Message message={"Correct!"} />);
      isGameOver.current = true;
    } else setMessage(<Message message={"Try again."} />);

    guess.current = [guess.current[0], colors];
    updateGuesses();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isGameOver.current) {
        if (event.key === "Enter" && guess.current[0].length === WORD_LENGTH) {
          if (wordSet.current.has(guess.current[0])) {
            checkGuess();
            rowIndex.current = rowIndex.current + 1;
            guess.current = ["", BASE_COLORS];
            if (rowIndex.current >= NUM_OF_GUESSES) {
              isGameOver.current = true;
              return;
            }
          } else {
            setMessage(<Message message={"Not in the word bank!"} />);
            return;
          }
        } else if (rowIndex.current < NUM_OF_GUESSES) {
          if (event.key === "Backspace" && guess.current[0].length > 0) {
            guess.current[0] = guess.current[0].slice(0, -1);
            updateGuesses(guess.current);
          } else if (
            /[a-zA-Z]/.test(event.key) &&
            event.key.length === 1 &&
            guess.current[0].length < WORD_LENGTH
          ) {
            guess.current[0] = guess.current[0] + event.key.toUpperCase();
            updateGuesses(guess.current);
          } else return;
        }
      } else return;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses]);

  return (
    <>
      {message}
      {guesses.map((guess, i) => {
        return <Row guess={guess} key={i} />;
      })}
      {isGameOver.current === true && <button onClick={restartGame}>Play again</button>}
    </>
  );
}

function Row({ guess }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    let char = guess[0][i];
    let className = `tile ${guess[1][i]}`;

    tiles.push(
      <div className={className} key={i} style={{"--index" : i}}>
        <span className="letter" style={{"--index" : i}}>{char}</span>
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
}

function Message({ message }) {
  return <p className="message">{message}</p>;
}
