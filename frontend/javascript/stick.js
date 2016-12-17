"use strict";
/*jslint browser:true */
/*jslint node:true */
/*global $ */

//var withObserver = require('./patterns/observer/Observer');

/**
 * Create an instance of Stick.
 * This object let you move vertically using mouse pointer movements and hit the ball.
 *
 * @constructor
 * @param {string} id_stick - HTML Id attribute used to identify the stick
 * @param {string} sideLocation - Possible values "left" or "right"
 * @param {Context} context - An instance of game context that let you traverse all game objects
 * @param {boolean} autopilot - If true computer manage stick movement
 */

function Stick(id_stick,sideLocation,context,autopilot) {
  this.autopilot = autopilot || false;  //If true computer moves the stick automatically
  this.$imageStickView = $('#'+id_stick); //We get from index.html the image associated with the stick
  this.score = 0;
  this.sideLocation = sideLocation || "left" ; //right or left,
  this.gap = 50;    //Distance in pixels from sideLocation
  this.context = context;
  this.$imageStickView.height(this.context.viewPortHeight*0.2);

  this.stickY = 0;   // position
  this.stickVy = 0; // velocity & direction

  if (this.sideLocation == "left"){
      this.locate(this.gap,Math.round(this.context.viewPortHeight/2));
  }else{
      this.locate(this.context.viewPortWidth-this.$imageStickView.width()-this.gap,Math.round(this.context.viewPortHeight/2));
  }

  var self = this;

  $(document).on("mousemove touchmove",function(e){
      /** USED IN PCs: We move stick on y axis following mouse pointer location */
      var y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      /** USED IN TABLETS AND SMARTPHONES: We move stick on y axis following finger touching location */
      if (e.type == "touchmove")
        y =e.touches[0].pageY;
      if (!self.autopilot) self.locate(self.x,y-(self.$imageStickView.height()/2));
  });

  $('#'+id_stick).on("mousedown touchstart",function(e){e.preventDefault();self.autopilot=false;self.context.hideBanner()});
  $(window,'#'+id_stick).on("mouseup touchend",function(e){self.autopilot=true;self.context.showBanner("You should drag any stick with mouse or finger if you want to controll it")});

  /** As an Observer we should implement this mandatory method. Called
  *   everytime the object we observe (in this case ball) call to Notify Subject method
  */
  this.Update = function (ball){
      var ballPosition = ball.getPosition();
      var stickPosition = this.getPosition();

      var ballCloseStickLeftAndTowardsIt = (this.sideLocation == "left" && ((ballPosition.x + ball.ballVx) <= stickPosition.x+this.$imageStickView.width()) && ball.ballVx < 0);
      var ballCloseStickRightAndTowardsIt = (this.sideLocation == "right" && ((ballPosition.x + ball.ballVx + ball.$imageBallView.width()) >= stickPosition.x)) && ball.ballVx > 0;

      if (  ballCloseStickLeftAndTowardsIt || ballCloseStickRightAndTowardsIt) {
          var distance = (stickPosition.y+this.$imageStickView.height()/2)-(ballPosition.y+ball.$imageBallView.height()/2);
          var minDistAllowed = (this.$imageStickView.height()/2+ball.$imageBallView.height()/2);
          if (Math.abs(distance) < minDistAllowed) {
                ball.bounce(distance*100/minDistAllowed);
                this.consecutiveHits+=1;
          }else{
            if ((ballPosition.x <= 0) || (ballPosition.x >= this.context.viewPortWidth)){
                this.context.stop();
                if (this.sideLocation=="left"){
                    this.context.stickRight.increaseScore();
                    if (this.context.stickRight.score > 8) this.context.resetScores();
                }else{
                    this.context.stickLeft.increaseScore();
                    if (this.context.stickLeft.score > 8) this.context.resetScores();
                }

                //We locate ball on center
                this.context.ball.locate((this.context.viewPortWidth/2)-this.context.ball.$imageBallView.width(),(this.context.viewPortHeight/2)-this.context.ball.$imageBallView.height());  //Posicionem pilota al mig
            }
          }
      }
  };
}

/** Increase stick player owner score in one point */
Stick.prototype.increaseScore = function(){
     this.score+=1;
     var $scoreEl = $("#scorePlayerLeft");
     if (this.sideLocation === "right"){
         $scoreEl = $("#scorePlayerRight");
     }
     $scoreEl.text(this.score);
};

/** For scaling game objects (ball, sticks ...) when viewport changes*/
Stick.prototype.scaleAndRealocate = function(){
  this.$imageStickView.height(this.context.viewPortHeight*0.2);
  if (this.sideLocation == "left"){
    this.$imageStickView.css("left",this.gap+'px');
  }else{
    this.$imageStickView.css("left",this.context.viewPortWidth-this.$imageStickView.width()-this.gap);
  }
};

/** Draw and locate stick on screen using x,y coordinates */
Stick.prototype.locate = function(x,y){
    this.stickY = y;
    if (this.stickY < 0 ) this.stickY =0;
    var hp = this.$imageStickView.height();

    if (this.stickY > (this.context.viewPortHeight - this.$imageStickView.height())) this.stickY = this.context.viewPortHeight - this.$imageStickView.height();
    this.$imageStickView.css("left",(Math.round(x))+ 'px');
    this.$imageStickView.css("top",(Math.round(this.stickY)) + 'px');

    this.oldPosition  = this.getPosition();
};

/** Get stick x,y pixel location on screen */
Stick.prototype.getPosition = function(){
     return {x:parseInt(this.$imageStickView.css("left")),y:parseInt(this.$imageStickView.css("top"))};
};

/** We export whole prototype */
module.exports = Stick;
