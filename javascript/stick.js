/*
 * Crea una instància de Stick.
 * Amb aquest objecte creem la barra que el jugador té que controlar per fer rebotar la bola al sobre i no perdre vides
 *
 * @constructor
 * @this {Stick}
 * @param {id_stick} ,side {left or right}
 *
 */
var withObserver = require('./patterns/observer/Observer');

function Stick(id_stick,side,context) {

  this.imgObj = document.getElementById(id_stick);
  this.side= side || "left" ; //right or left,
  this.gap=50;    //Distance in pixels from side
  this.context = context;
  var self = this;
  //We inherit from observer using this functional mixin
  withObserver.call(Stick.prototype);
  //We enroll stick as a ball observer
	this.context.ball.AddObserver(this);

  //We move stick on y axis following mouse pointer location
  window.addEventListener("mousemove",
    function(e){
      y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      self.locate(self.gap,y);
  },false);

	//Draw stick on screen using coordinates
	this.locate = function(x,y){
        if (y>(this.context.vpHeight-this.imgObj.height)) y=this.context.vpHeight-this.imgObj.height;
		this.x=x;this.y=y;
		this.imgObj.style[this.side] = (Math.round(x))+ 'px';
		this.imgObj.style.top = (Math.round(y)) + 'px';
	};
  //As an Observer we should implement this mandatory method. Called
  //everytime the object we observe (in this case ball) call to Notify Subject metthod
  this.Update = function (ball){
        var pos=ball.getPosition();
        var limit=this.context.vpHeight - this.gap - ball.imgObj.width;
        if (pos.x>=this.x) {

            var distance=Math.abs((this.y+this.imgObj.height/2)-(pos.y+ball.imgObj.height/2));
            var minDistAllowed=(this.imgObj.height/2+ball.imgObj.height/2);
            if (distance<minDistAllowed) {
                ball.rebota();
            }
        }else{
            this.context.stop();
            alert("Game OVER");
            this.context.ball.locate((this.context.vpWidth/2)-this.context.ball.imgObj.width,(this.context.vpHeight/2)-this.context.ball.imgObj.height);  //Posicionem pilota al mig
        }
  };
}// End Stick Prototype

module.exports = Stick;
