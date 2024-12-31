import React, { useState, useEffect } from "react";
import { FaRandom, FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [sortingAlgorithm, setSortingAlgorithm] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [complexity, setComplexity] = useState({
    best: "",
    average: "",
    worst: "",
  });
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const generateArray = () => {
    const arr = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 400) + 10
    );
    setArray(arr);
    setIsSorted(false);
    setStatusMessage("");
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const checkIfSorted = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  };

  const handleSorting = async (sortFunc, name, complexities) => {
    setSortingAlgorithm(name);
    setComplexity(complexities);

    if (checkIfSorted(array)) {
      setStatusMessage("Array is already sorted!");
      return;
    }

    setStatusMessage("");
    await sortFunc();
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed);
        }
      }
    }
    setIsSorting(false);
    setIsSorted(true);
    setStatusMessage("Array sorted successfully!");
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>Sorting Visualizer</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </header>
      <div className="controls">
        <button onClick={generateArray} disabled={isSorting}>
          <FaRandom /> New Array
        </button>
        <label>
          Array Size:
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSorting}
          />
        </label>
        <label>
          Sorting Speed (ms):
          <input
            type="range"
            min="10"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isSorting}
          />
        </label>

        <button
          onClick={() =>
            handleSorting(bubbleSort, "Bubble Sort", {
              best: "O(n)",
              average: "O(n²)",
              worst: "O(n²)",
            })
          }
          disabled={isSorting}
        >
          Bubble Sort
        </button>
      </div>

      {sortingAlgorithm && (
        <div className="complexity">
          <h2>{sortingAlgorithm} Complexities</h2>
          <p>Best Case: {complexity.best}</p>
          <p>Average Case: {complexity.average}</p>
          <p>Worst Case: {complexity.worst}</p>
        </div>
      )}

      {statusMessage && <div className="status">{statusMessage}</div>}

      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{ height: `${value}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
