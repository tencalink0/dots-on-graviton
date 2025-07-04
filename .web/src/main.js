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

    vertices(coords, color = 'blue', radius = 5, lineWidth = 2) {
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

        if (coords.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 1; i < coords.length; i++) {
                this.ctx.lineTo(coords[i].x, coords[i].y);
            }
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }
    }

    loop = () => {
        this.screen();
        this.vertices(this.shapeCoords, 'red');
        this.vertices(this.materialCoords, 'blue');
        requestAnimationFrame(this.loop);
    }
}

class Point {
    x;
    originalY;
    velX;
    velY;
    accX;
    accY;
    fixed;

    constructor(x, y, fixed = false) {
        this.x = x;
        this.originalY = y;
        this.velX = 0;
        this.velY = 0;
        this.accX = 0;
        this.accY = -9.81;
        
        if (!fixed) this.beginMove();
    }
    
    beginMove() {
        let lastFrameTime = performance.now();

        const animate = (now) => {
            const delta = now - lastFrameTime;
            lastFrameTime = now;

            this.velY += this.accY * (delta / 1000);
            this.originalY += this.velY * (delta / 1000);

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    // translates center from top left to bottom left
    get y() {
        return canvas.height - this.originalY;
    }

    set y(y) {
        this.originalY = canvas.height - y;
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
        new Point(200, 150, true),
        new Point(300, 150, true),
        new Point(400, 250, true)
    ];

    const materialCoords = [
        new Point(300, 200)
    ];

    render.screen();

    render.shapeCoords = shapeCoords;
    render.materialCoords = materialCoords;

    render.loop();
});