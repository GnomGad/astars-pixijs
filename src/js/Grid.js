import { Application, Graphics, Sprite } from "./pixi/pixi.min.mjs";
export default class Grid {
    constructor(cellSize, gridSize, g) {
        this.cellSize = cellSize;
        this.gridSize = gridSize;
        this.localGrid = null;
        this.grid = g;
        this.queue = [];

        this.init();
    }
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
        this.localGrid = initGraph;
        this.graph = new Graph(initGraph);
        this.spawnXY = this.getSpawnXY();
        this.grid.interactive = true;
        this.grid.cursor = "pointer";
        this.grid.on("pointerdown", (event) => {
            let x = Math.floor(event.global.x / this.cellSize.x);
            let y = Math.floor(event.global.y / this.cellSize.y);
            let end = this.graph.grid[x][y];
            let result = astar.search(
                this.graph,
                this.graph.grid[this.spawnXY.x][this.spawnXY.y],
                end
            );
            for (let i = 0; i < result.length; i++) {
                this.queue.push({ x: result[i].x * 128, y: result[i].y * 128 });
            }
            console.log(result);
            //
        });
        //var start = this.graph.grid[0][0];
        //var end = this.graph.grid[0][3];
        // var result = astar.search(this.graph, start, end);
        // console.log("123213", result);
    }

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
