"use strict";
/*jslint browser:true */
/*jslint node:true */

var ball = require('./ball');
var stick = require('./stick');

var animate;
/**
 * Context prototype.
 * With this object (Singleton) by the way. We manage game context: points, on/off, balls location
 * on screen. It is a bridge that let you traverse whole game objects
 *
 * @constructor
 */
function Context(){
  this.score=0;
  this.state = "stop"; //STOP OR RUN
  this.speed = 1.8; //1 - 20;
  this.restart();
  var self = this; //Trick to run setInterval properly
  this.initWebSockets();

  this.getContextSelf = function(){return self;};
  //If both paddles are autopilot we start the game directly
  if (this.stick.autopilot && this.stick2.autopilot) this.start();
}

Context.prototype.initWebSockets = function(){
    this.socket = io(); //Third party lib loaded on html not included with require


    this.socket.on('stick id and position',function(msg){
        console.log(msg);
    });
    this.socket.on('ball position',function(msg){
        console.log(msg);
    });
};

/** Restart pong game after a resizing event*/
Context.prototype.restart = function(){
    this.viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; //ViewportX
    this.viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//ViewportY
    this.speed = this.viewPortWidth/1000;
    console.log(this.viewPortWidth+ " speed = "+this.speed);
    if (this.ball && this.stick && this.stick2) {
      this.ball.scaleAndRealocate();
      this.stick.scaleAndRealocate();
      this.stick2.scaleAndRealocate();
    }else{
      this.ball = new ball("bola",this);
      this.stick = new stick("stick","left",this,true);
      this.stick2 = new stick("stick2","right",this,true);
    }

    /** We put ball in the middle of the screen */
    this.ball.locate((this.viewPortWidth/2)-(this.ball.imageBallView.width/2),(this.viewPortHeight/2)-this.ball.imageBallView.height);
    /** Vertical dotted separator decoration */
    var verticalSeparator = document.getElementById("vertical");
    var verticalSeparatorWidth = this.viewPortWidth * 0.02;
    verticalSeparator.setAttribute("style","left:"+(this.viewPortWidth/2-verticalSeparatorWidth/2)+";border-left: "+verticalSeparatorWidth+"px dotted #444; ");
};

Context.prototype.showBanner = function(message,millis){
   var  bannerEl = document.getElementById("banner");
   bannerEl.style.display = "block";
   bannerEl.innerHTML = message;
   if (millis && (millis !== 0))
    setInterval(this.hideBanner,millis);
};

/** Hide game informative Banner */
Context.prototype.hideBanner = function(){
    var  bannerEl = document.getElementById("banner");
    bannerEl.style.display = "none";
};

/** Start pong game */
Context.prototype.start = function(){
    //this.state = "run";
    var self = this.getContextSelf();
    self.state = "run";
    self.ball.ramdomDepartureAngle();
    self.lastTime = new Date();
    animate=setInterval(function(){self.animate();}, 1);
};

/** Reset pong game scores*/
Context.prototype.resetScores = function(){
   this.stick.score = 0;
   this.stick2.score = 0;
   var scoreLeftEl = document.getElementById("scorePlayerLeft");
   var scoreRightEl = document.getElementById("scorePlayerRight");
   scoreLeftEl.innerHTML = this.stick.score;
   scoreRightEl.innerHTML = this.stick2.score;
};

/** Stop pong game */
Context.prototype.stop = function(){
    this.state = "stop";
    clearTimeout(animate);
    //if (this.stick.autopilot && this.stick2.autopilot) this.start();
    this.start();
};

/** Animate one new game frame */
Context.prototype.animate =function(){
    if (this.stick.autopilot) this.processAI(this.stick);
    if (this.stick2.autopilot) this.processAI(this.stick2);

    var currTime = new Date();
    var millis = currTime.getTime() - this.lastTime.getTime();
    this.lastTime = currTime;
    var ball_ = this.ball;
    ball_.locate(ball_.ballX + ((ball_.ballVx*millis)*this.speed) , ball_.ballY + ((ball_.ballVy*millis)*this.speed) );
};

/** Arificial intelligence behind stick movements when it is autopiloted by the computer */
Context.prototype.processAI = function(stick_){
    var stickPos = stick_.getPosition();
    var StickMAXSPEED = 10; //Max pixel speed per frame
    var stickVy = 1;
    var iamLeftStickAndBallIsCloseAndTowardsMe = (stick_.sideLocation === "left" && (this.ball.ballX < (this.viewPortWidth/2)) && (this.ball.ballVx < 0) );
    var iamRightStickAndBallIsCloseAndTowardsMe = (stick_.sideLocation === "right" && (this.ball.ballX > (this.viewPortWidth/2)) && (this.ball.ballVx > 0) );

    if (iamLeftStickAndBallIsCloseAndTowardsMe || iamRightStickAndBallIsCloseAndTowardsMe) {
                var timeTilCollision = ((this.viewPortWidth-stick_.gap-stick_.imageStickView.width) - this.ball.ballX) / (this.ball.ballVx);
                if (stick_.sideLocation === "left") timeTilCollision = ((stick_.imageStickView.width+stick_.gap) - this.ball.ballX) / (this.ball.ballVx);

                var distanceWanted = (stickPos.y+(stick_.imageStickView.height/2)) - (this.ball.ballY+(this.ball.imageBallView.width/2));
                var velocityWanted = -distanceWanted / timeTilCollision;
                if(velocityWanted > StickMAXSPEED)
                    stickVy = StickMAXSPEED;
                else if(velocityWanted < -StickMAXSPEED)
                    stickVy = -StickMAXSPEED;
                else
                    stickVy = velocityWanted*3;
                stick_.locate(stickPos.x,stick_.stickY + stickVy);
    }
};

module.exports = Context;
