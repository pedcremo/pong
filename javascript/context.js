/**
 * Context prototype.
 * With this object (Singleton) by the way. We manage game context: points, on/off, artifacts location
 * on screen. It is a bridge to reach all objects that compose the game
 *
 * @constructor
 * @this {Context}
 */

var artifact = require('./artifact');
var stick = require('./stick');

function Context(){
  this.vpWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; //ViewportX
  this.vpHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//ViewportY
  this.score=0;
  this.state = "stop"; //STOP OR RUN
  this.ball = new artifact("bola",this);
  this.stick = new stick("stick","left",this);
  //We put ball in the middle of the screen 
  this.ball.locate((this.vpWidth/2)-this.ball.imgObj.width,(this.vpHeight/2)-this.ball.imgObj.height);  //Posicionem pilota al mig
}

Context.prototype.start = function(){
    this.state = "run";
    this.ball.start();
};

Context.prototype.stop = function(){
    this.state = "stop";
    this.ball.stop();
};

module.exports = Context;
