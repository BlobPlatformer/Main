"use strict";

/* Classes and Libraries */
const Mage = require('./mage');


/* Constants */
const WALKING_RANGE_IN_PX = 600;
const WALKING_SPEED_IN_PX = 1;
const SHOOTING_RANGE_IN_PX = 350;
const SHOOTING_SPEED = 1000/13;
const SPELL_SPEED_IN_PX = 5;
const SPELL_SHIFT_IN_PX = -37; //Num of pixel to shift the spell down
const MAXIMUM_SPELLS_GENERATED = 1;
const FRAME = {source_frame_width: 64,
               source_frame_height: 64,
               dest_frame_width: 54,
               dest_frame_height: 54
};

/**
 * @module MasterMage
 * A class representing an mage enemy
 */
module.exports = exports = MasterMage;


/**
 * @constructor MasterMage
 * Class for an Master mage enemy which shoots spells
 * @param {Object} startingPosition, object containing x and y coords
 */
function MasterMage(startingPosition, tiles) {
  var image = new Image();
  image.src = 'assets/img/Sprite_Sheets/mage/master_mage'+ getRandomInt(1,3) +'.png';
  var spell = {speed: SPELL_SPEED_IN_PX, shift: SPELL_SHIFT_IN_PX};
  Mage.call(this, startingPosition, image, FRAME, WALKING_RANGE_IN_PX, WALKING_SPEED_IN_PX, SHOOTING_RANGE_IN_PX, SHOOTING_SPEED, spell, tiles, "master");
}


/**
 * @function update
 * Updates the Master mage enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {object} playerPosition, object containing x and y coords
 */
MasterMage.prototype.update = function(elapsedTime, playerPosition, entityManager) {
  Mage.prototype.update.call(this, elapsedTime, playerPosition, entityManager);
  this.spellsGenerated = 0;
}

/**
 * @function render
 * Renders the Master mage enemy in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
MasterMage.prototype.render = function(elapsedTime, ctx) {
  Mage.prototype.render.call(this, elapsedTime, ctx);
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
