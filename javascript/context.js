/**
 * Context prototype.
 * With this object (Singleton) by the way. We manage game context: points, on/off, artifacts location
 * on screen. It is a bridge to reach all objects that compose the game
 *
 * @constructor
 * @this {Context}
 */
"use strict";

var artifact = require('./artifact');
var stick = require('./stick');

function Context(){
  this.score=0;
  this.state = "stop"; //STOP OR RUN
  this.restart();
}

Context.prototype.restart = function(){
    this.vpWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; //ViewportX
    this.vpHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//ViewportY

    if (this.ball) {
      this.ball.RemoveObserver(this.stick);
      this.ball.RemoveObserver(this.stick2);
    }

    this.ball = new artifact("bola",this);
    this.stick = new stick("stick","left",this);
    this.stick2 = new stick("stick2","right",this,true);

    //We put ball in the middle of the screen
    this.ball.locate((this.vpWidth/2)-(this.ball.imgObj.width/2),(this.vpHeight/2)-this.ball.imgObj.height);
    //Vertical dotted separator decoration
    var verticalSeparator = document.getElementById("vertical");
    var verticalSeparatorWidth = this.vpWidth * 0.02;
    verticalSeparator.style="left:"+(this.vpWidth/2-verticalSeparatorWidth/2)+";border-left: "+verticalSeparatorWidth+"px dotted #444; ";

};

Context.prototype.start = function(){
    this.state = "run";
    this.ball.start();
};

Context.prototype.stop = function(){
    this.state = "stop";
    this.ball.stop();
};

module.exports = Context;
