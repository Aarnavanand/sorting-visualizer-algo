import React, { useState, useEffect } from "react";
import { FaRandom } from "react-icons/fa";
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

  const insertionSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
    }
    setIsSorting(false);
    setIsSorted(true);
    setStatusMessage("Array sorted successfully!");
  };

  const quickSort = async (arr = array, start = 0, end = arr.length - 1) => {
    setIsSorting(true);
    if (start < end) {
      const pivotIndex = await partition(arr, start, end);
      await quickSort(arr, start, pivotIndex - 1);
      await quickSort(arr, pivotIndex + 1, end);
    }
    setArray([...arr]);
    setIsSorting(false);
    setIsSorted(true);
    setStatusMessage("Array sorted successfully!");
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(speed);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(speed);
    return i + 1;
  };

  const mergeSort = async (arr = array, l = 0, r = arr.length - 1) => {
    setIsSorting(true);
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      await mergeSort(arr, l, m);
      await mergeSort(arr, m + 1, r);
      await merge(arr, l, m, r);
    }
    setArray([...arr]);
    setIsSorting(false);
    setIsSorted(true);
    setStatusMessage("Array sorted successfully!");
  };

  const merge = async (arr, l, m, r) => {
    const n1 = m - l + 1;
    const n2 = r - m;
    let left = new Array(n1),
      right = new Array(n2);
    for (let i = 0; i < n1; i++) left[i] = arr[l + i];
    for (let i = 0; i < n2; i++) right[i] = arr[m + 1 + i];

    let i = 0,
      j = 0,
      k = l;
    while (i < n1 && j < n2) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      setArray([...arr]);
      await sleep(speed);
      k++;
    }
    while (i < n1) {
      arr[k] = left[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(speed);
    }
    while (j < n2) {
      arr[k] = right[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(speed);
    }
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div className="app">
      <h1>Sorting Visualizer</h1>
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

        <button
          onClick={() =>
            handleSorting(insertionSort, "Insertion Sort", {
              best: "O(n)",
              average: "O(n²)",
              worst: "O(n²)",
            })
          }
          disabled={isSorting}
        >
          Insertion Sort
        </button>

        <button
          onClick={() =>
            handleSorting(() => quickSort(), "Quick Sort", {
              best: "O(n log n)",
              average: "O(n log n)",
              worst: "O(n²)",
            })
          }
          disabled={isSorting}
        >
          Quick Sort
        </button>

        <button
          onClick={() =>
            handleSorting(() => mergeSort(), "Merge Sort", {
              best: "O(n log n)",
              average: "O(n log n)",
              worst: "O(n log n)",
            })
          }
          disabled={isSorting}
        >
          Merge Sort
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
          <div className="array-bar" key={idx} style={{ height: `${value}px` }}></div>
        ))}
      </div>
    </div>
  );
};

export default App;
