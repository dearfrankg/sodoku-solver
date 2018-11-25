const grid3 = [[2, 0, 3], [1, 0, 0], [0, 0, 1]];

const grid4 = [[4, 0, 0, 0], [0, 2, 0, 4], [2, 0, 3, 0], [0, 0, 0, 2]];

const grid9 = [
  [0, 0, 0, 0, 0, 0, 6, 8, 0],
  [0, 0, 0, 0, 7, 3, 0, 0, 9],
  [3, 0, 9, 0, 0, 0, 0, 4, 5],
  [4, 9, 0, 0, 0, 0, 0, 0, 0],
  [8, 0, 3, 0, 5, 0, 9, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 3, 6],
  [9, 6, 0, 0, 0, 0, 3, 0, 8],
  [7, 0, 0, 6, 8, 0, 0, 0, 0],
  [0, 2, 8, 0, 0, 0, 0, 0, 0]
];

let solution = "None"; // grid solution

const print_grid = grid => {
  const view = grid.map(row => row.map(x => (x ? x : " ")).join(" ")).join("\n");
  console.log(view);
};

const copy_grid = grid => grid.map(row => [...row]);

const isUniqueArray = array => array.length === new Set(array).size;

const hasUniqueValues = subGrid => {
  const nonZeroValues = subGrid
    .reduce((acc, row) => (!acc ? false : acc.concat(row)), [])
    .filter(x => x != 0);
  return isUniqueArray(nonZeroValues);
};

const transposeGrid = grid => grid.map((_, row) => grid.map(col => col[row]));

const hasValidRows = grid =>
  grid.reduce((acc, row) => (!acc ? false : isUniqueArray(row.filter(x => x !== 0))), true);

const hasValidColumns = grid => hasValidRows(transposeGrid(grid));

const isValidSubGrid = subGrid =>
  hasValidRows(subGrid) && hasValidColumns(subGrid) && hasUniqueValues(subGrid);

const hasValidSubGrids = (grid, n = grid.length) => {
  // bail if no subGrids
  const m = Math.trunc(n ** 0.5);
  if (m * m != n) return true;

  // create subGrids
  const subGrids = [];
  const range = new Array(m).fill(0);
  range.forEach((_, subX) =>
    range.forEach((_, subY) => {
      const [x, y] = [subX * m, subY * m];
      const subGrid = range.map((_, row) => grid[x + row].slice(y, y + m));
      subGrids.push(subGrid);
    })
  );

  return subGrids.reduce((acc, subGrid) => (!acc ? false : isValidSubGrid(subGrid)), true);
};

const isValidGrid = grid => hasValidRows(grid) && hasValidColumns(grid) && hasValidSubGrids(grid);

const getEmptySpots = (grid, spots = []) => {
  grid.forEach((_, row) =>
    grid.forEach((_, col) => grid[row][col] === 0 && spots.push([row, col]))
  );
  return spots;
};

const isSolved = grid => getEmptySpots(grid).length === 0;

const solve = (grid, spots, x) => {
  // if all spots filled: stop searching
  if (spots.length === 0) return;

  // if another search solved the grid: stop seaching
  if (solution !== "None") return;

  // set the cell to x
  [row, col] = spots[0];
  grid[row][col] = x;

  // if the grid is invalid: stop seaching
  if (isValidGrid(grid) === false) return;

  // if the grid is solved: stop searching
  if (isSolved(grid)) {
    solution = grid;
    return;
  }

  // here the grid is valid but not solved: continue searching
  grid.forEach((_, x) => {
    const spots1 = spots.slice(1);
    solve(copy_grid(grid), spots1, x + 1);
  });
};

const printQuestion = (grid, spots, gridLength = grid.length, numOfSpots = spots.length) => {
  console.log(
    `\n${gridLength} x ${gridLength} grid with ${numOfSpots} spots to fill` +
      `\n-----------------------------------`
  );
  print_grid(grid);
  console.log("-".repeat(gridLength * 2 - 1));
};

const main = grid => {
  solution = "None";

  // collect all available spots
  const spots = getEmptySpots(grid);

  // print question
  printQuestion(grid, spots);

  // solve the grid
  grid.forEach((_, x) => solve(copy_grid(grid), spots, x + 1));

  // print solution
  if (solution !== "None") print_grid(solution);
};

main(grid3);
main(grid4);
main(grid9);
