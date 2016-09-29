/**
   prototype we bounce an image on screen
 *
 * @constructor
 * @this {Artifact}
  *
 */

var Artifact = function (id_artifact) {

  this.imgObj = document.getElementById(id_artifact);
  this.state = "stop"; //startdbl,startclick

  var self=this; //Artifici per fer funcionar setInterval
  this.getArtifactSelf = function(){return self;};

 }; //END  Ball prototype

//Meneja la bola
Artifact.prototype.move= function(){
       //if (this.state=="runvertical") this.dirX=0;
       this.locate(parseInt(this.imgObj.style.left)+this.dirX,parseInt(this.imgObj.style.top)+this.dirY);
 }; //End move method

//Posicionem Bola de manera absoluta en X i Y i comprovem llímits
Artifact.prototype.locate = function(x,y){
    //Ens eixim per dalt o per baix
    if (y<=0 || y>=this.vpHeight-this.imgObj.height) {
        this.dirY=this.dirY*(-1);
    }
    //Ens eixim per dreta o esquerre
    if (x<=0 || x>=this.vpWidth-this.imgObj.width) this.dirX=this.dirX*(-1);

    this.imgObj.style.left = (Math.round(x))+ 'px';
    this.imgObj.style.top = (Math.round(y)) + 'px';

 }; //End locate method

 //Sortejem direcció i comencem a moure la pola
 Artifact.prototype.start = function(){
    var self=this.getArtifactSelf();
    animate=setInterval(function(){self.move();}, 5);
 };

 //Parem la bola
 Artifact.prototype.stop = function(){
     clearTimeout(animate);
 };

module.exports = Artifact;
