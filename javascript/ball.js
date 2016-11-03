/**
 *   Ball prototype. We bounce an image on screen representing the ball
 *
 * @constructor
 * @this {Ball}
  *
 */
 "use strict";
var animate = undefined;
var subject = require('./patterns/observer/Subject');

var Ball = function (id_Ball,context_) {

  this.imageBallView = document.getElementById(id_Ball);
  this.state = "stop"; //startdbl,startclick
  this.speed = 7; //1 - 20;
  this.context = context_;
  this.imageBallView.width = this.context.viewPortHeight*0.05;
  var self = this; //Artifici per fer funcionar setInterval
  this.getBallSelf = function(){return self;};

  this.directions = {
    NORTH:{dirX:0,dirY:-1},
    SOUTH:{dirX:0,dirY:1},
    EAST:{dirX:1,dirY:0},
    WEST:{dirX:-1,dirY:0},
    NORTH_EAST:{dirX:1,dirY:-1},
    SOUTH_EAST:{dirX:1,dirY:1},
    SOUTH_WEST:{dirX:-1,dirY:1},
    NORTH_WEST:{dirX:-1,dirY:-1},
  };
}; //END  Ball prototype constructor

//Ball inherits from subject (WARNING: REVIEW THIS CODE. IS NOT PROPER)
Ball.prototype = new subject();

Ball.prototype.setDirection = function(CARDINAL_POINT){
    this.dirX = this.directions[CARDINAL_POINT].dirX;
    this.dirY = this.directions[CARDINAL_POINT].dirY;
};

//We move the ball to the next point
Ball.prototype.move = function(){
       this.locate(parseInt(this.imageBallView.style.left)+(this.dirX*this.speed),parseInt(this.imageBallView.style.top)+(this.dirY*this.speed));
};

//Get ball coordinates
Ball.prototype.getPosition = function(){
     return {x:parseInt(this.imageBallView.style.left),y:parseInt(this.imageBallView.style.top)};
};

//Simply change direction sense. If we implement multi direction ball it should be a little bit more complicated
Ball.prototype.bounce = function(){
    this.dirX=this.dirX*(-1);
};

//We put ball in X,Y coordinates and check boundaries in order to change direction
Ball.prototype.locate = function(x,y){
    //Ball get out of boundaries from top or bottom
    if (y<=0 || y>=this.context.viewPortHeight-this.imageBallView.height) {
        this.dirY=this.dirY*(-1);
    }
    //Ball get out of boundaries on right or left side
    if (x<=0 || x>=this.context.viewPortWidth-this.imageBallView.width) this.dirX=this.dirX*(-1);

    this.imageBallView.style.left = (Math.round(x))+ 'px';
    this.imageBallView.style.top = (Math.round(y)) + 'px';

    //Ball notifies all observers she has been moving to the next point (WARNING: IT COULD BE OPTIMIZED)
    this.Notify(this);
 };

 //We should RAMDOMLY (NOT YET) choose ball direction and start moving from her current position
 Ball.prototype.start = function(){
    var self = this.getBallSelf();
    self.state = "run";
    self.setDirection("NORTH_WEST");
    animate=setInterval(function(){self.move();}, 8);
 };

 //Stop the ball
 Ball.prototype.stop = function(){
     this.state = "stop";
     clearTimeout(animate);
 };

module.exports = Ball;
