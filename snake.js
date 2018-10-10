//Require-Variables
var keypress = require('keypress');
var ansi = require('ansi');
var cursor = ansi(process.stdout);
//Game-Variables
var gameSize = { lenX: 40, lenY: 20 };
var level = 0;
var speed = 4;
var posSnake = { posX: gameSize.lenX / 2, posY: gameSize.lenY / 2 };
var posApple = { posX: 1, posY: 1 };
var direction = 0;
var first = true;

//Paint Playarea
paintArea();
//Init keypressevent
initKeypress();
//start the game
playGame();

//Play the game (move the snake every x milliseconds & check for the apple)
function playGame() {
    //If it's the first call place an apple on a random position
    if (first) {
        first = false;
        createApple();
    }
    //Move the snake
    removeSnake();
    switch (direction) {
        case 0: posSnake.posX += 1; break;      //right
        case 1: posSnake.posX -= 1; break;      //left
        case 2: posSnake.posY -= 1; break;      //up
        case 3: posSnake.posY += 1; break;      //down
    }
    placeSnake();
    //Check if the snake hits an apple
    if (posSnake.posX === posApple.posX && posSnake.posY === posApple.posY) {
        level++;
        speed++;
        createApple();
    }
    //Check if the snake hits the border
    if (posSnake.posX <= 0 || posSnake.posX >= gameSize.lenX - 1 || posSnake.posY <= 0 || posSnake.posY >= gameSize.lenY - 1) {
        exitSnake();
    }
    setTimeout(playGame, 1000 / speed);
}

//Paint the Area
function paintArea() {
    process.stdout.write('\x1Bc');
    cursor.bg.grey();
    for (var y = 0; y < gameSize.lenY; y++) {
        for (var x = 0; x < gameSize.lenX; x++) {
            if (x === 0 || x === gameSize.lenX - 1 || y === 0 || y === gameSize.lenY - 1) {
                cursor.bg.grey().write(' ').bg.reset();
            } else {
                cursor.bg.white().write(' ').bg.reset();
            }
        }
        process.stdout.write('\n');
    }
    cursor.bg.reset();
}

//Places an apple on a random position
function createApple() {
    printPoints();
    removeApple();
    posApple.posX = Math.floor(Math.random() * Math.floor(gameSize.lenX - 4) + 3);
    posApple.posY = Math.floor(Math.random() * Math.floor(gameSize.lenY - 4) + 3);
    placeApple();
    //Nice Beep sound
    cursor.beep();
}

//Functions to place and remove snake and apple and to print the speed and the points
function placeApple() {
    cursor.goto(posApple.posX + 1, posApple.posY + 1);
    cursor.bg.red().write(' ').bg.reset();
    process.stdout.write('\x1B[?25l');
}
function removeApple() {
    cursor.goto(posApple.posX + 1, posApple.posY + 1);
    cursor.bg.white().write(' ').bg.reset();
}
function placeSnake() {
    cursor.goto(posSnake.posX + 1, posSnake.posY + 1);
    cursor.bg.green().write(' ').bg.reset();
    process.stdout.write('\x1B[?25l');
}
function removeSnake() {
    cursor.goto(posSnake.posX + 1, posSnake.posY + 1);
    cursor.bg.white().write(' ').bg.reset();
}
function printPoints() {
    cursor.goto(0, gameSize.lenY + 1);
    process.stdout.write('Points: ' + level + '\n');
    process.stdout.write('Speed: ' + speed + '\n');
}

//Initialize the Keypress
function initKeypress() {
    // Make 'process.stdin' begin emitting 'keypress' events
    keypress(process.stdin);
    //Listen for the 'keypress' event
    process.stdin.on('keypress', function (ch, key) {
        if (key) {
            switch (key.name) {
                case 'right': direction = 0; break;
                case 'left': direction = 1; break;
                case 'up': direction = 2; break;
                case 'down': direction = 3; break;
            }
        }
    });
    process.stdin.setRawMode(true);
}

//Exit
function exitSnake() {
    cursor.reset();
    cursor.bg.grey();
    cursor.fg.red();

    cursor.goto(gameSize.lenX / 2 - 3, gameSize.lenY / 2);
    process.stdout.write('Game Over');
    cursor.goto(gameSize.lenX + 3, gameSize.lenY + 3);

    cursor.reset();
    process.exit();
}
