let canvas;

class Render {
    ctx;

    constructor(shapeCoords = [], materialCoords = []) {
        this.ctx = canvas.getContext('2d');
        this.shapeCoords = shapeCoords;
        this.materialCoords = materialCoords;
    }

    screen(gap = 0.2) {
        canvas.height = window.innerHeight * (1 - gap);
        canvas.width = window.innerWidth * (1 - gap);
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    vertices(coords, radius = 5, color = 'blue') {
        this.ctx.fillStyle = color;
        coords.forEach(coordinate => {
            this.ctx.beginPath();
            this.ctx.arc(
                coordinate.x, 
                coordinate.y,
                radius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    }

    loop = () => {
        this.vertices(this.shapeCoords, undefined, 'red');
        this.vertices(this.materialCoords, undefined, 'blue');
        requestAnimationFrame(this.loop);
    }
}

class Coordinate {
    x;
    originalY;

    constructor(x, y) {
        this.x = x;
        this.originalY = y;
    }

    // translates center from top left to bottom left
    get y() {
        return canvas.height - this.originalY;
    }
}

class Shape {
    vertices;

    constructor(vertices) {
        this.vertices = vertices;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    const render = new Render();

    const shapeCoords = [
        new Coordinate(200, 150)
    ];

    const materialCoords = [
        new Coordinate(300, 200)
    ];

    render.screen();

    render.shapeCoords = shapeCoords;
    render.materialCoords = materialCoords;

    render.loop();

    window.addEventListener('resize', () => {
        render.screen();
        
        render.shapeCoords.forEach(coord => {
            coord.y = canvas.height - coord.y;
        });
    });
});