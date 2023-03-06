/**
 * Реализация сетки
 * @class
 */
export default class Grid {
    /**
     * Конструктор
     * @param {{x,y}} cellSize объект с размерами ячейки
     * @param {{x,y}} gridSize объект с размером сетки
     * @param {PIXI.Graphics} g графический объект для рисования
     */
    constructor(cellSize, gridSize, g) {
        this.cellSize = cellSize;
        this.gridSize = gridSize;
        this.localGrid = null;
        this.grid = g;
        this.queue = [];
        this.endXY = null;
        this.init();
    }
    /**
     * Инициализация, используется по стандарту
     */
    init() {
        // создаем массив для заполнения его нулями
        let initGraph = [];
        // инициализируем у массива строки
        for (let i = 0; i < this.gridSize.x; i++) {
            initGraph.push([]);
        }
        // заполняем строки
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                // добавим немного рандома
                let rand = Math.floor(Math.random() * 4);
                if (rand > 0) {
                    initGraph[x].push(1);
                    continue;
                }
                initGraph[x].push(0);
            }
        }
        // чтобы с гридом можно было взаимодействовать проще
        this.localGrid = initGraph;

        // создаем граф
        this.graph = new Graph(initGraph);
        // получаем координаты первой свободной точки
        this.spawnXY = this.getSpawnXY();

        this.grid.interactive = true;
        this.grid.cursor = "pointer";

        this.grid.on("pointerdown", (event) => {
            let x = Math.floor(event.global.x / this.cellSize.x);
            let y = Math.floor(event.global.y / this.cellSize.y);

            let end = this.graph.grid[x][y];
            let start = this.graph.grid[this.spawnXY.x][this.spawnXY.y];

            // если элементы есть то стартовую точку нужно считать как последнюю точку прошлого маршрута
            if (this.queue.length != 0) {
                let lastElement = this.queue[this.queue.length - 1];
                start = this.graph.grid[lastElement.x][lastElement.y];
            }

            let result = astar.search(this.graph, start, end);
            // запушим все новые пути в список путей
            for (let i = 0; i < result.length; i++) {
                this.queue.push({ x: result[i].x, y: result[i].y });
            }
        });
    }
    /**
     * Отрисовка сетки
     * @param {Pixi.Container} stage  контейнер куда добавить сетку
     */
    drawGrid(stage) {
        const wallColor = 0xc34288;
        const pathColor = 0xc2c2c2;
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                let color = pathColor;
                this.grid.lineStyle(4, 0x000000, 1);
                if (this.graph.grid[x][y].weight === 0) {
                    color = wallColor;
                }
                this.grid.beginFill(color);
                this.grid.drawRect(
                    this.cellSize.x * x,
                    this.cellSize.y * y,
                    this.cellSize.x,
                    this.cellSize.y
                );
                this.grid.endFill();
            }
        }
        stage.addChild(this.grid);
    }

    /**
     * Вернуть первое свободное положение для спавна
     * @returns {{x,y}} вернет объек с коордианатми в сетке XY
     */
    getSpawnXY() {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                if (this.localGrid[x][y] === 1) {
                    return { x: x, y: y };
                }
            }
        }
    }
}
