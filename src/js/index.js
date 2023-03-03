import { Application, Graphics, Sprite } from "./pixi/pixi.min.mjs";
import Grid from "./Grid.js";

const cellSize = {
    x: 128,
    y: 128,
};

const gridSize = {
    x: 10,
    y: 10,
};

const g = new Graphics();
const grid = new Grid(cellSize, gridSize, g);

//var start = graph.grid[0][0];
//var end = graph.grid[0][3];
//var result = astar.search(graph, start, end);
//console.log(result);

const app = new Application({
    view: document.getElementById("canvas"),
    width: cellSize.x * gridSize.x,
    height: cellSize.y * gridSize.y,
    backgroundColor: 0xc0c2c2,
});

const body = Sprite.from("/src/assets/body.png");

body.x = app.screen.width - 128;
body.y = app.screen.height - 128;

const runGame = () => {
    console.log("Start game");
    grid.drawGrid(app.stage);
    let startXY = grid.getSpawnXY();
    body.x = startXY.x * cellSize.x;
    body.y = startXY.y * cellSize.y;
    console.log(startXY);
    app.stage.addChild(body);
    app.ticker.add((delta) => {
        let speed = delta * 5;
        if (grid.queue.length === 0) {
            return;
        }

        let path = grid.queue[0];

        if (path.y >= body.y) {
            body.y += speed;
        } else {
            body.y -= speed;
        }
        if (path.x >= body.x) {
            body.x += speed;
        } else {
            body.x -= speed;
        }

        let diffX = body.x - path.x;
        let diffY = body.y - path.y;
        let diffNormal = 4;
        if (
            diffX < diffNormal &&
            diffX > -diffNormal &&
            diffY < diffNormal &&
            diffY > -diffNormal
        ) {
            grid.spawnXY = { x: path.x / cellSize.x, y: path.y / cellSize.y };
            grid.queue.shift();
        }
    });
};

//assetsMap.sprites.forEach((value) => app.load(value.url));

//app.loader.load(runGame);
runGame();
