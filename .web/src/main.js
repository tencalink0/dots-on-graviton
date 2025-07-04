import Scene from "./render";
import Point from "./point";

let canvas;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    const scene = new Scene();

    const shapeCoords = [
        new Point(200, 150),
        new Point(300, 150),
        new Point(400, 250)
    ];

    const materialCoords = [
        new Point(300, 200)
    ];

    scene.screen();

    scene.shapeCoords = shapeCoords;
    scene.materialCoords = materialCoords;

    scene.loop();
});