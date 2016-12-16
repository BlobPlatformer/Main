"use strict";

/* Classes and Libraries */
const Vector = require('../../vector');
const Spell = require('./spell');

/* Constants */
const MS_PER_FRAME = 1000/12;
const LEFT = "l";
const RIGHT = "r";
const IDLE_FRAME_MAX_X = 1;
const WALK_LEFT_FRAME_Y = 9;
const WALK_LEFT_FRAME_MAX_X = 9;
const WALK_RIGHT_FRAME_Y = 11;
const WALK_RIGHT_FRAME_MAX_X = 9;
const SHOOT_LEFT_FRAME_Y = 1;
const SHOOT_LEFT_FRAME_MAX_X = 7;
const SHOOT_RIGHT_FRAME_Y = 3;
const SHOOT_RIGHT_FRAME_MAX_X = 7;
const SHOOTING_FRAME = 6;
const MAX_Y_VELOCITY = 8;
const CANVAS_HEIGHT = 800;
const SPELL_CD = 1500;

/**
 * @module Mage
 * A class representing a mage enemy
 */
module.exports = exports = Mage;


/**
 * @constructor  Mage
 * Base class for enemies which shoot shoot spells
 * @param {Object} startingPosition, object containing x and y coords
 * @param {Image} image, source spritesheet
 * @param {Object} frame, object containing display properties including width and height
 * of the source frame (real size in the sprite sheet) and width and height of destination
 * frame (how it will be really displayed)
 * @param {Int} walkingRange, distance from which the mage starts moving towards the player
 * @param {Int} walkingSpeed, speed of walking
 * @param {Int} shootingRange, distance from which can mage start shooting
 * @param {Int} shootingSpeed, speed of shooting
 * @param {Int} spellSpeed, speed of an spell
 * @param {Int} tiles, checking if a mage is standing on a floor
 */
function Mage(startingPosition, image, frame, walkingRange, walkingSpeed, shootingRange, shootingSpeed, spell, tiles, type) {
  this.position = startingPosition;
  this.state = "idle";
  this.direction = LEFT;
  this.image = image;
  this.actualFrame = {
    x: 0,
    maxX: IDLE_FRAME_MAX_X,
    y: WALK_LEFT_FRAME_Y // Y frame is the same for WALK and IDLE state
  };
  this.frame = frame;
  this.walkingRange = walkingRange;
  this.walkingSpeed = walkingSpeed;
  this.shootingRange = shootingRange;
  this.shootingSpeed = shootingSpeed;
  this.spellsGenerated = 0;
  this.spellCooldown = 0;
  this.spell = spell;
  this.time = MS_PER_FRAME;
  this.type = type;
  // Gravity and other stuff
  this.floor = 16*35; // May be parametrized
  this.gravity = {x: 0, y: .1};
  this.velocity = {x: 0, y: 0};
  this.tiles = tiles;
}

/**
 * @function setFramesAccordingToState
 * Updates the mage frames based on his state
 */
Mage.prototype.setFramesAccordingToState = function() {
  switch (this.state) {
    case "idle":
    case "falling":
      if(this.direction == LEFT) {
        this.actualFrame.y = WALK_LEFT_FRAME_Y;
        this.actualFrame.x = 0;
        this.actualFrame.maxX = IDLE_FRAME_MAX_X;
      } else {
        this.actualFrame.y = WALK_RIGHT_FRAME_Y;
        this.actualFrame.x = 0;
        this.actualFrame.maxX = IDLE_FRAME_MAX_X;
      }
      break;
    case "shooting":
      if(this.direction == LEFT) {
        this.actualFrame.y = SHOOT_LEFT_FRAME_Y;
        this.actualFrame.maxX = SHOOT_LEFT_FRAME_MAX_X;
      } else {
        this.actualFrame.y = SHOOT_RIGHT_FRAME_Y;
        this.actualFrame.maxX = SHOOT_RIGHT_FRAME_MAX_X;
      }
      break;
  }
}

function onFloor() {
  var frame = {width: this.frame.dest_frame_width, height: this.frame.dest_frame_height};

  if (this.tiles.isFloor(this.position, frame)) {
    this.velocity.y = 0;
    this.floor = this.tiles.getFloor(this.position, frame);
  }
  else {
    if(this.velocity.y < MAX_Y_VELOCITY) this.velocity.y += this.gravity.y;
    this.floor = CANVAS_HEIGHT - 32;
  }
}

/**
 * @function update
 * Updates the mage enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {object} playerPosition, object containing x and y coords
 * @param {object} entityManager, object which maintains all particles
 */
Mage.prototype.update = function(elapsedTime, playerPosition, entityManager) {
  this.time -= elapsedTime;

  // Check if the enemy has landed or standing on the floor
  onFloor.call(this);
  this.position.y += this.velocity.y;

  if(this.time > 0) return;
  this.actualFrame.x = (this.actualFrame.x + 1) % this.actualFrame.maxX;

  if(this.state == "shooting") this.time = this.shootingSpeed;
  else this.time = MS_PER_FRAME;

  var vector = Vector.subtract(playerPosition, this.position);
  var magnitude = Vector.magnitude(vector);

  if(vector.x <= 0) this.direction = LEFT;
  else this.direction = RIGHT;

  // This if-else statement sets proper animation frames only
  if(magnitude > this.walkingRange || Math.abs(vector.y) > 120) {
    // Player is far away/above/under the mage, stay idle, change frames only
    this.state = "idle";
    this.velocity.x = 0;
    Mage.prototype.setFramesAccordingToState.call(this);
  }
  else {
    // Player has reached the shooting distance of the mage
    // Mage starts shooting towards the player
    if(this.spellCooldown <= 0)
    {
      this.state = "shooting";
    }
    else{
      this.state = "idle";
    }

    this.velocity.x = 0;
    Mage.prototype.setFramesAccordingToState.call(this);

    if(this.actualFrame.x == SHOOTING_FRAME && this.spellCooldown <= 0) {
      var spellVelocity = {x: (this.direction == LEFT)? -this.spell.speed : this.spell.speed, y: 0}
      entityManager.addParticle(new Spell({x: this.position.x, y: this.position.y + this.spell.shift}, spellVelocity, this.type));
      this.spellGenerated = this.spellGenerated + 1;
      this.spellCooldown = SPELL_CD;
    }
  }
  this.spellCooldown -= elapsedTime;
  //console.log(this.state);
}

/**
 * @function render
 * Renders the mage enemy in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Mage.prototype.render = function(elapasedTime, ctx) {
  ctx.drawImage(this.image,
                this.actualFrame.x * this.frame.source_frame_width,
                this.actualFrame.y * this.frame.source_frame_height,
                this.frame.source_frame_width,
                this.frame.source_frame_height,
                this.position.x,
                this.position.y,
                this.frame.dest_frame_width,
                this.frame.dest_frame_height
  );
}
