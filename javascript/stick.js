/*
 * Crea una instància de Stick.
 * Amb aquest objecte creem la barra que el jugador té que controlar per fer rebotar la bola al sobre i no perdre vides
 *
 * @constructor
 * @this {Stick}
 * @param {id_stick} ,side {left or right}
 *
 */
function Stick(id_stick,side) {

  this.imgObj = document.getElementById(id_stick);
	this.side= side || "left" ; //right,left,
	this.gap=25;    //From this.position in pixels
  var self = this;

  window.addEventListener("mousemove",
  function(e){
    y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    self.locate(self.gap,y);
  }
  ,false);
	//Posicionem stick a les coordenades x,y
	this.locate = function(x,y){
		this.x=x;this.y=y;
		this.imgObj.style[this.side] = (Math.round(x))+ 'px';
		this.imgObj.style.top = (Math.round(y)) + 'px';
	}
}// End Stick class

module.exports = Stick;
