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
                if (distance === false) return;
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

// TODO: must be constraint by coords
export function distanceFromEdge(
    p,
    l1,
    l2
) {
    const dx = l2.x - l1.x;
    const dy = l2.y - l1.y;

    let gradient;
    if (dx === 0) {
        gradient = Infinity; // vertical line
    } else {
        gradient = dy / dx;
    }

    let a1, b1, c1;
    if (gradient === Infinity) {
        // vertical line
        a1 = 1;
        b1 = 0;
        c1 = -l1.x;
    } else {
        a1 = -gradient;
        b1 = 1;
        c1 = -(a1 * l1.x + b1 * l1.y);
    }

    let a2, b2, c2;
    if (gradient === 0) {
        // horizontal line ⇒ normal is vertical
        a2 = 1;
        b2 = 0;
        c2 = -p.x;
    } else if (gradient === Infinity) {
        // vertical line ⇒ normal is horizontal
        a2 = 0;
        b2 = 1;
        c2 = -p.y;
    } else {
        const normal = -1 / gradient;
        a2 = -normal;
        b2 = 1;
        c2 = -(a2 * p.x + b2 * p.y);
    }

    const eq1 = [a1, b1, c1];
    const eq2 = [a2, b2, c2];

    console.log(eq1, eq2);

    const inline = checkInline(eq1, eq2, l1, l2);
    if (!inline) return false;

    return distanceFromLine(p, eq1);
}

function checkInline(
    eq1,
    eq2,
    l1, 
    l2
) {
    const intersectCoord = getIntersectCoord(eq1, eq2);
    if (intersectCoord === false) return false;

    const xmin = Math.min(l1.x, l2.x);
    const xmax = Math.max(l1.x, l2.x);
    const ymin = Math.min(l1.y, l2.y);
    const ymax = Math.max(l1.y, l2.y);

    return (
        intersectCoord.x >= xmin && 
        intersectCoord.x <= xmax && 
        intersectCoord.y >= ymin && 
        intersectCoord.y <= ymax
    );
}

function getIntersectCoord(eq1, eq2) {
    const [a1, b1, c1] = eq1;
    const [a2, b2, c2] = eq2;

    const determinant = (a1 * b2) - (a2 * b1);
    if (determinant === 0) return false; // not inline

    const x = (b1 * c2 - b2 * c1) / determinant;
    const y = (a2 * c1 - a1 * c2) / determinant;

    return {
        x: x,
        y: y
    };
}

function distanceFromLine(p, eq1) {
    const [a, b, c] = eq1;
    return Math.abs(
        (a * p.x) + (b * p.y) + c
    ) / Math.sqrt(
        (a ** 2) + (b ** 2)
    );
}