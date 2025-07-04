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
        const verticesPairs = [];
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
                verticesPairs.push([coords[i - 1], coords[i]]);
            }
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }

        return verticesPairs;
    }

    loop = () => {
        this.screen();
        const verticesPairs = this.vertices(this.shapeCoords, 'red');
        this.vertices(this.materialCoords, 'blue');

        this.materialCoords.forEach(coord => {
            if (coord.moving === false) return;
            for (let i = 0; i < verticesPairs.length; i++) {
                const [pointA, pointB] = verticesPairs[i];
                
                if (distanceFromEdge(coord, pointA, pointB) < 6) {
                    console.log(distanceFromEdge(coord, pointA, pointB), pointA, pointB)
                    coord.moving = false; 
                    break;
                }
            }
        });

        requestAnimationFrame(this.loop);
    }
}

// TODO: must be constraint by coords
export function distanceFromEdge(
    p,
    l1,
    l2
) {
    const gradient = (l2.y - l1.y)/(l2.x - l1.x);
    const [a, b, c] = [
        -gradient, 
        1, 
        (gradient * l1.x) - l1.y
    ];
    return distanceFromLine(p, a, b, c);
}

function distanceFromLine(
    p,
    a,
    b,
    c
) {
    return Math.abs(
        (a * p.x) + (b * p.y) + c
    ) / Math.sqrt(
        (a ** 2) + (b ** 2)
    );
}