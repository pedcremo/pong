/**
   prototype we bounce an image on screen
 *
 * @constructor
 * @this {Artifact}
  *
 */
 "use strict";
var animate = undefined;
var subject = require('./patterns/observer/Subject');

var Artifact = function (id_artifact,context_) {

  this.imgObj = document.getElementById(id_artifact);
  this.state = "stop"; //startdbl,startclick
  this.speed = 5; //1 - 20;
  this.context = context_;
  this.imgObj.width = this.context.vpHeight*0.05;
  var self=this; //Artifici per fer funcionar setInterval
  this.getArtifactSelf = function(){return self;};
  

  this.directions={
    NORTH:{dirX:0,dirY:-1},
    SOUTH:{dirX:0,dirY:1},
    EAST:{dirX:1,dirY:0},
    WEST:{dirX:-1,dirY:0},
    NORTH_EAST:{dirX:1,dirY:-1},
    SOUTH_EAST:{dirX:1,dirY:1},
    SOUTH_WEST:{dirX:-1,dirY:1},
    NORTH_WEST:{dirX:-1,dirY:-1}
  };
}; //END  Ball prototype constructor

//Heretem de subject (REVIEW IS NOT PROPER)
Artifact.prototype = new subject();

Artifact.prototype.setDirection = function(CARDINAL_POINT){
    this.dirX = this.directions[CARDINAL_POINT].dirX;
    this.dirY = this.directions[CARDINAL_POINT].dirY;
};

//método para cambiar el tamaño de la bola si hay cambio de screen
Artifact.prototype.setImage = function(){
    
    this.imgObj.width = this.context.vpHeight*0.05;
};

//Meneja la bola
Artifact.prototype.move = function(){
       this.locate(parseInt(this.imgObj.style.left)+(this.dirX*this.speed),parseInt(this.imgObj.style.top)+(this.dirY*this.speed));
        
}; //End move method

Artifact.prototype.getPosition = function(){
     return {x:parseInt(this.imgObj.style.left),y:parseInt(this.imgObj.style.top)};
};

Artifact.prototype.rebota = function(){
    this.dirX=this.dirX*(-1);
    //console.log("aqui debo cambiar direccion");
    //console.log("direccion de la bola: "+this.dirX);
};
//Posicionem Bola de manera absoluta en X i Y i comprovem llímits
Artifact.prototype.locate = function(x,y){
    //Ens eixim per dalt o per baix
    if (y<=0 || y>=this.context.vpHeight-this.imgObj.height) {
        this.dirY=this.dirY*(-1);
        
    }
    //Ens eixim per dreta o esquerre
    if (x<=0 || x>=this.context.vpWidth-this.imgObj.width) this.dirX=this.dirX*(-1);
        
    this.imgObj.style.left = (Math.round(x))+ 'px';
    this.imgObj.style.top = (Math.round(y)) + 'px';

    this.Notify(this);
 }; //End locate method

 //Sortejem direcció i comencem a moure la pola
 Artifact.prototype.start = function(){
    var self=this.getArtifactSelf();
    self.state = "run";
    self.setDirection("NORTH_WEST");
    animate=setInterval(function(){self.move();}, 8);
 };

 //Parem la bola
 Artifact.prototype.stop = function(){
     this.state = "stop";
     clearTimeout(animate);
 };

module.exports = Artifact;
