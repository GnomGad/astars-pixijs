import { Application, Graphics, Sprite } from "./pixi/pixi.min.mjs";
import Grid from "./Grid.js";
/**
 * Класс отвечающий за игру
 */
export default class Game {
    constructor(canvasName, sprites) {
        this.cellSize = {
            x: 128,
            y: 128,
        };
        this.gridSize = {
            x: 15,
            y: 15,
        };
        this.canvasElement = document.getElementById(canvasName);
        this.backgroundColor = 0xc0c2c2;
        this.sprites = sprites;
        // графическое приложение
        this.app = null;
        // объект реализации таблицы
        this.grid = null;
        //тело объекта
        this.body = null;
        this.init();
    }
    /**
     * Инициализация объектов
     */
    init() {
        /**
         * Инициализируем объект приложения
         */
        this.app = new Application({
            view: document.getElementById("canvas"),
            width: this.cellSize.x * this.gridSize.x,
            height: this.cellSize.y * this.gridSize.y,
            backgroundColor: this.backgroundColor,
        });
        const graphics = new Graphics();
        this.grid = new Grid(this.cellSize, this.gridSize, graphics);
    }

    run() {
        this.grid.drawGrid(this.app.stage);
        let startXY = this.grid.getSpawnXY();
        if (!this.sprites.body) {
            throw Error("Body отсутсвуетd cghfqnt");
        }
        this.body = new Sprite(this.sprites.body);

        this.body.x = startXY.x * this.cellSize.x;
        this.body.y = startXY.y * this.cellSize.y;

        this.app.stage.addChild(this.body);

        this.app.ticker.add((delta) => {
            /** на обновление */
            this.loop(delta);
        });
    }
    loop(delta) {
        // если очередь пуста то нам нечего тут делать
        if (this.grid.queue.length === 0) {
            return;
        }
        // берем скорость по дельте зависит от количества кадров
        let speed = delta * 25;
        // берем из очереди первый элемент
        let gridXY = this.grid.queue[0];
        // делаем преобразования ( перевод в координаты)
        let path = {
            x: gridXY.x * this.cellSize.x,
            y: gridXY.y * this.cellSize.y,
        };
        /**
         * перемещение возможно только верх-низ и лево-право
         * координаты тоже так же приходят
         */
        if (path.y >= this.body.y) {
            this.body.y += speed;
        } else {
            this.body.y -= speed;
        }
        if (path.x >= this.body.x) {
            this.body.x += speed;
        } else {
            this.body.x -= speed;
        }

        // было замечено что координаты в конце не всегда равны конечным координатам
        // необходимо было сделать нормализацию для этого
        let diffX = this.body.x - path.x;
        let diffY = this.body.y - path.y;
        let diffNormal = speed;
        if (
            diffX < diffNormal &&
            diffX > -diffNormal &&
            diffY < diffNormal &&
            diffY > -diffNormal
        ) {
            // если мы дошли до конца то должны отметить новую позицию для старта и удалить старую
            this.grid.spawnXY = this.grid.queue[0];
            this.grid.queue.shift();
        }
    }
}
