import { useContext } from "react";
import KeyboardContext from "../App.jsx";

export default function KeyBoard({handleKeyClick}) {
  const KEYS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Enter","z", "x", "c", "v", "b", "n", "m", "Backspace"],
  ];
  return (
    <div className="keyboard">
      {KEYS.map((keyboardRow, index) => (
        <Row keyboardRow={keyboardRow} index={index} handleKeyClick={handleKeyClick} key={index} />
      ))}
    </div>
  );
}

function Row({ keyboardRow, index, handleKeyClick }) {

  const className = `keyboard-row ${index + 1}`;
  return (
    <div className={className}>
      {keyboardRow.map((keyboardKey, index) => (
        <button className="keyboard-key" onClick={handleKeyClick} key={index}>
          {keyboardKey.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
