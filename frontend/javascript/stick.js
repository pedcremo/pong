"use strict";
/*jslint browser:true */
/*jslint node:true */
/*global $ */

//var withObserver = require('./patterns/observer/Observer');
var utils = require('./utils');
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
  this.sideLocation = sideLocation || "left" ; //right or left,
  this.autopilot = autopilot || false;  //If true computer moves the stick automatically
  this.setAutopilot(this.autopilot);
  this.$imageStickView = $('#'+id_stick); //We get from index.html the image associated with the stick
  this.score = 0;
  this.consecutiveHits = 0;
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

  $('#'+id_stick).on("mousedown touchstart",function(e){
      e.preventDefault();
      //self.autopilot=false;
      self.setAutopilot(false);
      if (self.context.state === "stop") self.context.start();
      self.context.hideBanner();
  });

  $(window,'#'+id_stick).on("mouseup touchend",function(e){
      //self.autopilot=true;
      self.setAutopilot(true);
      self.context.showBanner("You should drag any stick with mouse or finger if you want to controll it");
  });

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
                this.context.increaseScore(this.sideLocation);
                //We locate ball on center
                this.context.ball.locate((this.context.viewPortWidth/2)-this.context.ball.$imageBallView.width(),(this.context.viewPortHeight/2)-this.context.ball.$imageBallView.height());  //Posicionem pilota al mig
                this.context.ball.ramdomDepartureAngle();
            }
          }
      }
  };
}
Stick.prototype.setAutopilot = function(true_or_false){
        this.autopilot = true_or_false;
        if (this.sideLocation === "left"){//EXAM
            if (this.autopilot){//EXAM
                $("#playerLeft").text("PC LEFT");//EXAM
                $("#profileImg").hide();//EXAM
            }else {
                $("#playerLeft").text(utils.getCookie("username"));//EXAM
                $("#profileImg").show().css("right","").css("left","10px");//EXAM
            }
        }else{//EXAM
            if (this.autopilot) {//EXAM
                $("#playerRight").text("PC RIGHT");//EXAM
                $("#profileImg").hide();//EXAM
            }else {
                $("#playerRight").text(utils.getCookie("username"));//EXAM
                $("#profileImg").show().css("left","").css("right","10px");//EXAM
            }
        }
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
