"use strict";
/*jslint browser:true */
/*jslint node:true */
/*global $ */

var ball = require('./ball');
var stick = require('./stick');
var utils = require('./utils');

var animate;

var constants = {
        GAME_OVER_SHOW: 6000,//milliseconds
        POINTS_REQUIRED_TO_WIN: 9,//Points needed to win a game
        INCREASE_SPEED_STEP:0.1,
        IA_MAX_PIXEL_SPEED:10,
        CONSECUTIVE_HITS_TO_RAISE_SPEED:2
};
/**
 * Context prototype.
 * With this object (Singleton) by the way. We manage game context: points, on/off, balls location
 * on screen. It is a bridge that let you traverse whole game objects
 *
 * @constructor
 */
function Context(){
  this.lostPointSound = new Audio('sounds/lost_point.mp3'); //EXAM
  this.gameOverSound = new Audio('sounds/game_over.mp3'); //EXAM

  this.score=0;
  this.state = "stop"; //STOP OR RUN
  this.speed = 1.8; //1 - 20;
  this.incSpeed = 0; //Dynamic speed increasing
  this.restart();
  var self = this; //Trick to run setInterval properly
  this.initWebSockets();

  this.getContextSelf = function(){return self;};
  //If both paddles are autopilot we start the game directly
  if (this.stickLeft.autopilot && this.stickRight.autopilot) this.start();
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
    this.viewPortWidth = $(window).innerWidth();
    this.viewPortHeight = $(window).innerHeight();
    this.speed = this.viewPortWidth/1000;
    $("#scorePlayerLeft").css("font-size",this.viewPortHeight*0.2); //EXAM 10%
    $("#scorePlayerRight").css("font-size",this.viewPortHeight*0.2); //EXAM 10%

    //console.log(this.viewPortWidth+ " speed = "+this.speed);
    if (this.ball && this.stickLeft && this.stickRight) {
      this.ball.scaleAndRealocate();
      this.stickLeft.scaleAndRealocate();
      this.stickRight.scaleAndRealocate();
    }else{
      this.ball = new ball("bola",this);
      this.stickLeft = new stick("stickLeft","left",this,true);
      this.stickRight = new stick("stickRight","right",this,true);
    }

    /** We put ball in the middle of the screen */

    this.ball.locate((this.viewPortWidth/2)-(this.ball.$imageBallView.width()/2),(this.viewPortHeight/2)-this.ball.$imageBallView.height());
    /** Vertical dotted separator decoration */
    var verticalSeparatorWidth = this.viewPortWidth * 0.02;
    $("#vertical").css({
        "left":(this.viewPortWidth/2-verticalSeparatorWidth/2),
        "border-left": verticalSeparatorWidth+"px dotted #444"
    });
};

Context.prototype.showBanner = function(message,millis){
   $("#banner").show().text(message);
   if (millis && (millis !== 0))
    setInterval(this.hideBanner,millis);
};

/** Hide game informative Banner */
Context.prototype.hideBanner = function(){
    $("#banner").hide();
};

/** Start pong game */
Context.prototype.start = function(){
    var self = this.getContextSelf();
    self.state = "run";
    self.ball.ramdomDepartureAngle();
    self.lastTime = new Date();
    animate=setInterval(function(){self.animate();}, 1);
};

/** Reset pong game scores*/
Context.prototype.gameOver = function(){

   this.stop();
   var self = this.getContextSelf();//EXAM
   this.gameOverSound.play();//EXAM

   utils.getModalTemplate("game-over",function($template){ //EXAM
      if (self.stickLeft.score > self.stickRight.score){
          $("#winnerLeft").show();//EXAM
          $("#winnerRight").hide();//EXAM
          $("#gameOv").css("background-position","right");
      }else{
          $("#winnerLeft").hide();//EXAM
          $("#winnerRight").show();//EXAM
          $("#gameOv").css("background-position","left");
      }

      var func=function(){ //EXAM
          $template.fadeOut("slow",utils.chooseGameMode);
          self.resetScores();
      }; //EXAM
      setTimeout(func,constants.GAME_OVER_SHOW); //EXAM
   });
};

Context.prototype.resetScores = function(){
    this.stickLeft.score = 0;
    this.stickRight.score = 0;

    $("#scorePlayerLeft").text(this.stickLeft.score);
    $("#scorePlayerRight").text(this.stickRight.score);
};

Context.prototype.increaseScore = function(side_){
     this.lostPointSound.play();//EXAM
     var $scoreEl = $("#scorePlayerLeft");
     if (side_ == "left"){
        this.stickRight.score+=1;
        if (this.stickRight.score > constants.POINTS_REQUIRED_TO_WIN) this.gameOver();
        else $("#scorePlayerRight").text(this.stickRight.score);
     }else{
        this.stickLeft.score+=1;
        if (this.stickLeft.score > constants.POINTS_REQUIRED_TO_WIN) this.gameOver();
        else $("#scorePlayerLeft").text(this.stickLeft.score);
     }
     this.incSpeed = 0;
};

/** Stop pong game */
Context.prototype.stop = function(){
    this.state = "stop";
    //this.stickLeft.consecutiveHits=0;
    //this.stickRight.consecutiveHits=0;
    this.incSpeed = 0;
    clearTimeout(animate);

    //this.start();
};

Context.prototype.increaseSpeed = function(){
        this.incSpeed += constants.INCREASE_SPEED_STEP;
};
/** Animate one new game frame */
Context.prototype.animate =function(){
    if (this.stickLeft.autopilot) this.processAI(this.stickLeft);
    if (this.stickRight.autopilot) this.processAI(this.stickRight);

    var currTime = new Date();
    var millis = currTime.getTime() - this.lastTime.getTime();
    this.lastTime = currTime;
    var ball_ = this.ball;
    if (this.stickLeft.consecutiveHits >= constants.CONSECUTIVE_HITS_TO_RAISE_SPEED || this.stickRight.consecutiveHits >= constants.CONSECUTIVE_HITS_TO_RAISE_SPEED ){
        this.stickLeft.consecutiveHits=0;
        this.stickRight.consecutiveHits=0;
        this.increaseSpeed();
        console.log("incSpeed == "+this.incSpeed);
    }
    ball_.locate(ball_.ballX + ((ball_.ballVx*millis)*(this.speed+this.incSpeed)) , ball_.ballY + ((ball_.ballVy*millis)*(this.speed+this.incSpeed)) );
};

/** Arificial intelligence behind stick movements when it is autopiloted by the computer */
Context.prototype.processAI = function(stick_){
    var stickPos = stick_.getPosition();
    var StickMAXSPEED = constants.IA_MAX_PIXEL_SPEED; //Max pixel speed per frame
    var stickVy = 1;
    var iamLeftStickAndBallIsCloseAndTowardsMe = (stick_.sideLocation === "left" && (this.ball.ballX < (this.viewPortWidth/2)) && (this.ball.ballVx < 0) );
    var iamRightStickAndBallIsCloseAndTowardsMe = (stick_.sideLocation === "right" && (this.ball.ballX > (this.viewPortWidth/2)) && (this.ball.ballVx > 0) );

    if (iamLeftStickAndBallIsCloseAndTowardsMe || iamRightStickAndBallIsCloseAndTowardsMe) {
                var timeTilCollision = ((this.viewPortWidth-stick_.gap-stick_.$imageStickView.width()) - this.ball.ballX) / (this.ball.ballVx);
                if (stick_.sideLocation === "left") timeTilCollision = ((stick_.$imageStickView.width()+stick_.gap) - this.ball.ballX) / (this.ball.ballVx);

                var distanceWanted = (stickPos.y+(stick_.$imageStickView.height()/2)) - (this.ball.ballY+(this.ball.$imageBallView.width()/2));
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
