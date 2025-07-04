export default class Scene {
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