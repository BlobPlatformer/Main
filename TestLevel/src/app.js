"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');
const Tiles = require('./tiles');
const Camera = require('./camera');
const Vector = require('./vector');
const EntityManager = require('./entity-manager');
const ElfArcher = require('./enemies/archers/elf-archer');
const EnemyBird = require('./enemies/flying/bird');
const Diver = require('./enemies/flying/diver');
const OrcArcher = require('./enemies/archers/orc-archer');
const Orc = require('./enemies/melee/orc_basic');
const Skeleton = require('./enemies/melee/skeleton_basic');
const MasterMage = require('./enemies/mages/advanced_mage');
const MediumMage = require('./enemies/mages/medium_mage');
const BasicMage = require('./enemies/mages/basic_mage');
const Boss = require('./enemies/boss/boss');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player(160, 480);
var win = false;
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var groundHit = false;
var state = "level"; //levelSelectionScreen: "level", WinScreen: "win", PlayingLevel: "run"

var levelSelect = new Image();
levelSelect.src = 'assets/LevelSelector.png';

var spritesheet = new Image();
spritesheet.src = 'assets/blobGameLevelSheet.png';
var spriteArray = [{x: 0, y: 0}, {x: 16, y: 0},{x: 32, y: 0}, {x: 48, y: 0},{x: 64, y: 0}, {x: 80, y: 0},{x: 96, y: 0}, {x: 112, y: 0},{x: 128, y: 0},
					{x: 0, y: 16}, {x: 16, y: 16},{x: 32, y: 16}, {x: 48, y: 16},{x: 64, y: 16}, {x: 80, y: 16},{x: 96, y: 16}, {x: 112, y: 16},{x: 128, y: 16},
					{x: 0, y: 32}, {x: 16, y: 32},{x: 32, y: 32}, {x: 48, y: 32},{x: 64, y: 32}, {x: 80, y: 32},{x: 96, y: 32}, {x: 112, y: 32},{x: 128, y: 32},
					{x: 0, y: 48}, {x: 16, y: 48},{x: 32, y: 48}, {x: 48, y: 48},{x: 64, y: 48}, {x: 80, y: 48},{x: 96, y: 48}, {x: 112, y: 48},{x: 128, y: 48},
					{x: 0, y: 64}, {x: 16, y: 64},{x: 32, y: 64}, {x: 48, y: 64},{x: 64, y: 64}, {x: 80, y: 64},{x: 96, y: 64}, {x: 112, y: 64},{x: 128, y: 64},
					{x: 0, y: 80}, {x: 16, y: 80},{x: 32, y: 80}, {x: 48, y: 80},{x: 64, y: 80}, {x: 80, y: 80},{x: 96, y: 80}, {x: 112, y: 80},{x: 128, y: 80},
					{x: 0, y: 96}, {x: 16, y: 96},{x: 32, y: 96}, {x: 48, y: 96},{x: 64, y: 96}, {x: 80, y: 96},{x: 96, y: 96}, {x: 112, y: 96},{x: 128, y: 96},
					{x: 0, y: 112}, {x: 16, y: 112},{x: 32, y: 112}, {x: 48, y: 112},{x: 64, y: 112}, {x: 80, y: 112},{x: 96, y: 112}, {x: 112, y: 112},{x: 128, y: 112},
					{x: 0, y: 128}, {x: 16, y: 128},{x: 32, y: 128}, {x: 48, y: 128},{x: 64, y: 128}, {x: 80, y: 128},{x: 96, y: 128}, {x: 112, y: 128},{x: 128, y: 128}];

var tiles = new Tiles();
var map = tiles.getMap();
var blocks = tiles.getBlocks();

var camera = new Camera(canvas);

var bird = new EnemyBird({x:100, y: 1200}, {start: 0, end: canvas.width});
var diver = new Diver({x:700, y: 100}, {start: 0, end: canvas.width});
var orc = new Orc({x: 1600, y: 800}, tiles, camera);
var orc2 = new Orc({x: 2500, y: 800}, tiles, camera);
var orc3 = new Orc({x: 8000, y: 800}, tiles, camera);
var skelly = new Skeleton({x: 2800, y: 800}, tiles, camera);
var elfArcher = new ElfArcher({x: 5780, y: 100}, tiles);
var orcArcher = new OrcArcher({x: 10520, y: 100}, tiles);
var basic_mage = new BasicMage({x: 4220, y: 200}, tiles);
var medium_mage = new MediumMage({x: 1020, y: 200}, tiles);
var advanced_mage = new MasterMage({x: 1520, y: 200}, tiles);
var boss = new Boss({x: 1320, y: 800}, tiles);
var em = new EntityManager(player);


em.addBird(bird);
em.addEnemy(diver);
em.addEnemy(orc);
em.addEnemy(orc2);
em.addEnemy(orc3);
em.addEnemy(skelly);
em.addEnemy(elfArcher);
em.addEnemy(orcArcher);
em.addEnemy(basic_mage);
em.addEnemy(medium_mage);
em.addEnemy(boss);
//em.addEnemy(advanced_mage);


/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  //event.preventDefault();
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  //event.preventDefault();
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
      case "1":
    		if(state != "run") {
    			map = tiles.getMap(1);
    		}
    		state = "run"
    		break;
    	case "2":
    		if(state != "run") {
    			map = tiles.getMap(2);
    		}
    		state = "run"
    		break;
    	case "3":
    		if(state != "run") {
    			map = tiles.getMap(3);
    		}
    		state = "run"
    		break;
  }
}

window.onkeypress = function(event) {
  event.preventDefault();
  if(event.keyCode == 32 || event.keyCode == 31) {
    player.jump();
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  if(state == "run"){
    if( player.position.x > 16*700-160-34)
    {
        win = true;
        state = "level";
    }
    // if (!player.isdead){
    //   setTimeout(null, 1000);
    //   return true;
    // }
    // if (player.health <= 0){
    //   player.isdead = true;
    // }
    player.update(elapsedTime, input, tiles);

    if(player.velocity.y >= 0) {
      if(tiles.isFloor(player.position, {height: 32, width: 32}, camera)) {
        //player.velocity = {x:0,y:0};
        player.velocity.y = 0;
        player.floor = (Math.floor((player.position.y+32)/16) * 16)-32;
      }
      else {
        player.floor = player.position.y+player.velocity.y+1;
      }
    }
    em.birds.forEach(function(bird){
      bird.floor = player.floor+32;
    });

    camera.update(player);
    em.update(elapsedTime);
  }

}

function addFoes(){

}


/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */

function render(elapsedTime, ctx) {
  switch (state){
    case "run":
      ctx.save();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      renderBackgrounds(elapsedTime, ctx);

      /*var row;
      var col;
      for(var i=0; i<map.length; i++) {
        row = i%tiles.getWidth();
        col = Math.floor(i/tiles.getWidth());
        if(camera.onScreen({x:row*16,y:col*16}))
        {
          ctx.drawImage(
            spritesheet,
            spriteArray[map[i]-1].x,spriteArray[map[i]-1].y,16,16,
            row*16+camera.x,col*16+camera.y,16,16//+camera.y+(16*35),16,16
            );
        }
      }*/
      renderWorld(elapsedTime, ctx);
      if (!player.isdead){
        player.render(elapsedTime, ctx);
      }
      ctx.restore();
      renderGUI(elapsedTime, ctx);
      break;
    case "level":
      renderLevelSelection(elapsedTime, ctx);
      break;
    case "win":
      renderWinScreen(elapsedTime, ctx);
      break;

  }

}

function renderBackgrounds(elapsedTime, ctx) {
  var column = Math.floor(camera.x/16);
  var row = Math.floor(camera.y/16);
  var mapwidth = 700;
  var mapWidth = column+(canvas.width/16)+1;
  var mapHeight = row+(canvas.height/16)+1;




  ctx.save();
  ctx.translate(-camera.x,-camera.y);
  for(row; row<mapHeight; row++)
  {
    for(column; column<mapWidth; column++)
    {
      // ??

      ctx.drawImage(
        spritesheet,
        spriteArray[map[row*mapwidth+column]-1].x,spriteArray[map[row*mapwidth+column]-1].y,16,16,
        column*16,row*16,16,16
      );
    }
    column = Math.floor(camera.x/16);
  }
  ctx.restore();
}

function renderWorld(elapsedTime, ctx) {
ctx.save();
ctx.translate(-camera.x, -camera.y);
em.render(elapsedTime, ctx);
ctx.restore();
}

function renderWinScreen(elapsedTime, ctx) {
	renderLevelSelection(elapsedTime, ctx);
}
function renderLevelSelection(elapsedTime, ctx) {
	ctx.drawImage(
        levelSelect,
        0,0,1120,800,
        0,0,1120,800
      );
}

function renderGUI(elapsedTime, ctx) {

    var color; //color of health bar
    var barHeight = 750;
    ctx.fillText("Health", 60, barHeight+10);
    //draw HP background
    ctx.save();
    ctx.fillStyle="grey";
    ctx.fillRect(100, barHeight, 104, 12);
    ctx.restore();

    ctx.save();
    ctx.fillStyle="black";
    ctx.fillRect(102, barHeight+2, 100, 8);
    ctx.restore();

    if(win) {
        ctx.fillStyle="black";
        ctx.font = "80px serif"
        ctx.fillText("Level Complete", 16*700-600 ,1200)
    }

    //daw HP forground
    ctx.save();

    if (60 <= player.health){
        color = "#4CAF50";//green
    }
    else if (30 <= player.health && player.health < 60){
        color = "yellow";
    }
    else{
        color = "red";
    }
    ctx.fillStyle=color;
    ctx.strokeStyle=color;
    ctx.fillRect(102, barHeight+2, player.health, 8);
    ctx.restore();
}
