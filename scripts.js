let rows = 20;
let cols = 20;

let grid = [];
let start = { r: 5, c: 5};
let goal = { r: 15, c: 15};

let mode = "wall";

const gridEl = document.getElementById("grid");

function createGrid() {
    grid = [];
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
    
    for (let r = 0; r < rows; r++){
        let row = [];
        for (let c = 0; c < cols; c++) {
            let div = document.createElement("div");
            div.classList.add("cell");

            div.onclick = () => handleClick(r, c);

            gridEl.appendChild(div);
            row.push(div);
        }
        grid.push(row);
    }
    drawSpecial();
} 

function handleClick(r, c) {
    let cell = grid[r][c];

    if (mode === "wall") {
        if ((r === start.r && c === start.c) ||
        (r === goal.r && c === goal.c)) return;
    cell.classList.toggle("wall");
    console.log(mode)
    }

    else if (mode === "start"){
        grid[start.r][start.c].classList.remove("start");
        start = { r, c };
        cell.classList.add("start");
    }

    else if (mode === "goal") {
        grid[goal.r][goal.c].classList.remove("goal");
        goal = { r, c };
        cell.classList.add("goal");
    }
}

function drawSpecial() {
    grid[start.r][start.c].classList.add("start");
    grid[goal.r][goal.c].classList.add("goal");
}

function resizeGrid() {
    rows = parseInt(document.getElementById("rowsInput").value);
    cols = parseInt(document.getElementById("colsInput").value);

    start = {r : 0, c : 0 };
    goal = { r : rows - 1, c: cols - 1 };

    createGrid();
}

function bfs() {
    let queue = [[start]];
    let visited = new Set([`${start.r},${start.c}`]);

    while (queue.length) {
        let path = queue.shift();
        let { r,c } = path[path.length - 1];
        
        if (r === goal.r && c === goal.c) return path;

        for (let [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let key = `${nr},${nc}`;

            if (nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
                !visited.has(key) &&
                !grid[nr][nc].classList.contains("wall")) {
            visited.add(key);
            queue.push([...path, { r: nr, c: nc}])
                }
            
        }
    }
    return [];
}

async function animate(path) {
    for (let node of path) {
        let cell = grid[node.r][node.c];

        if (!cell.classList.contains("start") && 
            !cell.classList.contains("goal")) {
        cell.classList.add("visited");
        await new Promise(r => setTimeout(r, 15));
    }
  }
  for (let node of path) {
    let cell = grid[node.r][node.c];

    if (!cell.classList.contains("start") && 
        !cell.classList.contains("goal")) {
            cell.classList.add("path");
            await new Promise(r => setTimeout(r,25));
        }
  }
}

function run() {
    clearGrid();
    let path = bfs();
    animate(path);
}

function clearGrid() {
    for (let r = 0; r < rows; r ++){
        for (let c = 0; c < cols; c++) {
            grid[r][c].classList.remove("visited", "path","walls");
        }
    }
}

createGrid();