import { Assets } from "./pixi/pixi.min.mjs";

import Game from "./Game.js";
import manifest from "./manifest.js";
console.log(manifest);
Assets.init(manifest)
    .then(() => {
        return Assets.loadBundle("bodies");
    })
    .then((sprites) => {
        console.log("Load");
        console.log(sprites);
        const game = new Game("canvas", sprites);
        game.run();
    })
    .catch((e) => {
        console.log("[Error]", e);
    });
