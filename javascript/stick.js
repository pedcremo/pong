"use strict";
/*jslint browser:true */
/*jslint node:true */

var withObserver = require('./patterns/observer/Observer');

/**
 * Create an instance of Stick.
 * This object let you move vertically using mouse pointer movements and hit the ball.
 *
 * @constructor
 * @param {string} id_stick - HTML Id attribute used to identify the stick
 * @param {string} sideLocation - Possivle values "left" or "right"
 * @param {Context} context - An instance of game context that let you traverse all game objects
 * @param {boolean} autopilot - If true computer manage stick movement
 */

function Stick(id_stick,sideLocation,context,autopilot) {
  this.autopilot = autopilot || false;  //If true computer moves the stick automatically
  this.imageStickView = document.getElementById(id_stick); //We get from index.html the image associated with the stick
  this.score = 0;
  this.sideLocation = sideLocation || "left" ; //right or left,
  this.gap = 50;    //Distance in pixels from sideLocation
  this.context = context;
  this.imageStickView.height = this.context.viewPortHeight*0.2;

  this.stickY = 0;   // position
  this.stickVy = 0; // velocity & direction

  if (this.sideLocation == "left"){
      this.locate(this.gap,Math.round(this.context.viewPortHeight/2));
  }else{
      //this.imageStickView.style.left=this.context.viewPortWidth-this.imageStickView.width-this.gap;
      this.locate(this.context.viewPortWidth-this.imageStickView.width-this.gap,Math.round(this.context.viewPortHeight/2));
  }

  var self = this;
  /** We inherit from observer using this functional mixin its a formality because Observer is a kind of abstract class */
  withObserver.call(Stick.prototype);
  /** We enroll stick as a ball observer */
  this.context.ball.AddObserver(this);

  if (! this.autopilot){
      /** We move stick on y axis following mouse pointer location */
      window.addEventListener("mousemove",
        function(e){
          var y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
          self.locate(self.x,y);
      },false);
  }

  /** As an Observer we should implement this mandatory method. Called
  *   everytime the object we observe (in this case ball) call to Notify Subject method
  */
  this.Update = function (ball){
      var ballPosition = ball.getPosition();
      var stickPosition = this.getPosition();

      var ballCloseStickLeftAndTowardsIt = (this.sideLocation == "left" && ((ballPosition.x + ball.ballVx) <= stickPosition.x+this.imageStickView.width) && ball.ballVx < 0);
      var ballCloseStickRightAndTowardsIt = (this.sideLocation == "right" && ((ballPosition.x + ball.ballVx + ball.imageBallView.width) >= stickPosition.x)) && ball.ballVx > 0;

      if (  ballCloseStickLeftAndTowardsIt || ballCloseStickRightAndTowardsIt) {
          var distance = (stickPosition.y+this.imageStickView.height/2)-(ballPosition.y+ball.imageBallView.height/2);
          var minDistAllowed = (this.imageStickView.height/2+ball.imageBallView.height/2);
          if (Math.abs(distance) < minDistAllowed) {
                ball.bounce(distance*100/minDistAllowed);
          }else{
            if ((ballPosition.x <= 0) || (ballPosition.x >= this.context.viewPortWidth)){
                this.context.stop();
                if (this.sideLocation=="left"){
                    this.context.stick2.increaseScore();
                }else{
                    this.context.stick.increaseScore();
                }
                //We locate ball on center
                this.context.ball.locate((this.context.viewPortWidth/2)-this.context.ball.imageBallView.width,(this.context.viewPortHeight/2)-this.context.ball.imageBallView.height);  //Posicionem pilota al mig
            }
          }
      }
  };
}

/** Increase stick player owner score in one point */
Stick.prototype.increaseScore = function(){
     this.score+=1;
     var scoreEl = document.getElementById("scorePlayerLeft");
     if (this.sideLocation === "right"){
         scoreEl = document.getElementById("scorePlayerRight");
     }
     scoreEl.innerHTML = this.score;
};

/** For scaling game objects (ball, sticks ...) when viewport changes*/
Stick.prototype.scaleAndRealocate = function(){
  this.imageStickView.height = this.context.viewPortHeight*0.2;
  if (this.sideLocation == "left"){
    this.imageStickView.style.left=this.gap+'px';
  }else{
    this.imageStickView.style.left=this.context.viewPortWidth-this.imageStickView.width-this.gap;
  }
};

/** Draw and locate stick on screen using x,y coordinates */
Stick.prototype.locate = function(x,y){
    this.stickY = y;
    if (this.stickY>(this.context.viewPortHeight-this.imageStickView.height)) this.stickY=this.context.viewPortHeight-this.imageStickView.height;
    this.imageStickView.style.left = (Math.round(x))+ 'px';
    this.imageStickView.style.top = (Math.round(this.stickY)) + 'px';
};

/** Get stick x,y pixel location on screen */
Stick.prototype.getPosition = function(){
     return {x:parseInt(this.imageStickView.style.left),y:parseInt(this.imageStickView.style.top)};
};

/** We export whole prototype */
module.exports = Stick;
