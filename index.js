// Import stylesheets
import './style.scss';
//** all used  game variables */
import {variables} from './variables.js';
/**Begining */
const startButton = document.getElementById('startButton');
const win = document.getElementById('game-win');
const lost = document.getElementById('game-over');
const begin = document.getElementById('game-begin');
startButton.addEventListener('click', () => {
  begin.style.display = 'none';
  startGame();
});
win.addEventListener('click', () => {
  begin.style.display = 'block';
  win.style.display = 'none';
});
lost.addEventListener('click', () => {
  begin.style.display = 'block';
  lost.style.display = 'none';
});




// Game begins
let startGame = () => {
  const canvas = document.getElementById('canvas');
  /** App variables */
  let height = canvas.height = window.innerHeight - 20;
  let width = canvas.width = window.innerWidth - 20;
  let backgroundColor = variables.backgroundColor;

  let xBall = width / 2;
  let yBall = height - 60;
  let vXBall = variables.vXBall;
  let vYBall = variables.vYBall;
  let ballSize = variables.ballSize;
  let ballColor = variables.ballColor;

  let xBat = width / 2 - 40;
  let yBat = height - 10;
  let vBat = variables.vBat;
  let batWidth = variables.batWidth;
  let batHeight = variables.batHeight;
  let batColor = variables.batColor;

  let brickVCount = variables.brickVCount;
  let brickHCount = variables.brickHCount;
  let brickWidth = Math.floor(width / brickHCount);
  let brickHeight = Math.floor(height / (5 * brickVCount));
  let brickColor = variables.brickColor;
  let brickArray = [];
  let brickPad = variables.brickPad;

  let gameOver = false;
  let ctx = canvas.getContext('2d');

  /** Backgroung */
  let handleBackground = () => {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.closePath();
  }
  /** Block at the bottom */
  let drawBat = () => {
    ctx.beginPath();
    ctx.fillStyle = batColor;
    ctx.rect(xBat, yBat - batHeight, batWidth, batHeight);
    ctx.fill();
    ctx.closePath();
  }

  /** Ball */
  let clearAll = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    drawBat();
  }
  function drawBall() {
    clearAll();
    ctx.beginPath();
    ctx.arc(xBall, yBall, ballSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
    checkCollisionAndUpdate();
    updateBrick();
    if (!gameOver) {
      requestAnimationFrame(drawBall);
    }
  }
  let checkCollisionAndUpdate = () => {
    let xStatus = vXBall > 0 ? xBall + vXBall + ballSize : xBall + vXBall - ballSize;
    let yStatus = vYBall > 0 ? yBall + vYBall + ballSize : yBall + vYBall - ballSize;
    vXBall = xStatus > width || xStatus < 0 ? -vXBall : vXBall;
    updateYStatus(yStatus);
    xBall += vXBall;
    if (!gameOver) {
      yBall += vYBall;
    }
  }
  let updateYStatus = (yStatus) => {
    // debugger;
    if (yStatus < 0) {
      vYBall = -vYBall;
      return false;
    }
    if (yStatus > height - batHeight) {
      if (xBall + (ballSize) > xBat && xBall < (xBat + batWidth + ballSize)) {
        vYBall = -vYBall;
      } else {
        gameOver = true;
        gameIsOver();
      }
    }
  }
  function Brick() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.broken = false;
    /** x = i ; y = j from for loop */
    this.draw = (offsetX = null, offsetY = null) => {

      if (!this.broken) {
        this.offsetX = offsetX ? offsetX * brickWidth : this.offsetX;
        this.offsetY = offsetY ? offsetY * brickHeight : this.offsetY;
        ctx.beginPath();
        ctx.fillStyle = brickColor;
        ctx.rect(this.offsetX + brickPad, this.offsetY + brickPad, brickWidth - brickPad, brickHeight - brickPad);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
  Brick.prototype.checkCollision = function () {
    if (!this.broken) {
      if (
        (xBall > this.offsetX && xBall <= this.offsetX + brickWidth + ballSize)
        &&
        (yBall > this.offsetY && yBall <= this.offsetY + brickHeight + ballSize)
      ) {
        this.broken = true;
        /** Update brick broken */
        vXBall = -vXBall;
        vYBall = -vYBall;
        checkWin();
      }
    }
  }
  let updateBrick = () => {
    brickArray.map((brick) => {
      brick.checkCollision();
      brick.draw();
    })
  }
  let gameIsOver = () => {
    lost.style.display = 'block';
    // console.log('hello');
    // alert("GAME OVER");
    // document.location.reload();
  }
  let checkWin = () => {
    let notBroken = brickArray.filter(i => !i.broken)
    if (notBroken.length == 0) {
      gameOver = true;
      won();
    }
  }
  let won = () => {
    win.style.display = 'block';
  }

  /** Handle bat */
  (() => {
    document.addEventListener('keydown', (event) => {
      if (!gameOver) {
        if (event.keyCode == 39 && xBat + vBat < width - batWidth) {
          xBat += vBat;
        }
        if (event.keyCode == 37 && xBat - vBat > 0) {
          xBat -= vBat;
        }
        drawBat();
      }
    })
  })();

  /** Setup bricks */
  (() => {
    for (var i = 0; i < brickHCount; i++) {
      for (var j = 0; j < brickVCount; j++) {
        let brick = new Brick();
        brick.draw(i, j);
        brickArray.push(brick);
      }
    }
  })();
  drawBall();
}
// startGame();