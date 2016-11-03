"use strict";
//We import Observer (pattern) because the stick it will observe ball movements
var withObserver = require('./patterns/observer/Observer');

/*
 * Crea una instància de Stick.
 * Amb aquest objecte creem la barra que el jugador té que controlar per fer rebotar la bola al sobre i no perdre vides
 *
 * @constructor
 * @this {Stick}
 * @param {id_stick} ,sideLocation {left or right}
 *
 */

function Stick(id_stick,sideLocation,context,autopilot) {
  this.autopilot = autopilot || false;  //If true computer moves the stick automatically
  this.imageStickView = document.getElementById(id_stick); //We get from index.html the image associated with the stick

  this.sideLocation = sideLocation || "left" ; //right or left,
  this.gap = 50;    //Distance in pixels from sideLocation
  this.context = context;
  this.imageStickView.height = this.context.viewPortHeight*0.2;
  this.sideLocation == "left"?this.imageStickView.style.left=this.gap+'px':this.imageStickView.style.left=this.context.viewPortWidth-this.imageStickView.width-this.gap;

  var self = this;
  //We inherit from observer using this functional mixin its a formality because Observer is a kind of abstract class
  withObserver.call(Stick.prototype);
  //We enroll stick as a ball observer
  this.context.ball.AddObserver(this);

  if (! this.autopilot){
      //We move stick on y axis following mouse pointer location
      window.addEventListener("mousemove",
        function(e){
          var y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
          self.locate(self.x,y);
      },false);
  }

  //As an Observer we should implement this mandatory method. Called
  //everytime the object we observe (in this case ball) call to Notify Subject method
  this.Update = function (ball){
      var ballPosition = ball.getPosition();
      var stickPosition = this.getPosition();

      if (this.autopilot) this.locate(stickPosition.x,(ballPosition.y-(Math.round(Math.random()))));
      //var limit=this.context.viewPortHeight - this.gap - ball.imageStickView.width;
      var ballCloseStickLeft = (this.sideLocation=="left" && ballPosition.x<=stickPosition.x+this.imageStickView.width);
      var ballCloseStickRight = (this.sideLocation=="right" && ballPosition.x+ball.imageBallView.width>=stickPosition.x);

      if (  ballCloseStickLeft || ballCloseStickRight) {
          var distance = Math.abs((stickPosition.y+this.imageStickView.height/2)-(ballPosition.y+ball.imageBallView.height/2));
          var minDistAllowed = (this.imageStickView.height/2+ball.imageBallView.height/2);
          if (distance < minDistAllowed) {
                ball.bounce();
          }else{
            if ((ballPosition.x < this.gap) || (ballPosition.x > this.context.viewPortWidth - this.gap)){
                this.context.stop();
                alert("Game OVER");
                //We locate ball on center
                this.context.ball.locate((this.context.viewPortWidth/2)-this.context.ball.imageBallView.width,(this.context.viewPortHeight/2)-this.context.ball.imageBallView.height);  //Posicionem pilota al mig
            }
          }
      }
  };
}// End Prototype

//Draw and locate stick on screen using x,y coordinates
Stick.prototype.locate = function(x,y){
    if (y>(this.context.viewPortHeight-this.imageStickView.height)) y=this.context.viewPortHeight-this.imageStickView.height;
    this.imageStickView.style.left = (Math.round(x))+ 'px';
    this.imageStickView.style.top = (Math.round(y)) + 'px';
};

//Get stick x,y position on screen
Stick.prototype.getPosition = function(){
     return {x:parseInt(this.imageStickView.style.left),y:parseInt(this.imageStickView.style.top)};
};

//We export whole prototype
module.exports = Stick;
