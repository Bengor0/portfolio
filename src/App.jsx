import { useRef, useState, useEffect, createContext } from "react";
import useToggleState from "./hooks/useToggleState";
import KeyBoard from "./components/KeyBoard";
import "./App.css";

const API_URL = "https://cheaderthecoder.github.io/5-Letter-words/words.json";
const WORD_LENGTH = 5;
const NUM_OF_GUESSES = 6;
const BASE_COLORS = ["black", "black", "black", "black", "black"];

export default function App() {
  const solution = useRef("");
  const guess = useRef(["", BASE_COLORS]);
  const [guesses, setGuesses] = useState(
    new Array(NUM_OF_GUESSES).fill(["", BASE_COLORS])
  );
  const rowIndex = useRef(0);
  const [isGameOver, toggleIsGameOver] = useToggleState(false);
  const [restart, toggleRestart] = useToggleState(false);
  const wordSet = useRef(new Set());
  const [message, setMessage] = useState(<p className="message">----</p>);
  const KeyboardContext = createContext();

  const restartGame = () => {
    guess.current = ["", BASE_COLORS];
    setGuesses(new Array(NUM_OF_GUESSES).fill(["", BASE_COLORS]));
    rowIndex.current = 0;
    document
      .querySelectorAll(".keyboard-key.letter")
      .forEach((element) => (element.style.backgroundColor = "#808080"));
    toggleIsGameOver();
    wordSet.current = new Set();
    setMessage(<p className="message"></p>);
    toggleRestart();
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
  }, [restart]);

  const updateGuesses = () => {
    const shallowGuesses = [...guesses];
    shallowGuesses[rowIndex.current] = guess.current;
    setGuesses(shallowGuesses);
  };

  const udpateKeyColor = (i, color) => {
    setTimeout(() => {
      document.getElementById(`${guess.current[0][i]}`).style.backgroundColor =
        color;
    }, 2200);
    console.log("hello");
  };

  const checkGuess = () => {
    const colors = [];
    let correctCount = 0;

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess.current[0][i] === solution.current[i]) {
        colors.push("green");
        udpateKeyColor(i, "green");
        correctCount++;
      } else if (solution.current.includes(guess.current[0][i])) {
        colors.push("orange");
        udpateKeyColor(i, "#cc8400");
      } else {
        colors.push("grey");
        udpateKeyColor(i, "#403c3c");
      }
    }

    if (correctCount === WORD_LENGTH) {
      setMessage(<Message message={"Correct!"} />);
      toggleIsGameOver();
    } else setMessage(<Message message={"Try again."} />);

    guess.current = [guess.current[0], colors];
    updateGuesses();
  };

  const handleKeyClick = (event) => {
    handleKey(event.target.id);
  };

  const handleKey = async (key) => {
    if (!isGameOver) {
      if (key === "ENTER" && guess.current[0].length === WORD_LENGTH) {
        if (wordSet.current.has(guess.current[0])) {
          checkGuess();
          await delay(2200);
          rowIndex.current = rowIndex.current + 1;
          guess.current = ["", BASE_COLORS];
          if (rowIndex.current >= NUM_OF_GUESSES) {
            toggleIsGameOver();
            return;
          }
        } else {
          setMessage(<Message message={"Not in the word bank!"} />);
          return;
        }
      } else if (rowIndex.current < NUM_OF_GUESSES) {
        if (key === "BACKSPACE" && guess.current[0].length > 0) {
          guess.current[0] = guess.current[0].slice(0, -1);
          updateGuesses(guess.current);
        } else if (
          /[A-Z]/.test(key) &&
          key.length === 1 &&
          guess.current[0].length < WORD_LENGTH
        ) {
          guess.current[0] = guess.current[0] + key.toUpperCase();
          updateGuesses(guess.current);
        } else return;
      }
    } else return;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKey(event.key.toUpperCase());
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses]);

  return (
    <>
      <div className="board">
        {guesses.map((guess, i) => {
          return <Row guess={guess} key={i} />;
        })}
      </div>
      <div className="bottom-container">
        {isGameOver ? <button className="restart-button" onClick={restartGame}>Play again</button> : <KeyBoard handleKeyClick={handleKeyClick} />}
      </div>
    </>
  );
}

function Row({ guess }) {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    let char = guess[0][i];
    let tileClassName = `tile ${guess[1][i]}`;
    let spanClassName = `letter ${guess[1][i]}`;

    tiles.push(
      <div className={tileClassName} key={i} style={{ "--index": i }}>
        <div className="tile-inner" style={{ "--index": i }}>
          <div className="letter black" style={{ "--index": i }}>
            <span>{char}</span>
          </div>
          <div className={spanClassName} style={{ "--index": i }}>
            <span>{char}</span>
          </div>
        </div>
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
}

function Message({ message }) {
  return <p className="message">{message}</p>;
}
