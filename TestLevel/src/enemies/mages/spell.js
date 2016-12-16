"use strict";

/* Constants */
const SPELL_LEFT = 0; // Frame position
const SPELL_RIGHT = 1; // Frame position

/* Classes and Libraries */
const Particle = require('../../particle');

/**
 * @module Spell
 * A class representing a spell
 */
module.exports = exports = Spell;

/**
 * @constructor Spell
 * Class for a spell fired by mages
 * @param {postion} starting postion in x, y for spell
 * @param {velocity} starting velocity off the spell
 */
function Spell(position, velocity, type) {
  var image =  new Image();
  var frame;

  var actualFrame = {x: (velocity.x < 0)? SPELL_LEFT : SPELL_RIGHT, y: 0};
  switch(type)
  {
    case "basic":
      frame = {source_frame_width: 18,
               source_frame_height: 17,
               dest_frame_width: 18,
               dest_frame_height: 17};
       image.src = 'assets/img/Sprite_Sheets/mage/spell_balls.png';
       break;
    case "med":
      frame = {source_frame_width: 42,
               source_frame_height: 11,
               dest_frame_width: 105,
               dest_frame_height: 27};
               image.src = 'assets/img/Sprite_Sheets/mage/missles.png';
               break;
    case "master":
      frame = {source_frame_width: 42,
               source_frame_height: 42,
               dest_frame_width: 126,
               dest_frame_height: 126};
               image.src = 'assets/img/Sprite_Sheets/mage/death.png';
      break;

  }


  Particle.call(this, position, velocity, image, actualFrame, frame);
}

/**
 * @function update
 * Updates the spell based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 */
Spell.prototype.update = function(elapsedTime) {
  Particle.prototype.update.call(this, elapsedTime);
}

/**
 * @function render
 * Renders the spell in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Spell.prototype.render = function(elapsedTime, ctx) {
  Particle.prototype.render.call(this, elapsedTime, ctx);
}

/**
 * @function getRandomInt
 * Genrates a random int between the given numbers
 * @param {min} minimum number that can be generated
 * @param {max} maximum number that can be generated
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
