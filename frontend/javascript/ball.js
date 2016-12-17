 "use strict";
 /*jslint browser:true */
 /*jslint node:true */
 /*global $ */
 
/**
 * Ball prototype. We bounce an image on screen representing the ball
 *
 * @constructor
 * @param {string} id_Ball - html id property identifiyng ball
 * @param {Context} context_ - An instance of game context that let you traverse all game objects
 * @tutorial bouncing-ball-tutorial
 */

var Ball = function (id_Ball,context_) {
  this.$imageBallView = $("#"+id_Ball);

  this.state = "stop"; //startdbl,startclick

  this.ballX = 0; this.ballY = 0;   // position
  this.ballVx = 0; this.ballVy = 0; // velocity & direction

  this.context = context_;
  this.$imageBallView.width(this.context.viewPortHeight*0.05);
};

Ball.prototype.scaleAndRealocate = function(){
  this.$imageBallView.width(this.context.viewPortHeight*0.05);
};

/** Get ball coordinates */
Ball.prototype.getPosition = function(){
     return {x:parseInt(this.$imageBallView.css("left")),y:parseInt(this.$imageBallView.css("top"))};
};

/** Simply change direction sense and do an angle correction depending where ball have hit the stick
*   @param {number} stickRelativeBallHitPoint - If we hit on upper middle stick percentage positive otherwise negative we use this value to change ballVy
*/
Ball.prototype.bounce = function(stickRelativeBallHitPoint){
      this.ballVy += (stickRelativeBallHitPoint/100);
      if (this.ballVy > 1) this.ballVy = 1;
      if (this.ballVy < -1) this.ballVy = -1;
      this.ballVx = -this.ballVx;
};

/** We put ball in X,Y coordinates and check boundaries in order to change direction */
Ball.prototype.locate = function(x,y){
    this.ballX = x;
    this.ballY = y;
    //Ball get out of boundaries in top or bottom edges
    if (y<=0 || y>=this.context.viewPortHeight-this.$imageBallView.height() ){
        //If we reach top or bottom and directions have not been yet inverted we do it.We avoid annoying bug with multiple repeated bouncings on edges
        if ( (y <= 0 && this.ballVy <0 ) || (y>=this.context.viewPortHeight-this.$imageBallView.height()) && this.ballVy >0)
            this.ballVy = -this.ballVy;
    }

    this.$imageBallView.css("left",(Math.round(x))+ 'px');
    this.$imageBallView.css("top",(Math.round(y)) + 'px');

    //Ball notifies all observers if is under 25% viewport width or 75% onwards. Think it twice! Do we need patterns overburden for this game?
    if (x<((25*this.context.viewPortWidth)/100) || x> ((75*this.context.viewPortWidth)/100)){
        this.context.stickLeft.Update(this);
        this.context.stickRight.Update(this);
    }
 };

/** We RAMDOMLY choose ball direction and speed
* in this method and try not allow angles greater than 45 degrees in any
* of the four quarters
*/
Ball.prototype.ramdomDepartureAngle = function(){
    this.ballVx = 1;
    this.ballVy = Math.round(Math.random() * 100)/100;

    if (Math.round(Math.random()) === 0) this.ballVx = -this.ballVx;
    if (Math.round(Math.random()) === 0) this.ballVy = -this.ballVy;
};

module.exports = Ball;
