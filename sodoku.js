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

/**
 * pretty prints grid to the console
 * @param  grid two dimensional array
 */
const print_grid = grid => {
  const view = grid.map(row => row.map(x => (x ? x : " ")).join(" ")).join("\n");
  console.log(view);
};

/**
 * clone grid
 * @param  grid two dimensional array
 * @returns clone of grid
 */
const copy_grid = grid => grid.map(row => [...row]);

/**
 * determine if array contains unique values
 * @param  array
 * @return boolean
 */
const isUniqueArray = array => array.length === new Set(array).size;

/**
 * determine if subGrid has unique values
 * @param  grid two dimensional array
 * @return boolean
 */
const hasUniqueValues = subGrid => {
  const oneDimensionalArray = subGrid.reduce((acc, row) => (!acc ? false : acc.concat(row)), []);
  const filteredArray = oneDimensionalArray.filter(x => x != 0);
  return isUniqueArray(filteredArray);
};

/**
 * transposeGrid by flipping the x and y axis
 * @param  grid two dimensional array
 * @return grid that has been transposed
 */
const transposeGrid = grid => grid.map((_, row) => grid.map(col => col[row]));

/**
 * determine if the grid rows are valid by containing unique values
 * @param  grid two dimensional array
 * @return boolean
 */
const hasValidRows = grid =>
  grid.reduce((acc, row) => (!acc ? false : isUniqueArray([...row].filter(x => x !== 0))), true);

/**
 * determine if the grid columns are valid by containing unique values
 * @param  grid two dimensional array
 * @return boolean
 */
const hasValidColumns = grid => hasValidRows(transposeGrid(grid));

/**
 * determine if subGrid is valid meaning valid row, columns and unique values
 * @param  grid two dimensional array
 * @return boolean
 */
const isValidSubGrid = subGrid =>
  hasValidRows(subGrid) && hasValidColumns(subGrid) && hasUniqueValues(subGrid);

/**
 * determine that sub-grids if any are valid
 * @param  grid two dimensional array
 * @return boolean
 */
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

/**
 * determine that the grid is valid
 * @param  grid two dimensional array
 * @return boolean
 */
const isValidGrid = grid => hasValidRows(grid) && hasValidColumns(grid) && hasValidSubGrids(grid);

/**
 * collect the spots that need to be filled
 * @param  grid two dimensional array
 * @return spots array of [x, y] coordinates
 */
const getSpots = (grid, spots = []) => {
  grid.forEach((_, row) =>
    grid.forEach((_, col) => grid[row][col] === 0 && spots.push([row, col]))
  );
  return spots;
};

/**
 * determine is sodoku is solved meaning no more spots to fill
 * @param  grid two dimensional array
 * @return boolean
 */
const isSolved = grid => getSpots(grid).length === 0;

/**
 * solve the sodoku grid
 * @param  grid two dimensional array
 * @param  spots array
 * @param  x value for spot
 */
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

/**
 * run the main program
 * @param  grid two dimensional array
 */
const main = (grid, n = grid.length) => {
  solution = "None";

  // collect all available spots
  const spots = getSpots(grid);

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
