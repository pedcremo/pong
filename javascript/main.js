/**
 *  Pong  entry script
 *
 */
"use strict";

var utils = require('./utils');
var singletonContext = require('./patterns/singleton/singletonContext');

//Once the page has been completely loaded. Including images. We start the game
window.onload=function(){

    var context_ = singletonContext.getInstance();

    var startGame=function(event){
        event.preventDefault();
        utils.clearSelection();
        if (context_.state.match("run")){
          context_.stop();
        }else{
          context_.start();
        }
    };

    utils.checkCookie(function(){  window.addEventListener("keypress",startGame,false);});
    //On resize we restart context to adjust game elements to new viewport
    window.onresize = function() {
        context_.restart();
        //console.log("resize");
    };



};
