export default class Point {
    x;
    originalY;
    velX;
    velY;
    accX;
    accY;
    moving;

    constructor(x, y, fixed = true) {
        this.x = x;
        this.originalY = y;
        this.velX = 0;
        this.velY = 0;
        this.accX = 0;
        this.accY = -9.81;
        
        this.moving = !fixed;
        if (!fixed) this.beginMove();
    }
    
    beginMove() {
        let lastFrameTime = performance.now();

        const animate = (now) => {
            if (!this.moving) return;
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