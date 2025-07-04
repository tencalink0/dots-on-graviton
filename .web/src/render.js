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
                
                const distance = distanceFromEdge(coord, pointA, pointB);
                if (distance === false) continue;
                if (distance < 6) {
                    // console.log(distance, pointA, pointB);
                    coord.moving = false; 
                    break;
                }
            }
        });

        requestAnimationFrame(this.loop);
    }
}

export function distanceFromEdge(
    P,
    A,
    B
) {
    const ABx = B.x - A.x;
    const ABy = B.y - A.y;
    const APx = P.x - A.x;
    const APy = P.y - A.y;

    const ABDistSquared = ABx * ABx + ABy * ABy;
    if (ABDistSquared === 0) return false; // if A and B are same

    const dotProduct = APx * ABx + APy * ABy;
    const t = dotProduct / ABDistSquared;

    if (t < 0 || t > 1) return false; // projection out of segment

    const closestX = A.x + t * ABx;
    const closestY = A.y + t * ABy;

    const dx = P.x - closestX;
    const dy = P.y - closestY;

    return Math.sqrt(dx * dx + dy * dy);
}