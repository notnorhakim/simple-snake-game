// Define canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Define game variables
let snake = [{x: 10, y: 10}];
let food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
let direction = "right";
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0; // Load high score from local storage
let isPaused = false;
const GAME_SPEED = 50;
let isRunning = false;
let isPower = false;

// Audio
const gameOverAudio = document.getElementById("game-over-audio");
const pointsAudio = document.getElementById("points-audio");
const mkhAudio = document.getElementById("mkh-audio");
const chadAudio = document.getElementById("chad-audio");





// Draw a square at the specified position
function drawSquare(x, y, color, outline, boolean) {
  ctx.fillStyle = color;
  ctx.fillRect(x * 20, y * 20, 20, 20);
  ctx.lineWidth = 4;
  ctx.strokeStyle = outline;
  ctx.strokeRect(x * 20, y * 20, 20, 20);
  
  // Add a circle on top of the square
  if (boolean == true) {
    ctx.fillStyle = "black";
    ctx.fillRect((x * 20) + 12, (y * 20) + 5, 3, 7);
    ctx.fillRect((x * 20) + 5, (y * 20) + 5, 3, 7);
    ctx.fillRect((x * 20) + 5, (y * 20) + 13, 10, 3);
  }
}
// Define function to draw blinking text
function drawBlinkingText(text, x, y, color, font, delay) {
  if(!isRunning) {
    let visible = true; // variable to control text visibility
    setInterval(function() { // repeatedly draw the text with a time delay
    ctx.clearRect(x-130 , y - 30, ctx.measureText(text).width +20, 50); // clear the previous text
    if (visible) {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    }
    visible = !visible; // toggle visibility
  }, delay);
  } else if (isRunning){
    visible= false;;
  }
  
}



function displayStartScreen() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Display start screen
  ctx.fillStyle = "black";
  ctx.font = "20px Bradley Hand";
  ctx.textAlign = "center";
  ctx.fillText("Press Space or Tap to Start / Pause", canvas.width/2, canvas.height-60);
  ctx.font = "25px Bradley Hand";
  ctx.fillText("Use Keyboard Arrow Keys to Move", canvas.width/2, canvas.height-20);
  ctx.fillStyle = "Red";
  ctx.font = "20px Ariel";
  ctx.fillText("", canvas.width/2+1, 30);

  
}

  

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

// Draw the game board
function drawBoard() {
  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#9FBAFF");
  gradient.addColorStop(1, "#F8C7FD");
  ctx.fillStyle = "#5ABA47";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw game elements
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
        if (isPower) {
            drawSquare(snake[i].x, snake[i].y, getRandomColor(), "black",true);
        } else {
            drawSquare(snake[i].x, snake[i].y, "#FFCC09", "black",true);
        }
      } else {
        if (isPower || score % 10 == 0 ) {
            mkhAudio.play();
            chadAudio.play();
            drawSquare(snake[i].x, snake[i].y, getRandomColor(), "black",false);
        } else {
            chadAudio.pause();
            drawSquare(snake[i].x, snake[i].y, "#FFCC09", "black",false);
        }
      }
  }
  if ((score + 1) % 10 == 0  && score > 0) {
    drawSquare(food.x, food.y, getRandomColor(),"rgba(1,1,1,0)",false);
    console.log("10");
  } else {
    drawSquare(food.x, food.y, "red","rgba(1,1,1,0)",false);
    console.log("!10");

  }

      ctx.fillStyle = "black";
  ctx.font = "20px Bradley Hand";
  ctx.fillText("Score: " + score, canvas.width/2, 30);
  ctx.fillText("High Score: " + highScore, canvas.width/2, 50);
}// Move the snake in the specified direction
function moveSnake() {
  let head = {x: snake[0].x, y: snake[0].y};

  if (direction === "right") {
    head.x += 1;
  } else if (direction === "left") {
    head.x -= 1;
  } else if (direction === "up") {
    head.y -= 1;
  } else if (direction === "down") {
    head.y += 1;
  }
  snake.unshift(head);



  if (snake[0].x === food.x && snake[0].y === food.y) {
    score++;
    pointsAudio.play();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore); // Store high score in local storage
    }
    food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
  } else {
    snake.pop();
  }
}

// Handle keyboard input
document.addEventListener("keydown", function(event) {
  if (event.code === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (event.code === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (event.code === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.code === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (event.code ==="KeyP") {
    isPower = true;
  } else if (event.code ==="KeyC") {
    isPower = false;
  }
  else if (event.code === 'Space') {
    if (!isRunning) {
        isRunning = true;
        gameLoop();
    } else {
    isPaused = !isPaused;
    ctx.font = "30px Bradley Hand";
    ctx.fillText("Paused", canvas.width/2, canvas.height/2);
    ctx.font = "20px Bradley Hand";
    ctx.fillText("Press Space to Continue", canvas.width/2, canvas.height/2 + 30);
    }
  }
});

const tapButton = document.getElementById("canvas");
tapButton.addEventListener("touchstart", function() {
  if (!isRunning) {
    isRunning = true;
    gameLoop();
} else {
    isPaused = !isPaused;
    ctx.font = "30px Bradley Hand";
    ctx.fillText("Paused", canvas.width/2, canvas.height/2);
    ctx.font = "20px Bradley Hand";
    ctx.fillText("Press Space to Continue", canvas.width/2, canvas.height/2 + 30);
  }
});

const leftButton = document.getElementById("left-button");
leftButton.addEventListener("touchstart", function() {
  if (direction !== "right") {
    direction = "left";
    console.log("left");
  }
});

const rightButton = document.getElementById("right-button");
rightButton.addEventListener("touchstart", function() {
  if (direction !== "left") {
    direction = "right";
  }
});

const upButton = document.getElementById("up-button");
upButton.addEventListener("touchstart", function() {
  if (direction !== "down") {
    direction = "up";
  }
});

const downButton = document.getElementById("down-button");
downButton.addEventListener("touchstart", function() {
  if (direction !== "up") {
    direction = "down";
  }
});

function resetGame() {
    // Reset game variables
    snake = [{x: 10, y: 10}];
    food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
    direction = "right";
    score = 0;
    highScore = localStorage.getItem("snakeHighScore") || 0;
  
    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Start new game loop
    gameLoop();
  }
  

// Run the game loop
function gameLoop() {
    if (!isRunning) {
        // Display start screen
        displayStartScreen();
        return;
      }
    if (isPaused) {
        // If the game is paused, do nothing and return
        setTimeout(gameLoop, GAME_SPEED);
        return;
      }
  moveSnake();
  drawBoard();
  if (snake[0].x < 0 || snake[0].x >= 20 || snake[0].y < 0 || snake[0].y >= 20) {
    
    score = 0;
    // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get a random image
  const gameOverImage = "/mike.png";
  gameOverAudio.play();
  chadAudio.pause();
  // Display the image
  const img = new Image();
  img.src = gameOverImage;
  img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    setTimeout(function() {resetGame();}, 3000);
  };
    return;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {

      score = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get a random image
      const gameOverImage = "/mike.png";
      gameOverAudio.play();
      chadAudio.pause();
      // Display the image
      const img = new Image();
      img.src = gameOverImage;
      img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setTimeout(function() {resetGame();}, 3000);
      };
      return;
    }
  }
  setTimeout(gameLoop, 100);
}

gameLoop();
