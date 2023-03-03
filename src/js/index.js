import { Application, Graphics, Sprite } from "./pixi/pixi.min.mjs";
import Grid from "./Grid.js";

const cellSize = {
    x: 128,
    y: 128,
};

const gridSize = {
    x: 15,
    y: 15,
};

const graphics = new Graphics();
const grid = new Grid(cellSize, gridSize, graphics);

const app = new Application({
    view: document.getElementById("canvas"),
    width: cellSize.x * gridSize.x,
    height: cellSize.y * gridSize.y,
    backgroundColor: 0xc0c2c2,
});
let img = new Image();
img.src = "./src/assets/body.png";

const body = Sprite.from(img);

body.x = app.screen.width - 128;
body.y = app.screen.height - 128;

const runGame = () => {
    console.log("Start game");
    grid.drawGrid(app.stage);
    let startXY = grid.getSpawnXY();

    body.x = startXY.x * cellSize.x;
    body.y = startXY.y * cellSize.y;

    app.stage.addChild(body);

    app.ticker.add((delta) => {
        /** на обновление */
        console.log(grid.queue);
        moveBody(delta);
    });
};
const moveBody = (delta) => {
    // если очередь пуста то нам нечего тут делать
    if (grid.queue.length === 0) {
        return;
    }
    // берем скорость по дельте зависит от количества кадров
    let speed = delta * 25;
    // берем из очереди первый элемент
    let gridXY = grid.queue[0];
    // делаем преобразования ( перевод в координаты)
    let path = {
        x: gridXY.x * cellSize.x,
        y: gridXY.y * cellSize.y,
    };
    /**
     * перемещение возможно только верх-низ и лево-право
     * координаты тоже так же приходят
     */
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

    // было замечено что координаты в конце не всегда равны конечным координатам
    // необходимо было сделать нормализацию для этого
    let diffX = body.x - path.x;
    let diffY = body.y - path.y;
    let diffNormal = speed;
    if (
        diffX < diffNormal &&
        diffX > -diffNormal &&
        diffY < diffNormal &&
        diffY > -diffNormal
    ) {
        // если мы дошли до конца то должны отметить новую позицию для старта и удалить старую
        grid.spawnXY = grid.queue[0];
        grid.queue.shift();
    }
};

window.addEventListener("load", runGame);
