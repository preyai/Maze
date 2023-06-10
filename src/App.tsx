import React, { useState, useEffect } from "react";
import "./App.css";

type Direction = "up" | "down" | "left" | "right";

interface CellType {
  row: number;
  col: number;
  walls: { [key in Direction]: boolean };
  visited: boolean;
}

const numRows = 10;
const numCols = 10;

const initialPlayerPosition: CellType = {
  row: 0,
  col: 0,
  walls: { up: true, down: true, left: true, right: true },
  visited: true,
};

const initialGoalPosition: CellType = {
  row: numRows - 1,
  col: numCols - 1,
  walls: { up: true, down: true, left: true, right: true },
  visited: false,
};

const generateMaze = (): CellType[][] => {
  const maze: CellType[][] = Array.from({ length: numRows }, (_, row) =>
    Array.from({ length: numCols }, (_, col) => ({
      row,
      col,
      walls: { up: true, down: true, left: true, right: true },
      visited: false,
    }))
  ); 

  const initialCell: CellType = maze[Math.floor(Math.random() * numRows)][Math.floor(Math.random() * numCols)];

  const visitCell = (cell: CellType) => {
    cell.visited = true;

    const neighbors: CellType[] = [];

    if (cell.row > 0) {
      neighbors.push(maze[cell.row - 1][cell.col]);
    }

    if (cell.col < numCols - 1) {
      neighbors.push(maze[cell.row][cell.col + 1]);
    }

    if (cell.row < numRows - 1) {
      neighbors.push(maze[cell.row + 1][cell.col]);
    }

    if (cell.col > 0) {
      neighbors.push(maze[cell.row][cell.col - 1]);
    }

    neighbors.sort(() => Math.random() - 0.5);

    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        if (neighbor.row < cell.row) {
          cell.walls.up = false;
          neighbor.walls.down = false;
        } else if (neighbor.col > cell.col) {
          cell.walls.right = false;
          neighbor.walls.left = false;
        } else if (neighbor.row > cell.row) {
          cell.walls.down = false;
          neighbor.walls.up = false;
        } else if (neighbor.col < cell.col) {
          cell.walls.left = false;
          neighbor.walls.right = false;
        }

        visitCell(neighbor);
      }
    }
  };

  visitCell(initialCell);

  for (const row of maze) {
    for (const cell of row) {
      cell.visited = false
    }
  }

  return maze;
};

const App = () => {
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [goalReached, setGoalReached] = useState(false);
  const [count, setCount] = useState(0); // counter of completed mazes

  useEffect(() => {
    setMaze(generateMaze());
    
  }, []);

  const handleCellClick = (cell: CellType) => {
    // Placeholder for future functionality
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let updatedPosition = { ...playerPosition };
    let moved = false;
    switch (event.key) {
      case "ArrowUp":
        if (!maze[updatedPosition.row][updatedPosition.col].walls.up) {
          updatedPosition.row--;
          moved = true;
        }
        break;
      case "ArrowRight":
        if (!maze[updatedPosition.row][updatedPosition.col].walls.right) {
          updatedPosition.col++;
          moved = true;
        }
        break;
      case "ArrowDown":
        if (!maze[updatedPosition.row][updatedPosition.col].walls.down) {
          updatedPosition.row++;
          moved = true;
        }
        break;
      case "ArrowLeft":
        if (!maze[updatedPosition.row][updatedPosition.col].walls.left) {
          updatedPosition.col--;
          moved = true;
        }
        break;
    }
    if (moved) {
      maze[updatedPosition.row][updatedPosition.col].visited = true
      setPlayerPosition(updatedPosition);
      if (updatedPosition.row === initialGoalPosition.row && updatedPosition.col === initialGoalPosition.col) {
        setGoalReached(true);
        setCount(count + 1); // increment the counter upon completion
      }
    }
  };

  const resetGame = () => {
    setPlayerPosition(initialPlayerPosition);
    setMaze(generateMaze());
    setGoalReached(false);
  }

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1>Labyrinth Game</h1>
      <h2>Completed: {count}</h2>
      {!maze ? (
        <div>Loading...</div>
      ) : (
        <>
          {goalReached ? (
            <div>
              <h2>Congratulations, you won!</h2>
              <button onClick={resetGame}>Play Again</button>
            </div>
          ) : (
            maze.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`cell ${cell.visited ? "visited" : ""}`}
                    onClick={() => handleCellClick(cell)}
                  >
                    {cell.walls.up && <div className="wall up" />}
                    {cell.walls.right && <div className="wall right" />}
                    {cell.walls.down && <div className="wall down" />}
                    {cell.walls.left && <div className="wall left" />}
                    {playerPosition.row === rowIndex &&
                      playerPosition.col === cellIndex && (
                        <div className="player" />
                      )}
                    {initialGoalPosition.row === rowIndex &&
                      initialGoalPosition.col === cellIndex && (
                        <div className="goal" />
                      )}
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default App;
