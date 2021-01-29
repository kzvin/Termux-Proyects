// Declaration of required global variables.
let width;
let height;
let fps;
let tileSize;
let canvas;
let ctx;
let snake;
let food;
let score;
let isPaused;
let fpsInterval, startTime, now, then, elapsed;
let die;
let eat;
let FONT_NAME;
let animationFrame;


// Loading the browser window
window.addEventListener("load",function(){

    document.fonts.load('10pt "8bit"').then(game);

});

// Resizing the canvas on window resize
window.addEventListener("resize", function () {

    init();

});

// Adding an event listener for key presses.
window.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
        evt.preventDefault();
        isPaused = !isPaused;
        showPaused();
    }
    else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        if (snake.velY != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, -1);
    }
    else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        if (snake.velY != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(0, 1);
    }
    else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        if (snake.velX != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(-1, 0);
    }
    else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        if (snake.velX != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
            snake.dir(1, 0);
    }

});

// Checks if food is spawned on the snake's body.
function foodSnakeOverlap(pos) {
    if (snake.x == pos.x && snake.y == pos.y)
        return true;
    for (var i = 0; i < snake.tail.length; i++) {
        if (snake.tail[i].x == pos.x && snake.tail[i].y == pos.y)
            return true;
    }

    return false;

}

// Determining a random spawn location on the grid.
function spawnLocation() {

    // Breaking the entire canvas into a grid of tiles.
    let rows = width / tileSize;
    let cols = height / tileSize;

    let xPos, yPos;
    let overlap = false;

    // To prevent an overlap of the food and the snake's body.
    do {

        xPos = Math.floor(Math.random() * rows) * tileSize;
        yPos = Math.floor(Math.random() * cols) * tileSize;
        overlap = foodSnakeOverlap({ x: xPos, y: yPos });

    } while (overlap);

    return { x: xPos, y: yPos };

}

// Showing the score of the player.
function showScore() {

    ctx.textAlign = "center";
    ctx.font = `25px "${FONT_NAME}"`;
    var gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop("0.0", "white")
    ctx.fillStyle = gradient;
    ctx.fillText("SCORE: " + score, width - 120, 30);

}

// Showing if the game is paused.
function showPaused() {

    ctx.textAlign = "center";
    ctx.font = `35px "${FONT_NAME}"`;
    var gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("0.5", "green");
    gradient.addColorStop("1.0", "blue")
    ctx.fillStyle = gradient;
    ctx.fillText("PAUSED", width / 2, height / 2);

}

// Treating the snake as an object.
class Snake {

    // Initialization of object properties.
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.tail = [{ x: pos.x - tileSize, y: pos.y }, { x: pos.x - tileSize * 2, y: pos.y }];
        this.velX = 1;
        this.velY = 0;
        this.color = color;

    }

    // Drawing the snake on the canvas.
    draw() {

        // Drawing the head of the snake.
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // Drawing the tail of the snake.
        for (var i = 0; i < this.tail.length; i++) {

            ctx.beginPath();
            ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();

        }


    }

    // Moving the snake by updating position.
    move() {

        // Movement of the tail.    
        for (var i = this.tail.length - 1; i > 0; i--) {

            this.tail[i] = this.tail[i - 1];

        }

        // Updating the start of the tail to acquire the position of head.
        if (this.tail.length != 0)
            this.tail[0] = { x: this.x, y: this.y };

        // Movement of the head.   
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;

    }

    // Changing the direction of movement of the snake.
    dir(dirX, dirY) {

        this.velX = dirX;
        this.velY = dirY;

    }

    // Determining whether the snake has eaten a piece of food.
    eat() {

        if (Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {

            // Adding to the tail.
            this.tail.push({});
            return true;
        }

        return false;

    }

    // Checking if the snake has died.
    die() {

        for (var i = 0; i < this.tail.length; i++) {

            if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize) {
                return true;
            }

        }

        return false;

    }

    border() {

        if (this.x + tileSize > width && this.velX != -1 || this.x < 0 && this.velX != 1)
            this.x = width - this.x;

        else if (this.y + tileSize > height && this.velY != -1 || this.velY != 1 && this.y < 0)
            this.y = height - this.y;

    }

}

// Treating the food as an object.
class Food {

    // Initialization of object properties.
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.color = color;

    }

    // Drawing the food on the canvas.
    draw() {

        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

    }

}

// Initialization of the game objects.
function init() {

    tileSize = 20;

    // Dynamically controlling the size of canvas.
    width = tileSize * Math.floor(window.innerWidth / tileSize);
    height = tileSize * Math.floor(window.innerHeight / tileSize);;

    fps = 10;

    then = Date.now();
    startTime = then;
    fpsInterval = 1000 / fps;

    canvas = document.getElementById("game-area");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    console.log(canvas);

    FONT_NAME = '8bit';
    eat = new Audio('./resources/audio/eat.mp3');
    die = new Audio('./resources/audio/die.mp3');
    isPaused = false;
    score = 0;
    snake = new Snake({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize * Math.floor(height / (2 * tileSize)) }, "#39ff14");
    food = new Food(spawnLocation(), "red");

}

// Updating the position and redrawing of game objects.
function update() {

    animationFrame = requestAnimationFrame(update);
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Checking if game is paused.
        if (isPaused) {
            return;
        }

        if (snake.die()) {
            die.play()
            alert("GAME OVER!!!");
            cancelAnimationFrame(animationFrame);
            window.location.reload();
        }

        snake.border();

        if (snake.eat()) {
            eat.play()
            score += 10;
            food = new Food(spawnLocation(), "red");
        }

        // Clearing the canvas for redrawing.
        ctx.clearRect(0, 0, width, height);

        food.draw();
        snake.draw();
        snake.move();
        showScore();

    }

}

// The actual game function.
function game() {

    init();

    // The game loop.
    update();

}
